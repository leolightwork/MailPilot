import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './auth.css';

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!res.ok) throw new Error('Registration failed');
    } catch {
      console.log('Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">Create account</h2>
          <p className="auth-card-subtitle">Start scheduling your email reminders</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`field-input${errors.email ? ' field-input--error' : ''}`}
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`field-input${errors.password ? ' field-input--error' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              className={`field-input${errors.confirm ? ' field-input--error' : ''}`}
              placeholder="••••••••"
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirm && <span className="field-error">{errors.confirm.message}</span>}
          </div>

          <button type="submit" className="auth-submit-btn">Create account</button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-switch-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
