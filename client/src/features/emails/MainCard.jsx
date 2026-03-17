import { useForm } from 'react-hook-form';
import './main-card.css';
import { useEffect } from 'react';

const MainCard = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (formData) => {
    const [datePart, timePart] = formData.date.split('T');
    const [year, month, day] = datePart.split('-');
    const formattedDate = `${day}/${month}/${year} ${timePart}`;

    const payload = {
      emailAddress: formData.email,
      course: formData.course,
      date: formattedDate,
      repeat: Number(formData.interval),
    };

    try {
      const res = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server Error');
      }
    } catch {
      console.log('Submission Failed');
    }
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="card-page">
      <div className="create-card">
        <div className="create-card-header">
          <h2 className="create-card-title">New Reminder</h2>
          <p className="create-card-subtitle">Schedule an automated email submission</p>
        </div>

        <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h3 className="form-section-label">Details</h3>

            <div className="form-group">
              <label className="field-label" htmlFor="email">Recipient Email</label>
              <input
                id="email"
                type="email"
                className={`field-input${errors.email ? ' field-input--error' : ''}`}
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  validate: (value) => value.includes('@') || 'Email must include @',
                })}
              />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="course">Course</label>
              <input
                id="course"
                type="text"
                className="field-input"
                placeholder="Course name or subject"
                {...register('course', { required: true })}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-label">Schedule</h3>

            <div className="form-group">
              <label className="field-label" htmlFor="date">Send Date & Time</label>
              <input
                id="date"
                type="datetime-local"
                className="field-input"
                {...register('date', { required: true })}
              />
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="interval">Repeat Interval</label>
              <div className="field-with-hint">
                <input
                  id="interval"
                  type="number"
                  min={0}
                  className="field-input"
                  placeholder="0"
                  {...register('interval', { required: true })}
                />
                <span className="field-hint">days between reminders — 0 for one-time</span>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Reminder
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainCard;
