import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, AlertCircle, PlayCircle, CheckCircle, Trophy, Star, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [grades, setGrades] = useState([]);
    const [availableExams, setAvailableExams] = useState([]);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState(0);
    const [examSchedules, setExamSchedules] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [mySubmissions, setMySubmissions] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');

    // Test Taking State
    const [activeExam, setActiveExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null); // in seconds
    const [currentIndex, setCurrentIndex] = useState(0);

    // Lectures State
    const [selectedClassForLectures, setSelectedClassForLectures] = useState(null);
    const [classLectures, setClassLectures] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        let timer;
        if (activeExam && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && activeExam) {
            alert("Time is up! Submitting your exam automatically.");
            submitExam();
        }
        return () => clearInterval(timer);
    }, [activeExam, timeLeft]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, examsRes, schedulesRes] = await Promise.all([
                axios.get('/DashBoard/student-stats'),
                axios.get('/Exam/available').catch(() => ({ data: { data: { exams: [] } } })),
                axios.get('/ExamSchedule').catch(() => ({ data: { data: { schedules: [] } } }))
            ]);

            const { enrolledClasses, recentGrades, points: userPoints } = statsRes.data.data;

            setEnrolledClasses(enrolledClasses);
            setPoints(userPoints || 0);
            setGrades(recentGrades);
            setAvailableExams(examsRes.data.data.exams || []);
            setExamSchedules(schedulesRes.data.data.schedules || []);

            // Fetch assignments for student's classes
            const allAssignments = [];
            for (const cls of enrolledClasses) {
                try {
                    const res = await axios.get(`/Assignments/class/${cls._id}`);
                    allAssignments.push(...res.data.data.assignments);
                } catch (e) { console.error(e); }
            }
            setAssignments(allAssignments);

            // Fetch my submissions (Assuming there's an endpoint or we filter)
            // For now, let's just fetch assignments. We'll need a way to check submission status.
            // In a real app, you'd fetch /Assignments/my-submissions
            // Since we don't have that yet, we'll just show assignments.
            // We can add a simple logic to check if a student has submitted.
        } catch (error) {
            console.error('Error fetching student data', error);
        } finally {
            setLoading(false);
        }
    };

    const startExam = (exam) => {
        setActiveExam(exam);
        setAnswers({});
        setCurrentIndex(0);
        if (exam.duration) {
            setTimeLeft(exam.duration * 60);
        } else {
            setTimeLeft(null);
        }
    };

    const selectAnswer = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const submitExam = async () => {
        if (Object.keys(answers).length < activeExam.questions.length) {
            if (!window.confirm("You haven't answered all questions. Submit anyway?")) return;
        }

        try {
            await axios.post('/Exam/submit', { examId: activeExam._id, answers });
            alert("Exam submitted successfully! Score calculated.");
            setActiveExam(null);
            setAnswers({});
            setTimeLeft(null);
            setCurrentIndex(0);
            setLoading(true);
            fetchDashboardData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting exam');
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

    const handleSubmitAssignment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/Assignments/submit', {
                assignmentId: showSubmitModal,
                submissionUrl: submissionUrl
            });
            alert('Assignment submitted successfully!');
            setShowSubmitModal(null);
            setSubmissionUrl('');
            fetchDashboardData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting assignment');
        }
    };

    if (activeExam) {
        const currentQuestion = activeExam.questions[currentIndex];

        return (
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>{activeExam.subject} Exam</h2>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.9rem' }}>{activeExam.totalMarks} Pts</span>
                        {timeLeft !== null && (
                            <span className={`badge ${timeLeft < 60 ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.9rem', minWidth: '80px' }}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Question Navigator */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                    {activeExam.questions.map((q, idx) => (
                        <button
                            key={q._id || idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                border: 'none',
                                background: currentIndex === idx ? 'var(--accent-neon)' : answers[q._id] ? 'var(--success-dark)' : 'var(--bg-tertiary)',
                                color: currentIndex === idx ? 'black' : 'var(--text-main)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <p style={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '1.5rem' }}> Question {currentIndex + 1} of {activeExam.questions.length} </p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>{currentQuestion.text}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {currentQuestion.options.map((opt, optIndex) => (
                                <label key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: answers[currentQuestion._id] === opt ? 'rgba(0, 240, 255, 0.15)' : 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', cursor: 'pointer', border: answers[currentQuestion._id] === opt ? '2px solid var(--accent-neon)' : '1px solid transparent', transition: 'all 0.2s' }}>
                                    <input
                                        type="radio"
                                        name={currentQuestion._id}
                                        value={opt}
                                        checked={answers[currentQuestion._id] === opt}
                                        onChange={() => selectAnswer(currentQuestion._id, opt)}
                                        style={{ width: 'auto' }}
                                    />
                                    <span style={{ color: 'var(--text-main)' }}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} className="btn btn-secondary" style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}>Previous</button>
                        {currentIndex < activeExam.questions.length - 1 ? (
                            <button onClick={() => setCurrentIndex(prev => prev + 1)} className="btn btn-secondary">Next</button>
                        ) : (
                            <button onClick={submitExam} className="btn btn-primary"><CheckCircle size={18} /> Finish & Submit</button>
                        )}
                    </div>
                    <button onClick={() => { if (window.confirm("Quit exam? Progress will not be saved.")) setActiveExam(null); }} className="btn" style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>Quit</button>
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* تم إضافة ستايل هنا لتقسيم الشاشة لعمودين متساويين */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Enrolled Classes */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><CheckCircle size={20} color="var(--success)" /> My Classes</h3>
                    {enrolledClasses.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>You aren't enrolled in any classes yet.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {enrolledClasses.map(cls => (
                                <li key={cls._id} style={{ marginBottom: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-neon)' }}>{cls.className}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cls.subject} • {cls.teacher?.name}</div>
                                        </div>
                                        <button
                                            onClick={() => selectedClassForLectures === cls._id ? setSelectedClassForLectures(null) : fetchClassLectures(cls._id)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.8rem',
                                                background: selectedClassForLectures === cls._id ? 'var(--bg-secondary)' : 'var(--accent-neon)',
                                                color: selectedClassForLectures === cls._id ? 'var(--text-main)' : 'black',
                                                border: '1px solid var(--glass-border)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {selectedClassForLectures === cls._id ? 'Hide' : 'Materials'}
                                        </button>
                                    </div>

                                    {selectedClassForLectures === cls._id && (
                                        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0, 240, 255, 0.02)' }}>
                                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--accent-neon)' }}>Lecture Materials</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                {classLectures.length === 0 ? (
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No materials uploaded for this class yet.</p>
                                                ) : (
                                                    classLectures.map(lec => (
                                                        <div key={lec._id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>{lec.title}</div>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>{lec.content}</p>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                {lec.pdfUrl && (
                                                                    <a href={lec.pdfUrl} target="_blank" rel="noopener noreferrer" className="badge badge-primary" style={{ textDecoration: 'none', cursor: 'pointer' }}>View PDF</a>
                                                                )}
                                                                {lec.externalLink && (
                                                                    <a href={lec.externalLink} target="_blank" rel="noopener noreferrer" className="badge badge-success" style={{ textDecoration: 'none', cursor: 'pointer' }}>Open Link</a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Upcoming Exam Schedules */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-neon)' }}>
                        <Calendar size={20} /> My Upcoming Exam Schedule
                    </h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Class</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examSchedules.filter(sch => enrolledClasses.some(c => c._id === sch.classID)).length === 0 ? (
                                    <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '1rem' }}>No upcoming exams scheduled.</td></tr>
                                ) : (
                                    examSchedules
                                        .filter(sch => enrolledClasses.some(c => c._id === sch.classID))
                                        .map(sch => {
                                            const classObj = enrolledClasses.find(c => c._id === sch.classID);
                                            return (
                                                <tr key={sch._id}>
                                                    <td className="font-bold text-cyan-400">{classObj?.subject || sch.ExamId}</td>
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

                {/* My Assignments */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-neon)' }}>
                        <BookOpen size={20} /> My Assignments
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {assignments.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No assignments posted for your classes.</p>
                        ) : (
                            assignments.map(a => (
                                <div key={a._id} style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: 'var(--accent-neon)' }}>{a.title}</strong>
                                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{a.type}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{a.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Due: {new Date(a.dueDate).toLocaleDateString()}
                                        </div>
                                        <button 
                                            onClick={() => setShowSubmitModal(a._id)}
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        >
                                            Submit Link
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {showSubmitModal && (
                        <div className="fixed-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="glass-card" style={{ maxWidth: '500px', width: '90%' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Submit Assignment</h3>
                                <form onSubmit={handleSubmitAssignment}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Submission URL (Google Drive, Docs, etc.)</label>
                                    <input 
                                        type="url" 
                                        required 
                                        placeholder="https://docs.google.com/..." 
                                        value={submissionUrl} 
                                        onChange={e => setSubmissionUrl(e.target.value)} 
                                        style={{ width: '100%', marginBottom: '1.5rem' }}
                                    />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Now</button>
                                        <button type="button" onClick={() => setShowSubmitModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Available Exams */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><AlertCircle size={20} color="var(--danger)" /> Action Required: New Exams</h3>
                    {availableExams.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>You have no pending exams.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {availableExams.map(exam => (
                                <li key={exam._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                    <div>
                                        <strong>{exam.subject}</strong>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exam.questions.length} Questions • {exam.totalMarks} Pts</div>
                                    </div>
                                    <button onClick={() => startExam(exam)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                        <PlayCircle size={16} /> Start
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Transcript / Grades */}
                {/* تم تعديل span ليكون 2 عشان يمشي مع الـ Layout الجديد */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}><CheckCircle size={20} color="var(--success)" /> My Transcript</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 215, 0, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                            <Star size={18} color="#FFD700" fill="#FFD700" />
                            <span style={{ fontWeight: 'bold', color: '#FFD700', fontSize: '0.9rem' }}>Attendance Points: {points}</span>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading your grades...</p>
                    ) : grades.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No grades found. You haven't taken any exams yet!</p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Exam Date</th>
                                        <th>Score</th>
                                        <th>Total Marks</th>
                                        <th>Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.exam?.subject || 'N/A'}</td>
                                            <td>{item.exam?.date ? new Date(item.exam.date).toLocaleDateString() : 'N/A'}</td>
                                            <td style={{ fontWeight: 'bold', color: 'var(--accent-neon)' }}>{item.Score}</td>
                                            <td>{item.exam?.totalMarks || 'N/A'}</td>
                                            <td>{item.feedback || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;