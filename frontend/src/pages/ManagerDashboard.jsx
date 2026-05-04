import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  Plus,
  Settings,
  Search,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Calendar,
  Clock
} from 'lucide-react';

const LEVELS = [1, 2, 3, 4];
const ClassItemCard = ({ cls, onOpenDetails, onAddStudents, onDelete, onEdit }) => {
  const studentCount = cls.students?.length || 0;
  const hasTeachers = (cls.teachers?.length || 0) > 0;
  const isClassActive = hasTeachers && studentCount > 0;
  const fillPercent = Math.round((studentCount / 20) * 100);

  return (
    <div
      onClick={() => onOpenDetails(cls)}
      style={{
        background: 'linear-gradient(145deg, rgba(13,14,22,0.9), rgba(22,24,38,0.95))',
        border: '1px solid rgba(0, 240, 255, 0.1)',
        borderLeft: '3px solid rgba(0, 240, 255, 0.55)',
        borderRadius: '12px',
        padding: '0.9rem 1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderLeftColor = '#00f0ff';
        e.currentTarget.style.borderColor = 'rgba(0,240,255,0.28)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,240,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderLeftColor = 'rgba(0, 240, 255, 0.55)';
        e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Class name + Active badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.45rem' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {cls.className}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-neon)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px', opacity: 0.8 }}>
            {cls.subject}
          </div>
        </div>
        {isClassActive && (
          <span style={{
            flexShrink: 0, fontSize: '0.6rem', fontWeight: '700',
            padding: '2px 7px', borderRadius: '20px',
            background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88',
            border: '1px solid rgba(0, 255, 136, 0.22)',
            letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>Active</span>
        )}
      </div>

      {/* Enrollment bar */}
      <div style={{ marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <span>Enrollment {studentCount}/20</span>
          <span style={{ fontWeight: '700', color: fillPercent >= 80 ? '#ff9944' : 'var(--accent-neon)' }}>{fillPercent}%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${fillPercent}%`,
            background: fillPercent >= 80
              ? 'linear-gradient(to right, #ff6600, #ffaa00)'
              : 'linear-gradient(to right, #0070f3, #00f0ff)',
            borderRadius: '99px',
            boxShadow: fillPercent >= 80 ? '0 0 6px rgba(255,150,0,0.5)' : '0 0 6px rgba(0,240,255,0.4)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Action buttons row: Add Students | Edit | Delete */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Add Students */}
        <div onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onAddStudents(cls)}
            style={{
              width: '100%', padding: '7px 0', fontSize: '0.73rem', fontWeight: '700',
              letterSpacing: '0.04em', borderRadius: '8px',
              border: '1px solid rgba(0, 240, 255, 0.28)',
              background: 'linear-gradient(135deg, rgba(0,112,243,0.18), rgba(0,240,255,0.09))',
              color: '#00f0ff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              outline: 'none', transition: 'all 0.22s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0070f3, #00f0ff)';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = '0 0 14px rgba(0,240,255,0.38)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,112,243,0.18), rgba(0,240,255,0.09))';
              e.currentTarget.style.color = '#00f0ff';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Students
          </button>
        </div>

        {/* Edit + Delete row */}
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onEdit(cls)}
            style={{
              flex: 1, padding: '6px 0', fontSize: '0.7rem', fontWeight: '700',
              letterSpacing: '0.04em', borderRadius: '8px',
              border: '1px solid rgba(0, 112, 243, 0.35)',
              background: 'rgba(0, 112, 243, 0.1)',
              color: '#6db8ff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              outline: 'none', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,112,243,0.25)';
              e.currentTarget.style.borderColor = 'rgba(0,112,243,0.6)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0, 112, 243, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(0, 112, 243, 0.35)';
              e.currentTarget.style.color = '#6db8ff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(cls._id)}
            style={{
              flex: 1, padding: '6px 0', fontSize: '0.7rem', fontWeight: '700',
              letterSpacing: '0.04em', borderRadius: '8px',
              border: '1px solid rgba(255, 0, 85, 0.3)',
              background: 'rgba(255, 0, 85, 0.08)',
              color: '#ff6699', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              outline: 'none', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,0,85,0.2)';
              e.currentTarget.style.borderColor = 'rgba(255,0,85,0.6)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 0, 85, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 0, 85, 0.3)';
              e.currentTarget.style.color = '#ff6699';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
const LevelColumnWidget = ({ level, levelClasses, onOpenDetails, onAddStudents, onDelete, onEdit }) => (
  <section
    id={`level-${level}`}
    className="glass-card"
    style={{
      minWidth: '320px',
      maxWidth: '360px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      height: 'fit-content',
      maxHeight: '80vh',
      padding: '1.2rem',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}
  >
    {/* Column Header */}
    <header style={{ flexShrink: 0, marginBottom: '1rem', paddingBottom: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          background: 'linear-gradient(135deg, #0070f3, #00f0ff)',
          color: '#000',
          padding: '4px 14px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          fontWeight: '900',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          boxShadow: '0 0 12px rgba(0,240,255,0.3)'
        }}>
          Level {level}
        </span>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: '700',
          color: levelClasses.length === 0 ? 'var(--text-muted)' : 'var(--accent-neon)',
          background: levelClasses.length === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,240,255,0.08)',
          border: `1px solid ${levelClasses.length === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,240,255,0.2)'}`,
          borderRadius: '20px',
          padding: '2px 10px',
          letterSpacing: '0.03em'
        }}>
          {levelClasses.length} {levelClasses.length === 1 ? 'class' : 'classes'}
        </span>
      </div>
    </header>

    {/* Scrollable Cards Area */}
    {levelClasses.length === 0 ? (
      <div style={{
        padding: '3rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '12px'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No classes yet.</p>
      </div>
    ) : (
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          paddingRight: '6px',
          marginRight: '-4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingBottom: '8px'
        }}
      >
        {levelClasses.map((cls) => (
          <ClassItemCard
            key={cls._id}
            cls={cls}
            onOpenDetails={onOpenDetails}
            onAddStudents={onAddStudents}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    )}
  </section>
);
const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    classes: [],
    teachers: [],
    students: [],
    exams: []
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, classes
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClass, setNewClass] = useState({ className: '', subject: '', level: 1 });
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Schedules state
  const [schedules, setSchedules] = useState([]);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ ExamId: '', Date: '', Time: '', Day: '', classID: '' });
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);

  // Assignment State
  const [selectedUser, setSelectedUser] = useState(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);

  // Edit class state
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({ className: '', subject: '', level: 1 });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const classesByLevel = useMemo(() => {
    return LEVELS.reduce((acc, level) => {
      acc[level] = stats.classes.filter((c) => c.level === level);
      return acc;
    }, {});
  }, [stats.classes]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, pendingRes, schedulesRes] = await Promise.all([
        axios.get('/DashBoard/manager-stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/User/pending-users', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: { users: [] } } })),
        axios.get('/ExamSchedule', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: { schedules: [] } } }))
      ]);
      setStats(statsRes.data.data);
      setPendingUsers(pendingRes.data.data.users);
      setSchedules(schedulesRes.data.data.schedules || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`/User/approve-user/${userId}`, { isApproved: true });
      alert("User approved successfully!");
      // Refresh data
      const pendingRes = await axios.get('/User/pending-users');
      setPendingUsers(pendingRes.data.data.users);
      // Also refresh stats to show in directory
      const statsRes = await axios.get('/DashBoard/manager-stats');
      setStats(statsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve user");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!targetClassId || !selectedUser) return;

    setIsAssigning(true);
    try {
      if (selectedUser.role.toLowerCase() === 'teacher') {
        await axios.post('/Class/add-teacher', {
          classId: targetClassId,
          teacherId: selectedUser._id,
          subject: selectedUser.teacherSubject
        });
      } else {
        await axios.post('/Class/add-student', {
          classId: targetClassId,
          studentId: selectedUser._id
        });
      }
      alert("Assignment successful!");
      setSelectedUser(null);
      setTargetClassId('');
      // Refresh
      const statsRes = await axios.get('/DashBoard/manager-stats');
      setStats(statsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed. Check capacity or subject conflicts.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();

    // Validate form
    if (!newClass.className.trim() || !newClass.subject.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a class');
      return;
    }

    setIsCreatingClass(true);
    try {
      console.log('Creating class with:', newClass);
      const response = await axios.post('/Class/add', newClass, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Class creation response:', response.data);
      alert("Class created successfully!");
      setShowCreateClass(false);
      setNewClass({ className: '', subject: '', level: 1 });
      // Refresh
      const statsRes = await axios.get('/DashBoard/manager-stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Full error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to create class";
      alert(errorMsg);
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/User/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("User deleted successfully");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Delete this class? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/Class/${classId}`, { headers: { Authorization: `Bearer ${token}` } });
      const statsRes = await axios.get('/DashBoard/manager-stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Delete Class Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to delete class");
    }
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls);
    setEditForm({ className: cls.className, subject: cls.subject, level: cls.level });
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/Class/${editingClass._id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setEditingClass(null);
      const statsRes = await axios.get('/DashBoard/manager-stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update class");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setIsCreatingSchedule(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/ExamSchedule/create', newSchedule, { headers: { Authorization: `Bearer ${token}` } });
      alert("Exam Schedule created successfully!");
      setShowCreateSchedule(false);
      setNewSchedule({ ExamId: '', Date: '', Time: '', Day: '', classID: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create schedule");
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/ExamSchedule/${scheduleId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete schedule");
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`glass-card relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-${color}-500/50 flex flex-col justify-between`}
      style={{ aspectRatio: '1.5 / 1' }}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-${color}-500 transition-transform group-hover:scale-150`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 group-hover:border-${color}-500/40 transition-colors`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-muted text-sm font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in p-6">
      <nav className="tab-nav">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Users</span>
          {pendingUsers.length > 0 && (
            <span className="tab-badge animate-pulse">
              {pendingUsers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
        >
          <BookOpen size={20} />
          <span>Classes</span>
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
        >
          <Calendar size={20} />
          <span>Schedules</span>
        </button>
      </nav>
      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <StatCard icon={Users} label="Total Teachers" value={stats.teachers.length} color="blue" onClick={() => setActiveTab('users')} />
            <StatCard icon={GraduationCap} label="Active Students" value={stats.students.length} color="cyan" onClick={() => setActiveTab('users')} />
            <StatCard icon={BookOpen} label="Classes" value={stats.classes.length} color="indigo" onClick={() => setActiveTab('classes')} />
            <StatCard icon={FileText} label="Active Exams" value={stats.exams.length} color="purple" />
          </div>

          <div className="dashboard-grid mt-10">
            {/* Recent Teachers Table */}
            <div className="glass-card" style={{ gridColumn: 'span 2' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  Quick Staff View
                </h3>
              </div>
              <div className="table-container" style={{ background: 'transparent', border: 'none' }}>
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr>
                      <th style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 1rem 1rem 1rem' }}>Name</th>
                      <th style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 1rem 1rem 1rem' }}>Subject</th>
                      <th style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 1rem 1rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.teachers.slice(0, 5).map((teacher) => (
                      <tr key={teacher._id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                        <td style={{ border: 'none', borderRadius: '8px 0 0 8px', fontWeight: '500' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                              {(teacher.name || '?').charAt(0).toUpperCase()}
                            </div>
                            {teacher.name?.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                          </div>
                        </td>
                        <td className="text-muted text-sm font-medium" style={{ border: 'none' }}>
                          {teacher.teacherSubject?.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td style={{ border: 'none', borderRadius: '0 8px 8px 0' }}>
                          <span className="badge badge-success px-3 py-1 shadow-[0_0_10px_rgba(0,255,136,0.2)]">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Academic Levels Summary */}
            <div className="glass-card" style={{ gridColumn: 'span 2' }}>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-cyan-400">
                <LayoutDashboard className="w-5 h-5" />
                Academic Levels Summary
              </h3>
              <div className="custom-scrollbar" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {LEVELS.map(level => {
                  const levelClasses = classesByLevel[level] || [];
                  const studentCount = levelClasses.reduce((sum, c) => sum + (c.students?.length || 0), 0);
                  const teacherSet = new Set();
                  levelClasses.forEach(c => c.teachers?.forEach(t => { if (t.teacher?._id) teacherSet.add(t.teacher._id) }));

                  return (
                    <div
                      key={level}
                      onClick={() => {
                        setActiveTab('classes');
                        setTimeout(() => {
                          document.getElementById('level-' + level)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 150);
                      }}
                      className="glass-card cursor-pointer hover:border-cyan-500 transition-colors"
                      style={{
                        flexShrink: 0,
                        width: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1.5rem 1rem',
                        boxShadow: '0 4px 15px rgba(0, 240, 255, 0.05)'
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-neon)', textShadow: '0 0 15px rgba(0,240,255,0.3)', marginBottom: '0.2rem' }}>
                        L{level}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.2rem', color: 'var(--text-main)' }}>
                        Year {level}
                      </div>

                      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '1.2rem' }}></div>

                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Classes</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{levelClasses.length}</span>
                      </div>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Students</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{studentCount}</span>
                      </div>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Teachers</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{teacherSet.size}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {/* Pending Approvals Section */}
          {pendingUsers.length > 0 && (
            <div className="glass-card" style={{ marginBottom: '2.5rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f87171' }}>
                <Settings style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 3s linear infinite' }} />
                Pending Approvals ({pendingUsers.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {pendingUsers.map(u => {
                  // Get first letter for avatar
                  const initial = (u.name || u.email || '?').charAt(0).toUpperCase();
                  const isTeacher = u.role.toLowerCase() === 'teacher';
                  
                  return (
                    <div key={u._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
                      {/* Subtle gradient background decoration */}
                      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '128px', height: '128px', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.2, pointerEvents: 'none', background: isTeacher ? '#a855f7' : '#06b6d4' }}></div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 900, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: isTeacher ? 'linear-gradient(to bottom right, #a855f7, #4f46e5)' : 'linear-gradient(to bottom right, #3b82f6, #06b6d4)', color: 'white' }}>
                            {initial}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</h4>
                            <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', padding: '2px 10px', borderRadius: '9999px', background: isTeacher ? 'rgba(168, 85, 247, 0.2)' : 'rgba(6, 182, 212, 0.2)', color: isTeacher ? '#c084fc' : '#22d3ee', border: `1px solid ${isTeacher ? 'rgba(168, 85, 247, 0.3)' : 'rgba(6, 182, 212, 0.3)'}` }}>
                              {u.role}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem', paddingLeft: '4px', position: 'relative', zIndex: 10 }}>
                          {u.name !== u.email && (
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>✉</span> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                            </p>
                          )}
                          {isTeacher && u.teacherSubject && (
                            <p style={{ fontSize: '0.875rem', color: '#22d3ee', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>📚</span> Subject: {u.teacherSubject}
                            </p>
                          )}
                          {!isTeacher && u.level && (
                            <p style={{ fontSize: '0.875rem', color: '#a855f7', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>🎓</span> Level: {u.level}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleApprove(u._id)}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem', padding: '0.625rem', position: 'relative', zIndex: 10, borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Approve Account
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Directory & Assignment Section */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className="text-xl font-bold">User Directory & Class Assignment</h3>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', width: '16px', height: '16px' }} />
                <input 
                  type="text" 
                  placeholder="Search by name or role..." 
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#00f0ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0, 240, 255, 0.2)'}
                />
              </div>
            </div>
            <div className="table-container custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', position: 'relative' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-tertiary)', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  <tr><th>Name</th><th>Role</th><th>Classes</th><th>Status</th><th>Class Action</th></tr>
                </thead>
                <tbody>
                  {[...stats.teachers, ...stats.students]
                    .filter(u => (u.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) || (u.role || '').toLowerCase().includes(userSearchQuery.toLowerCase()))
                    .map(u => {
                      const userClasses = stats.classes.filter(c => {
                        if ((u.role || '').toLowerCase() === 'teacher') {
                          return c.teachers?.some(t => {
                            const teacherId = typeof t.teacher === 'object' && t.teacher ? t.teacher._id : t.teacher;
                            return teacherId === u._id;
                          });
                        } else {
                          return c.students?.some(student => {
                            const studentId = typeof student === 'object' && student ? student._id : student;
                            return studentId === u._id;
                          });
                        }
                      });

                      return (
                      <tr key={u._id}>
                        <td className="font-medium">{u.name}</td>
                        <td><span className="text-xs opacity-70">{u.role}</span></td>
                        <td>
                          {userClasses.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {userClasses.map(c => (
                                <span key={c._id} style={{ 
                                  fontSize: '10px', 
                                  background: 'rgba(0, 240, 255, 0.1)', 
                                  color: '#00f0ff', 
                                  border: '1px solid rgba(0, 240, 255, 0.2)', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {c.className}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs opacity-40 italic">Unassigned</span>
                          )}
                        </td>
                        <td><span className="text-xs text-green-400">Approved</span></td>
                        <td>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px',
                              background: 'rgba(132, 204, 22, 0.1)', color: '#84cc16', border: '1px solid rgba(132, 204, 22, 0.3)',
                              fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#84cc16';
                              e.currentTarget.style.color = '#000';
                              e.currentTarget.style.boxShadow = '0 0 15px rgba(132, 204, 22, 0.5)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(132, 204, 22, 0.1)';
                              e.currentTarget.style.color = '#84cc16';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <Plus className="w-3.5 h-3.5" /> Assign
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)',
                              fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.color = '#fff';
                              e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.color = '#ef4444';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'classes' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 w-full">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">Class Management</h3>

            <button
              onClick={() => setShowCreateClass(true)}
              className="font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #0070f3, #00f0ff)',
                color: '#000000',
                padding: '11px 22px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0, 240, 255, 0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
                outline: 'none',
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 240, 255, 0.55), 0 1px 0 rgba(255,255,255,0.2) inset';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 240, 255, 0.35), 0 1px 0 rgba(255,255,255,0.15) inset';
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
            >
              <Plus className="w-5 h-5" /> Create New Class
            </button>
          </div>

          <div
            className="custom-scrollbar"
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              gap: '24px',
              paddingBottom: '20px',
              width: '100%'
            }}
          >
            {LEVELS.map((level) => (
              <LevelColumnWidget
                key={level}
                level={level}
                levelClasses={classesByLevel[level] || []}
                onOpenDetails={setSelectedClassDetails}
                onDelete={handleDeleteClass}
                onEdit={handleEditClass}
                onAddStudents={(cls) => {
                  setSelectedUser({ name: 'Enrollment Mode', role: 'Student', level: cls.level });
                  setTargetClassId(cls._id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Schedules Tab Content */}
      {activeTab === 'schedules' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 w-full" style={{ animationDuration: '0.5s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Exam Schedules</h3>
            <button
              onClick={() => setShowCreateSchedule(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #0070f3, #00f0ff)',
                color: '#000000',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 240, 255, 0.3)',
                outline: 'none',
                fontSize: '0.9rem',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 240, 255, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 240, 255, 0.3)';
              }}
            >
              <Plus size={18} strokeWidth={3} />
              Schedule Exam
            </button>
          </div>

          <div className="glass-card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Exam / Subject</th>
                    <th>Class</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Day</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.length === 0 ? (
                    <tr><td colSpan="6" className="text-center text-muted">No schedules found.</td></tr>
                  ) : (
                    schedules.map(sch => {
                      const examObj = stats.exams.find(e => e._id === sch.ExamId);
                      const classObj = stats.classes.find(c => c._id === sch.classID);
                      
                      return (
                        <tr key={sch._id}>
                          <td className="font-bold text-cyan-400">{examObj?.subject || sch.ExamId}</td>
                          <td>{classObj?.className || sch.classID}</td>
                          <td>{new Date(sch.Date).toLocaleDateString()}</td>
                          <td>{sch.Time}</td>
                          <td>{sch.Day}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteSchedule(sch._id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)',
                                fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.color = '#ef4444';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Create Class Modal */}
      {showCreateClass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 md:pt-24 overflow-y-auto">
          <div className="glass-card w-full max-w-md animate-in zoom-in-95 duration-200 mb-8">
            <h3 className="text-xl font-bold mb-2">Create New Class</h3>
            <p className="text-sm text-muted mb-6">Set up a new academic class for the school.</p>

            <form onSubmit={handleCreateClass}>
              <div className="form-group mb-4">
                <label>Class Name</label>
                <input
                  type="text"
                  required
                  value={newClass.className}
                  onChange={e => setNewClass({ ...newClass, className: e.target.value })}
                  placeholder="e.g. Grade 10-A"
                />
              </div>
              <div className="form-group mb-4">
                <label>Main Subject</label>
                <input
                  type="text"
                  required
                  value={newClass.subject}
                  onChange={e => setNewClass({ ...newClass, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div className="form-group mb-6">
                <label>Academic Level (Year)</label>
                <select
                  required
                  value={newClass.level}
                  onChange={e => setNewClass({ ...newClass, level: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateClass(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClass}
                  className="btn btn-primary flex-1"
                >
                  {isCreatingClass ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Schedule Modal */}
      {showCreateSchedule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 md:pt-24 overflow-y-auto">
          <div className="glass-card w-full max-w-md animate-in zoom-in-95 duration-200 mb-8">
            <h3 className="text-xl font-bold mb-2">Schedule Exam</h3>
            <p className="text-sm text-muted mb-6">Assign a date and time for an existing exam.</p>

            <form onSubmit={handleCreateSchedule}>
              <div className="form-group mb-4">
                <label>Select Exam</label>
                <select
                  required
                  value={newSchedule.ExamId}
                  onChange={e => setNewSchedule({ ...newSchedule, ExamId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Choose Exam --</option>
                  {stats.exams.map(e => <option key={e._id} value={e._id}>{e.subject} ({e.totalMarks} pts)</option>)}
                </select>
              </div>

              <div className="form-group mb-4">
                <label>Select Class</label>
                <select
                  required
                  value={newSchedule.classID}
                  onChange={e => setNewSchedule({ ...newSchedule, classID: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Choose Class --</option>
                  {stats.classes.map(c => <option key={c._id} value={c._id}>{c.className} (L{c.level})</option>)}
                </select>
              </div>

              <div className="form-group mb-4">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={newSchedule.Date}
                  onChange={e => setNewSchedule({ ...newSchedule, Date: e.target.value })}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div className="flex gap-4 mb-6">
                <div className="form-group flex-1 mb-0">
                  <label>Time</label>
                  <input
                    type="time"
                    required
                    value={newSchedule.Time}
                    onChange={e => setNewSchedule({ ...newSchedule, Time: e.target.value })}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div className="form-group flex-1 mb-0">
                  <label>Day</label>
                  <select
                    required
                    value={newSchedule.Day}
                    onChange={e => setNewSchedule({ ...newSchedule, Day: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Choose Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreateSchedule(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isCreatingSchedule} className="btn btn-primary flex-1">
                  {isCreatingSchedule ? 'Saving...' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md animate-in zoom-in-95 duration-200">
            {selectedUser.name === 'Enrollment Mode' ? (
              <>
                <h3 className="text-xl font-bold mb-2">Enroll Student</h3>
                <p className="text-sm text-muted mb-6">Select a student to enroll into the selected class.</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">Assign {selectedUser.name}</h3>
                <p className="text-sm text-muted mb-6">Select a class to enroll this {selectedUser.role.toLowerCase()}.</p>
              </>
            )}

            <form onSubmit={handleAssign}>
              {selectedUser.name === 'Enrollment Mode' && (
                <div className="form-group mb-4">
                  <label>Select Student (Level {selectedUser.level} only)</label>
                  <select
                    required
                    onChange={e => setSelectedUser({ ...selectedUser, _id: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Choose Student --</option>
                    {stats.students
                      .filter(s => s.level === selectedUser.level)
                      .map(s => (
                        <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                      ))}
                  </select>
                </div>
              )}

              <div className="form-group mb-6">
                <label>Target Class</label>
                <select
                  required
                  value={targetClassId}
                  onChange={e => setTargetClassId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                  disabled={selectedUser.name === 'Enrollment Mode'}
                >
                  <option value="">-- Choose Class --</option>
                  {stats.classes.map(c => {
                    const studentCount = c.students?.length || 0;
                    const isFull = studentCount >= (c.maxStudents || 20);
                    const isLevelMismatch = selectedUser.role.toLowerCase() === 'student' && selectedUser.level && selectedUser.level !== c.level && selectedUser.name !== 'Enrollment Mode';
                    return (
                      <option key={c._id} value={c._id} disabled={(selectedUser.role.toLowerCase() === 'student' && isFull) || isLevelMismatch}>
                        {c.className} ({c.subject}) - Level {c.level} {selectedUser.role.toLowerCase() === 'student' ? `- ${studentCount}/20` : ''} {isLevelMismatch ? '(Level Mismatch)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="btn btn-primary flex-1"
                >
                  {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Details Modal Overlay */}
      {selectedClassDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-3xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-3xl font-bold text-cyan-400">{selectedClassDetails.className}</h3>
                <p className="text-sm text-muted mt-1">{selectedClassDetails.subject} • Level {selectedClassDetails.level}</p>
              </div>
              <button onClick={() => setSelectedClassDetails(null)} className="btn btn-secondary px-4 py-2">
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Teachers List */}
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
                  <Users className="w-5 h-5" /> Assigned Teachers
                </h4>
                <div className="space-y-3">
                  {selectedClassDetails.teachers && selectedClassDetails.teachers.length > 0 ? (
                    selectedClassDetails.teachers.map((t, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                        <div className="font-bold text-indigo-300">{t.teacher?.name || 'Unknown Teacher'}</div>
                        <div className="text-xs text-muted mb-2">{t.teacher?.email || 'No email'}</div>
                        <span className="text-[10px] uppercase bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded font-bold">{t.subject}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted italic">No teachers assigned.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Students List */}
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
                  <GraduationCap className="w-5 h-5" /> Enrolled Students ({selectedClassDetails.students?.length || 0}/20)
                </h4>
                <div className="space-y-3">
                  {selectedClassDetails.students && selectedClassDetails.students.length > 0 ? (
                    selectedClassDetails.students.map((s, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:border-cyan-500/30 transition-colors">
                        <div>
                          <div className="font-bold text-cyan-300">{s.name || 'Unknown Student'}</div>
                          <div className="text-xs text-muted">{s.email || 'No email'}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted italic">No students enrolled yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Edit Class Modal ── */}
      {editingClass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md" style={{ animation: 'slide-up-chat 0.3s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#fff' }}>Edit Class</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Modifying: <span style={{ color: 'var(--accent-neon)' }}>{editingClass.className}</span></p>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
              >✕ Close</button>
            </div>

            <form onSubmit={handleUpdateClass}>
              <div className="form-group mb-4">
                <label>Class Name</label>
                <input
                  type="text"
                  required
                  value={editForm.className}
                  onChange={e => setEditForm({ ...editForm, className: e.target.value })}
                  placeholder="e.g. Grade 10-A"
                />
              </div>
              <div className="form-group mb-4">
                <label>Subject</label>
                <input
                  type="text"
                  required
                  value={editForm.subject}
                  onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div className="form-group mb-6">
                <label>Academic Level (Year)</label>
                <select
                  required
                  value={editForm.level}
                  onChange={e => setEditForm({ ...editForm, level: Number(e.target.value) })}
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >Cancel</button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >{isSavingEdit ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManagerDashboard;