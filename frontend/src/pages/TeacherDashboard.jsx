import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Users, BookMarked, Save, Calendar } from 'lucide-react';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalExams: 0, RecentGrades: [] });
  const [examSchedules, setExamSchedules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);

  // Modals / Forms state
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState({ className: '', subject: '' });

  const [showAddExam, setShowAddExam] = useState(false);
  const [newExam, setNewExam] = useState({ subject: '', totalMarks: '', date: '', duration: '', classId: '', questions: [] });
  const [numQuestions, setNumQuestions] = useState('');
  const [currentEditIndex, setCurrentEditIndex] = useState(0);

  const [selectedExamId, setSelectedExamId] = useState('');
  const [gradeForm, setGradeForm] = useState({ studentId: '', Score: '', feedback: '' });

  // Lectures State
  const [selectedClassForLectures, setSelectedClassForLectures] = useState(null);
  const [classLectures, setClassLectures] = useState([]);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [newLecture, setNewLecture] = useState({ title: '', content: '', pdfUrl: '', externalLink: '' });

  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', classId: '', dueDate: '', maxMark: '', type: 'Homework' });
  const [isGrading, setIsGrading] = useState(false);
  const [gradingForm, setGradingForm] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [classRes, examRes, studentsRes, statsRes, schedulesRes] = await Promise.all([
        axios.get('/Class/all'),
        axios.get('/Exam/all'),
        axios.get('/User/all?role=student'),
        axios.get('/DashBoard/teacher-stats').catch(() => ({ data: { data: { totalExams: 0, RecentGrades: [] } } })),
        axios.get('/ExamSchedule').catch(() => ({ data: { data: { schedules: [] } } }))
      ]);
      setClasses(classRes.data.data.classes);
      setExams(examRes.data.data.exams);

      // Fetch assignments for all classes
      const allAssignments = [];
      for (const cls of classRes.data.data.classes) {
        try {
          const res = await axios.get(`/Assignments/class/${cls._id}`);
          allAssignments.push(...res.data.data.assignments);
        } catch (e) { console.error(e); }
      }
      setAssignments(allAssignments);

      const onlyStudents = studentsRes.data.data.users.filter(u => u.role === 'student' || u.role === 'Student');
      setStudents(onlyStudents);
      setStats(statsRes.data?.data || { totalExams: 0, RecentGrades: [] });
      setExamSchedules(schedulesRes.data.data.schedules || []);
    } catch (error) {
      console.error('Error fetching teacher data', error);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/Class/add', newClass);
      setNewClass({ className: '', subject: '' });
      setShowAddClass(false);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating class');
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (newExam.questions.length === 0) {
      alert("Please add at least one question to the exam.");
      return;
    }
    try {
      await axios.post('/Exam/add', newExam);
      setNewExam({ subject: '', totalMarks: '', date: '', duration: '', classId: '', questions: [] });
      setNumQuestions('');
      setShowAddExam(false);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating exam');
    }
  };

  const handleGenerateQuestions = () => {
    const count = parseInt(numQuestions);
    if (isNaN(count) || count <= 0) {
      alert("Please enter a valid number of questions");
      return;
    }
    const generated = Array.from({ length: count }, () => ({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }));
    setNewExam({ ...newExam, questions: generated });
    setCurrentEditIndex(0);
  };

  const updateQuestion = (qIndex, field, value, optIndex = null) => {
    const updated = [...newExam.questions];
    if (optIndex !== null) {
      updated[qIndex].options[optIndex] = value;
    } else {
      updated[qIndex][field] = value;
    }
    setNewExam({ ...newExam, questions: updated });
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!selectedExamId) {
      alert("Please select an exam first");
      return;
    }
    try {
      await axios.post('/Grades/add', { ...gradeForm, exam: selectedExamId });
      setGradeForm({ studentId: '', Score: '', feedback: '' });
      alert('Grade added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error grading student');
    }
  };

  const fetchClassLectures = async (classId) => {
    try {
      const res = await axios.get(`/lectures/class/${classId}`);
      const lecturesData = res.data.data?.lectures || [];
      setClassLectures(lecturesData);
      setSelectedClassForLectures(classId);
    } catch (error) {
      console.error("Error fetching lectures", error);
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/lectures/addLectures', { ...newLecture, classId: selectedClassForLectures });
      setNewLecture({ title: '', content: '', pdfUrl: '', externalLink: '' });
      setShowAddLecture(false);
      fetchClassLectures(selectedClassForLectures);
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating lecture');
    }
  };

  const handleDeleteLecture = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await axios.post('/lectures/DeleteLectures', { lectureId: id });
      fetchClassLectures(selectedClassForLectures);
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting lecture');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/Assignments/create', newAssignment);
      setNewAssignment({ title: '', description: '', classId: '', dueDate: '', maxMark: '', type: 'Homework' });
      setShowAddAssignment(false);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating assignment');
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(`/Assignments/submissions/${assignmentId}`);
      setAssignmentSubmissions(res.data.data.submissions);
      const assign = assignments.find(a => a._id === assignmentId);
      setSelectedAssignment(assign);
    } catch (error) {
      alert('Error fetching submissions');
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    try {
      await axios.patch(`/Assignments/grade/${submissionId}`, gradingForm);
      alert('Submission graded!');
      fetchSubmissions(selectedAssignment._id);
      setGradingForm({ grade: '', feedback: '' });
      setIsGrading(false);
    } catch (error) {
      alert('Error grading submission');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam? This will also remove associated grades.")) return;
    try {
      await axios.delete(`/Exam/${id}`);
      alert("Exam deleted successfully");
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting exam');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '0' }}>Educator Command Center</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your classes, exams, and grades.</p>

      {/* Top Stats Overview */}
      <div className="dashboard-grid" style={{ marginTop: '0', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--accent-neon)' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--accent-neon)' }}>{stats.totalExams || 0}</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>Total Exams</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--success)' }}>{stats.RecentGrades?.length || 0}</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>Recent Grades Posted</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Classes Manager */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Users size={20} color="var(--accent-neon)" /> Classes
            </h3>
            <button onClick={() => setShowAddClass(!showAddClass)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <PlusCircle size={14} /> New
            </button>
          </div>

          {showAddClass && (
            <form onSubmit={handleCreateClass} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <input type="text" placeholder="Class Name (e.g. 10A)" required value={newClass.className} onChange={e => setNewClass({ ...newClass, className: e.target.value })} style={{ marginBottom: '0.5rem' }} />
              <input type="text" placeholder="Subject" required value={newClass.subject} onChange={e => setNewClass({ ...newClass, subject: e.target.value })} style={{ marginBottom: '0.5rem' }} />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>Save Class</button>
            </form>
          )}

          {/* Grid Layout for Classes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {classes.map(c => (
              <div key={c._id} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1 }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.2rem' }}>{c.className}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.subject}</div>
                  </div>
                  <button
                    onClick={() => selectedClassForLectures === c._id ? setSelectedClassForLectures(null) : fetchClassLectures(c._id)}
                    className="btn"
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      background: selectedClassForLectures === c._id ? 'var(--bg-secondary)' : 'var(--accent-neon)',
                      color: selectedClassForLectures === c._id ? 'var(--text-main)' : 'black',
                      border: '1px solid var(--glass-border)',
                      fontWeight: 'bold',
                      boxShadow: selectedClassForLectures === c._id ? 'none' : '0 0 10px rgba(0, 240, 255, 0.3)'
                    }}
                  >
                    {selectedClassForLectures === c._id ? 'Close' : 'Lectures'}
                  </button>
                </div>

                {selectedClassForLectures === c._id && (
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Manage Lectures</h4>
                      <button onClick={() => setShowAddLecture(!showAddLecture)} className="btn" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', background: 'var(--accent-neon)', color: 'black' }}>{showAddLecture ? 'Cancel' : '+ Add'}</button>
                    </div>

                    {showAddLecture && (
                      <form onSubmit={handleCreateLecture} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <input type="text" placeholder="Lecture Title" required value={newLecture.title} onChange={e => setNewLecture({ ...newLecture, title: e.target.value })} style={{ marginBottom: '0.5rem' }} />
                        <textarea placeholder="Description" required value={newLecture.content} onChange={e => setNewLecture({ ...newLecture, content: e.target.value })} style={{ marginBottom: '0.5rem', width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', padding: '0.5rem' }} rows="2" />
                        <input type="text" placeholder="PDF URL (optional)" value={newLecture.pdfUrl} onChange={e => setNewLecture({ ...newLecture, pdfUrl: e.target.value })} style={{ marginBottom: '0.5rem' }} />
                        <input type="text" placeholder="Link (optional)" value={newLecture.externalLink} onChange={e => setNewLecture({ ...newLecture, externalLink: e.target.value })} style={{ marginBottom: '0.5rem' }} />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.4rem' }}>Save</button>
                      </form>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {classLectures.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No lectures yet.</p>
                      ) : (
                        classLectures.map(lec => (
                          <div key={lec._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{lec.title}</div>
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                                {lec.pdfUrl && <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>PDF</span>}
                                {lec.externalLink && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>LINK</span>}
                              </div>
                            </div>
                            <button onClick={() => handleDeleteLecture(lec._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {classes.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>No classes found.</p>}
        </div>

        {/* Upcoming Exam Schedules */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-neon)' }}>
            <Calendar size={20} /> Upcoming Exam Schedules
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Exam / Subject</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {examSchedules.filter(sch => exams.some(e => e._id === sch.ExamId)).length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '1rem' }}>No upcoming schedules for your exams.</td></tr>
                ) : (
                  examSchedules
                    .filter(sch => exams.some(e => e._id === sch.ExamId))
                    .map(sch => {
                      const examObj = exams.find(e => e._id === sch.ExamId);
                      const classObj = classes.find(c => c._id === sch.classID);
                      
                      return (
                        <tr key={sch._id}>
                          <td className="font-bold text-cyan-400">{examObj?.subject || sch.ExamId}</td>
                          <td>{classObj?.className || sch.classID}</td>
                          <td>{new Date(sch.Date).toLocaleDateString()}</td>
                          <td>{sch.Time}</td>
                          <td>{sch.Day}</td>
                        </tr>
                      );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignments Manager */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Save size={20} color="var(--accent-neon)" /> Assignments
            </h3>
            <button onClick={() => setShowAddAssignment(!showAddAssignment)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <PlusCircle size={14} /> New Assignment
            </button>
          </div>

          {showAddAssignment && (
            <form onSubmit={handleCreateAssignment} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
              <select required value={newAssignment.classId} onChange={e => setNewAssignment({ ...newAssignment, classId: e.target.value })} style={{ marginBottom: '1rem' }}>
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
              <input type="text" placeholder="Assignment Title" required value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} style={{ marginBottom: '1rem' }} />
              <textarea placeholder="Description" required value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} style={{ marginBottom: '1rem', width: '100%', background: 'var(--bg-secondary)', border: 'none', padding: '0.5rem', color: 'white', borderRadius: '8px' }} rows="3" />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due Date</label>
                  <input type="datetime-local" required value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max Mark</label>
                  <input type="number" required value={newAssignment.maxMark} onChange={e => setNewAssignment({ ...newAssignment, maxMark: e.target.value })} />
                </div>
              </div>

              <select value={newAssignment.type} onChange={e => setNewAssignment({ ...newAssignment, type: e.target.value })} style={{ marginBottom: '1.5rem' }}>
                <option value="Homework">Homework</option>
                <option value="Project">Project</option>
                <option value="Quiz">Quiz</option>
                <option value="Other">Other</option>
              </select>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Publish Assignment</button>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {assignments.map(a => (
              <div key={a._id} style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-neon)' }}>{a.title}</div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{a.type}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Due: {new Date(a.dueDate).toLocaleDateString()} • {a.maxMark} pts
                </div>
                <button 
                  onClick={() => fetchSubmissions(a._id)}
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem' }}
                >
                  View Submissions
                </button>
              </div>
            ))}
          </div>

          {selectedAssignment && (
            <div className="fixed-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '2rem' }}>
              <div className="glass-card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', margin: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h3>Submissions for: {selectedAssignment.title}</h3>
                  <button onClick={() => setSelectedAssignment(null)} className="btn btn-secondary">Close</button>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Submitted At</th>
                        <th>Link</th>
                        <th>Status</th>
                        <th>Grade</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignmentSubmissions.length === 0 ? (
                        <tr><td colSpan="6" className="text-center">No submissions yet.</td></tr>
                      ) : (
                        assignmentSubmissions.map(sub => (
                          <tr key={sub._id}>
                            <td>{sub.studentId?.name}</td>
                            <td>{new Date(sub.createdAt).toLocaleString()}</td>
                            <td><a href={sub.submissionUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-neon)' }}>View Work</a></td>
                            <td>{sub.status}</td>
                            <td>{sub.grade} / {selectedAssignment.maxMark}</td>
                            <td>
                              <button 
                                onClick={() => { setIsGrading(sub._id); setGradingForm({ grade: sub.grade, feedback: sub.feedback }); }}
                                className="btn btn-secondary" 
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                              >
                                Grade
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {isGrading && (
                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <h4>Grading Submission</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <input type="number" placeholder="Grade" value={gradingForm.grade} onChange={e => setGradingForm({ ...gradingForm, grade: e.target.value })} style={{ width: '100px' }} />
                      <input type="text" placeholder="Feedback" value={gradingForm.feedback} onChange={e => setGradingForm({ ...gradingForm, feedback: e.target.value })} style={{ flex: 1 }} />
                      <button onClick={() => handleGradeSubmission(isGrading)} className="btn btn-primary">Save Grade</button>
                      <button onClick={() => setIsGrading(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Exams Manager */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <BookMarked size={20} color="var(--accent-neon)" /> Exams
            </h3>
            <button onClick={() => setShowAddExam(!showAddExam)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <PlusCircle size={14} /> New
            </button>
          </div>

          {showAddExam && (
            <form onSubmit={handleCreateExam} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
              <select required value={newExam.classId} onChange={e => setNewExam({ ...newExam, classId: e.target.value })} style={{ marginBottom: '1rem' }}>
                <option value="">-- Assign to Class --</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
              <input type="text" placeholder="Exam Subject" required value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="number" placeholder="Total Marks" required value={newExam.totalMarks} onChange={e => setNewExam({ ...newExam, totalMarks: e.target.value })} />
                <input type="number" placeholder="Duration (min)" required value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: e.target.value })} />
              </div>
              <input type="datetime-local" required value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} style={{ marginBottom: '1.5rem' }} />

              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Num Questions"
                    value={numQuestions}
                    onChange={e => setNumQuestions(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={handleGenerateQuestions} className="btn btn-secondary" style={{ flex: 1 }}>Generate QA Fields</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0 }}>Questions List ({newExam.questions.length})</h4>
                  {newExam.questions.length > 0 && (
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-neon)' }}>Editing Q{currentEditIndex + 1}</span>
                  )}
                </div>

                {newExam.questions.length > 0 && (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {newExam.questions.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentEditIndex(idx)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: 'none',
                            background: currentEditIndex === idx ? 'var(--accent-neon)' : 'var(--bg-tertiary)',
                            color: currentEditIndex === idx ? 'black' : 'var(--text-muted)',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    <div style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '8px', background: 'var(--bg-tertiary)', marginBottom: '1rem' }}>
                      <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--accent-neon)' }}>
                        Question {currentEditIndex + 1}
                      </div>

                      <input
                        type="text"
                        placeholder="Enter the question text here..."
                        required
                        value={newExam.questions[currentEditIndex].text}
                        onChange={e => updateQuestion(currentEditIndex, 'text', e.target.value)}
                        style={{ marginBottom: '1rem' }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                        {newExam.questions[currentEditIndex].options.map((opt, optIndex) => (
                          <input
                            key={optIndex}
                            type="text"
                            placeholder={`Option ${optIndex + 1}`}
                            required
                            value={opt}
                            onChange={e => updateQuestion(currentEditIndex, 'options', e.target.value, optIndex)}
                          />
                        ))}
                      </div>

                      <select
                        required
                        value={newExam.questions[currentEditIndex].correctAnswer}
                        onChange={e => updateQuestion(currentEditIndex, 'correctAnswer', e.target.value)}
                      >
                        <option value="">-- Select Correct Answer --</option>
                        {newExam.questions[currentEditIndex].options.filter(o => o.trim() !== '').map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                      <button
                        type="button"
                        disabled={currentEditIndex === 0}
                        onClick={() => setCurrentEditIndex(prev => prev - 1)}
                        className="btn btn-secondary"
                        style={{ flex: 1, opacity: currentEditIndex === 0 ? 0.5 : 1 }}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={currentEditIndex === newExam.questions.length - 1}
                        onClick={() => setCurrentEditIndex(prev => prev + 1)}
                        className="btn btn-secondary"
                        style={{ flex: 1, opacity: currentEditIndex === newExam.questions.length - 1 ? 0.5 : 1 }}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>Save & Publish Exam</button>
            </form>
          )}

          {/* Grid Layout for Exams */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {exams.map(e => (
              <div key={e._id} style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--accent-neon)' }}>{e.subject}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {e.date ? new Date(e.date).toLocaleDateString() : 'No date'} • <strong style={{ color: 'var(--text-main)' }}>{e.totalMarks} pts</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteExam(e._id)}
                  className="btn btn-danger"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          {exams.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>No exams scheduled.</p>}
        </div>

        {/* Grading Quick Action */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Save size={20} color="var(--accent-neon)" /> Grade a Student
          </h3>
          <form onSubmit={handleAddGrade} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Exam</label>
              <select required value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} style={{ width: '100%' }}>
                <option value="">-- Choose Exam --</option>
                {exams.map(e => <option key={e._id} value={e._id}>{e.subject}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Student</label>
              <select required value={gradeForm.studentId} onChange={e => setGradeForm({ ...gradeForm, studentId: e.target.value })} style={{ width: '100%' }}>
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Score</label>
              <input type="number" required value={gradeForm.Score} onChange={e => setGradeForm({ ...gradeForm, Score: e.target.value })} placeholder="e.g. 95" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: '2 1 250px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Feedback</label>
              <input type="text" value={gradeForm.feedback} onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })} placeholder="Great job!" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem' }}>Submit Grade</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;