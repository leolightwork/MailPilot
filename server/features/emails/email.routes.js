import { Router } from 'express';
import Customer from './email.schema.js';
import { scheduleEmail, cancelJob } from './email.scheduler.js';

const router = Router();

router.post('/upload', async (req, res) => {
  try {
    const newEmailUpload = new Customer(req.body);
    await newEmailUpload.save();
    scheduleEmail(newEmailUpload);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getemails', async (req, res) => {
  try {
    const listOfEmails = await Customer.find();
    res.status(200).json(listOfEmails);
  } catch (error) {
    res.status(500).json({ error: 'Info Not Found...' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    ids.forEach(cancelJob);
    const result = await Customer.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
