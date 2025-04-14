export default function FacultyAdvisorCard({ advisor, program }) {
    return (
        <div className="card">
            <h3>Faculty Advisor</h3>
            <p>{advisor}</p>
            <p>Program: {program}</p>
            <button>Raise Issue</button>
        </div>
    );
}