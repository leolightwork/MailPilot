import cron from 'node-cron';
import Customer from './email.schema.js';
import { sender } from './email.mailer.js';

// Tracks running jobs: customerId (string) → cron Task
const activeJobs = new Map();

// Parses "DD/MM/YYYY HH:mm" → Date object
function parseDate(dateStr) {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  return new Date(+year, +month - 1, +day, +hour, +minute);
}

// "DD/MM/YYYY HH:mm" → cron expression "m h d M *"
function toCron(dateStr) {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  return `${+minute} ${+hour} ${+day} ${+month} *`;
}

// Adds `days` to a "DD/MM/YYYY HH:mm" string, returns same format
function addDays(dateStr, days) {
  const next = parseDate(dateStr);
  next.setDate(next.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(next.getDate())}/${pad(next.getMonth() + 1)}/${next.getFullYear()} ${pad(next.getHours())}:${pad(next.getMinutes())}`;
}

export function scheduleEmail(customer) {
  const id = customer._id.toString();

  // Cancel any existing job for this customer
  if (activeJobs.has(id)) {
    activeJobs.get(id).stop();
    activeJobs.delete(id);
  }

  const scheduledDate = parseDate(customer.date);
  const now = new Date();

  // Main fix that solved the issue of current time emails not being sent
  if (scheduledDate <= new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1)) {
    if (scheduledDate < now) {
      console.log(`Sending immediately (past due) for ${customer.emailAddress}: ${customer.date}`);
    } else {
      console.log(`Sending immediately (current minute) for ${customer.emailAddress}: ${customer.date}`);
    }
    sender(customer)
      .then(async () => {
        if (customer.repeat > 0) {
          const nextDate = addDays(customer.date, customer.repeat);
          await Customer.findByIdAndUpdate(customer._id, { date: nextDate });
          scheduleEmail({ ...customer.toObject?.() ?? customer, date: nextDate });
        } else {
          await Customer.findByIdAndDelete(customer._id);
        }
      })
      .catch((err) => console.error(`Failed to send to ${customer.emailAddress}:`, err.message));
    return;
  }

  const expr = toCron(customer.date);
  if (!cron.validate(expr)) {
    console.error(`Invalid cron expression for ${customer.emailAddress}: ${expr}`);
    return;
  }

  const task = cron.schedule(expr, async () => {
    try {
      await sender(customer);

      if (customer.repeat > 0) {
        // Recurring: advance the date and reschedule
        const nextDate = addDays(customer.date, customer.repeat);
        await Customer.findByIdAndUpdate(customer._id, { date: nextDate });
        task.stop();
        scheduleEmail({ ...customer.toObject?.() ?? customer, date: nextDate });
      } else {
        // One-time: clean up
        task.stop();
        activeJobs.delete(id);
        await Customer.findByIdAndDelete(customer._id);
      }
    } catch (err) {
      console.error(`Failed to send to ${customer.emailAddress}:`, err.message);
    }
  });

  activeJobs.set(id, task);
  console.log(`Scheduled: ${customer.emailAddress} → ${customer.date}${customer.repeat > 0 ? ` (every ${customer.repeat}d)` : ''}`);
}

// Called once on server startup — picks up any emails already in the DB
export async function loadAndScheduleAll() {
  const customers = await Customer.find();
  customers.forEach(scheduleEmail);
  console.log(`MailPilot: ${customers.length} email(s) loaded from DB`);
}

// Cancels a job when an email is deleted
export function cancelJob(id) {
  const strId = id.toString();
  if (activeJobs.has(strId)) {
    activeJobs.get(strId).stop();
    activeJobs.delete(strId);
  }
}
