import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [level, setLevel] = useState(1);
  const [teacherSubject, setTeacherSubject] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const additionalData = role === 'Teacher' ? { teacherSubject, employeeId } : { level: Number(level) };
        await signup(name, email, password, role, additionalData);
        setIsLogin(true);
        setSuccessMsg('Registration successful! Please log in to continue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Welcome Back' : 'Join Mario School'} // MARIO THEME
        </h1>
        
        {error && (
          <div className="badge badge-success" style={{ 
            background: 'rgba(255, 0, 85, 0.1)', 
            color: 'var(--danger)', 
            border: '1px solid var(--danger)',
            display: 'block', 
            textAlign: 'center', 
            marginBottom: '1.5rem',
            padding: '0.75rem' 
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="badge badge-success" style={{ 
            display: 'block', 
            textAlign: 'center', 
            marginBottom: '1.5rem',
            padding: '0.75rem' 
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Mario Bros"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="mario@school.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="Teacher">Teacher</option>  
              </select>
            </div>
          )}

          {!isLogin && role === 'student' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="form-group">
                <label>Academic Level (Year)</label>
                <select value={level} onChange={e => setLevel(e.target.value)}>
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>
            </div>
          )}

          {!isLogin && role === 'Teacher' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="form-group">
                <label>Subject Specialization</label>
                <input 
                  type="text" 
                  required 
                  value={teacherSubject} 
                  onChange={e => setTeacherSubject(e.target.value)} 
                  placeholder="e.g. Mathematics, Physics"
                />
              </div>
              <div className="form-group">
                <label>Employee ID / Staff ID</label>
                <input 
                  type="text" 
                  required 
                  value={employeeId} 
                  onChange={e => setEmployeeId(e.target.value)} 
                  placeholder="e.g. TCH-2024-001"
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-neon)', cursor: 'pointer', fontWeight: '500' }}
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
