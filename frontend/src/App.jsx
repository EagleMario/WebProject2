import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AiChatWidget from './components/AiChatWidget';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

function App() {
  const { user } = useAuth();

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
    </>
  );
}

export default App;
