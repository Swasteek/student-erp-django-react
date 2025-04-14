import { useAuth } from '../auth/AuthContext';
import client from '../api/client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);

    // Fetch profile data
    useEffect(() => {
        client.get('/profile/')
            .then((res) => setProfile(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="dashboard">
            <h1>Welcome, {profile?.name || user?.username}!</h1>

            {/* Display basic profile info */}
            <div className="profile-section">
                {profile?.program && <p>Program: {profile.program}</p>}
                {profile?.advisor && <p>Advisor: {profile.advisor}</p>}
                {profile?.branch && <p>Branch: {profile.branch}</p>}
                {profile?.semester && <p>Semester: {profile.semester}</p>}
                {profile?.roll_number && <p>Roll Number: {profile.roll_number}</p>}
            </div>

            <button onClick={logout} className="logout-btn">
                Logout
            </button>
        </div>
    );
}