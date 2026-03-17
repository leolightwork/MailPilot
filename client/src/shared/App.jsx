import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MainCard from '../features/emails/MainCard.jsx';
import EmailList from '../features/emails/EmailList.jsx';
import Login from '../features/auth/Login.jsx';
import Signup from '../features/auth/Signup.jsx';
import './global.css';
import './header.css';

const Sidebar = () => {
  const location = useLocation();
  const isCreate = location.pathname === '/' || location.pathname === '/create';
  const isList = location.pathname === '/list';
  const isLogin = location.pathname === '/login';
  const isSignup = location.pathname === '/signup';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">✈</span>
        <span className="logo-text">MailPilot</span>
      </div>

      <nav className="sidebar-nav">
        <Link to="/create" className={`nav-link${isCreate ? ' active' : ''}`}>
          <span className="nav-icon">✉</span>
          Create
        </Link>
        <Link to="/list" className={`nav-link${isList ? ' active' : ''}`}>
          <span className="nav-icon">☰</span>
          Email List
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/login" className={`auth-link${isLogin ? ' auth-link--active' : ''}`}>Login</Link>
        <Link to="/signup" className={`auth-link${isSignup ? ' auth-link--active' : ''}`}>Sign Up</Link>
      </div>
    </aside>
  );
};

const App = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainCard />} />
          <Route path="/create" element={<MainCard />} />
          <Route path="/list" element={<EmailList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
