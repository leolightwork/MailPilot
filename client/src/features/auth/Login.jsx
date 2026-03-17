import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Login failed');
    } catch {
      console.log('Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">Welcome back</h2>
          <p className="auth-card-subtitle">Log in to your MailPilot account</p>
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
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="auth-submit-btn">Log in</button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-switch-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
