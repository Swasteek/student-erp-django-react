import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const ExamScheduleCard = () => {
    // State management
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Data fetching
    useEffect(() => {
        const fetchExamSchedule = async () => {
            try {
                const res = await client.get('/exams/'); // Correct endpoint
                setExams(res.data);
            } catch (err) {
                console.error('API Error:', err);
                toast.error('Failed to load exams');
            }
        };
        fetchExamSchedule();
    }, []);
    // Format exam time display
    const formatExamTime = (start, end) => {
        return `${start} - ${end}`;
    };

    // Loading state
    if (loading) {
        return (
            <div className="exam-loading">
                <p>Loading exam schedule...</p>
                <div className="loading-spinner" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="exam-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    // Empty state
    if (exams.length === 0) {
        return (
            <div className="exam-empty">
                <p>No upcoming exams scheduled</p>
            </div>
        );
    }

    // Main render
    return (
        <div className="exam-schedule-card">
            <header className="exam-header">
                <h2>Exam Schedule</h2>
                <span className="last-updated">
                    Last updated: {new Date().toLocaleString()}
                </span>
            </header>

            <div className="exam-table-container">
                <table className="exam-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <tr key={`exam-${exam.id}`} className="exam-row">
                                <td>{exam.subject}</td>
                                <td>{new Date(exam.date).toLocaleDateString()}</td>
                                <td>{formatExamTime(exam.start_time, exam.end_time)}</td>
                                <td>{exam.room}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Prop type validation
ExamScheduleCard.propTypes = {
    refreshInterval: PropTypes.number,
};

ExamScheduleCard.defaultProps = {
    refreshInterval: 300000, // 5 minutes
};

export default ExamScheduleCard;