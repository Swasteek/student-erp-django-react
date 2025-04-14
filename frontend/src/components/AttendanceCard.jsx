import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';
import './AttendanceCard.css'; // Make sure this import exists

const COLORS = {
    good: '#4CAF50',    // Green (>75%)
    warning: '#FFC107',  // Yellow (65-75%)
    danger: '#F44336'    // Red (<65%)
};

export default function AttendanceCard() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [semester, setSemester] = useState('');

    // Debounced filter change handler
    const handleSemesterChange = debounce((selectedSemester) => {
        setSemester(selectedSemester);
        setLoading(true);
    }, 300);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = semester ? { params: { semester } } : {};
                const res = await client.get('/attendance/', params);
                const processed = res.data.map(item => ({
                    ...item,
                    color: item.percentage >= 75 ? COLORS.good :
                        item.percentage >= 65 ? COLORS.warning : COLORS.danger
                }));
                setData(processed);
            } catch (err) {
                toast.error('Failed to load attendance');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, semester]);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner">Loading...</div>
        </div>
    );

    if (data.length === 0) return (
        <div className="empty-state">
            {semester ? (
                <>
                    <p>No attendance records found for Semester {semester}</p>
                    <button
                        onClick={() => handleSemesterChange('')}
                        className="reset-button"
                    >
                        Show All Semesters
                    </button>
                </>
            ) : (
                <p>No attendance records found</p>
            )}
        </div>
    );

    return (
        <div className="attendance-card">
            <h3>Attendance Summary</h3>

            {/* Enhanced Filter Section */}
            <div className="filter-controls">
                <div className="semester-filter">
                    <label htmlFor="semester-select">Filter by Semester: </label>
                    <select
                        id="semester-select"
                        value={semester}
                        onChange={(e) => handleSemesterChange(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">All Semesters</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                    </select>
                </div>
            </div>

            {/* Chart Section */}
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                        <Bar dataKey="percentage">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table Section */}
            <div className="attendance-table">
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Present</th>
                            <th>Total</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.subject}</td>
                                <td>{item.present}</td>
                                <td>{item.total}</td>
                                <td style={{ color: item.color }}>{item.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}