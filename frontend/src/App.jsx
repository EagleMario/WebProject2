import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useNotifications } from './context/NotificationContext';
import Navbar from './components/Navbar';
import AiChatWidget from './components/AiChatWidget';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

// Inject shimmer keyframe once
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;
document.head.appendChild(style);

const shimmerStyle = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '800px 100%',
  animation: 'shimmer 1.4s infinite linear',
  borderRadius: '6px',
};

const skeletonBar = (width, height) => ({
  ...shimmerStyle,
  width,
  height: `${height}px`,
  borderRadius: '6px',
});

const skeletonCircle = (size) => ({
  ...shimmerStyle,
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  flexShrink: 0,
});

function App() {

  const { user, loading } = useAuth();
  const { emergencyAlert, setEmergencyAlert } = useNotifications();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(0,68,148,0.15) 0%, #0a0a0c 50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        fontFamily: "'Outfit', sans-serif"
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            fontSize: '2.2rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffffff, #00f0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-1px'
          }}>
            🎓 Mario School
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading your dashboard...</p>
        </div>

        {/* Skeleton Card */}
        <div style={{
          background: 'rgba(19, 20, 26, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,240,255,0.15)',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={skeletonCircle(52)} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={skeletonBar('60%', 16)} />
              <div style={skeletonBar('40%', 12)} />
            </div>
          </div>
          {/* Stat cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={skeletonBar('50%', 10)} />
                <div style={skeletonBar('70%', 22)} />
              </div>
            ))}
          </div>
          {/* Table rows */}
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={skeletonCircle(32)} />
              <div style={skeletonBar(`${40 + i*10}%`, 12)} />
              <div style={{ ...skeletonBar('15%', 12), marginLeft: 'auto' }} />
            </div>
          ))}
        </div>

        {/* Spinner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          <div style={{
            width: '18px', height: '18px',
            border: '2px solid rgba(0,240,255,0.2)',
            borderTopColor: '#00f0ff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          Connecting to server... this may take up to 50s on first load
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      
      <div className="container">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/" 
            element={
              !user ? (
                <Navigate to="/login" />
              ) : user.role === 'Teacher' || user.role === 'teacher' ? (
                <TeacherDashboard />
              ) : user.role === 'Manager' || user.role === 'manager' ? (
                <ManagerDashboard />
              ) : (
                <StudentDashboard />
              )
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {user && <AiChatWidget />}

      {emergencyAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Outfit', sans-serif"
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #200b0b, #3d0c0c)',
            border: '2px solid #ff3b30',
            boxShadow: '0 0 40px rgba(255, 59, 48, 0.4), inset 0 0 20px rgba(255, 59, 48, 0.2)',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '90%',
            maxWidth: '550px',
            textAlign: 'center',
            color: 'white',
            boxSizing: 'border-box'
          }}>
            <div style={{
              fontSize: '4rem',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              🚨
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#ff3b30',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 1rem 0',
              textShadow: '0 0 10px rgba(255, 59, 48, 0.5)'
            }}>
              Emergency Alert
            </h2>
            <div style={{
              fontSize: '1.15rem',
              lineHeight: '1.6',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,59,48,0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.8rem',
              textAlign: 'left',
              wordBreak: 'break-word',
              color: '#ffe5e5'
            }}>
              {emergencyAlert.message}
            </div>
            
            <div style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '2rem'
            }}>
              Sent at: {new Date(emergencyAlert.Timestamp).toLocaleString()}
            </div>

            <button
              onClick={() => setEmergencyAlert(null)}
              style={{
                background: '#ff3b30',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
