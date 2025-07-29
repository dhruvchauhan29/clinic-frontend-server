import { useRouter } from "next/router";
import {
  FaCalendarCheck,
  FaUserClock,
  FaUserMd,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold">Clinic Dashboard</h2>
        <button
          className="btn btn-outline-danger d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Introduction */}
      <div className="text-center mb-4">
        <h4 className="mb-3">Welcome, Front Desk Staff 👋</h4>
        <p className="text-muted">Select an area below to manage:</p>
      </div>

      {/* Action Buttons */}
      <div className="row justify-content-center g-4">
        {/* Appointment Management */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <FaCalendarCheck size={36} className="text-primary mb-3" />
              <h5 className="card-title">Appointment Management</h5>
              <p className="card-text">
                View, schedule, update, and cancel patient appointments.
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={() => router.push("/appointments")}
              >
                Go to Appointments
              </button>
            </div>
          </div>
        </div>

        {/* Queue Management */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <FaUserClock size={36} className="text-success mb-3" />
              <h5 className="card-title">Queue Management</h5>
              <p className="card-text">
                Manage walk-in patients and monitor their current status.
              </p>
              <button
                className="btn btn-success w-100"
                onClick={() => router.push("/queue")}
              >
                Go to Queue
              </button>
            </div>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <FaUserMd size={36} className="text-info mb-3" />
              <h5 className="card-title">Available Doctors</h5>
              <p className="card-text mt-3">
                Browse and manage the list of available doctors.
              </p>
              <button
                className="btn btn-info text-white w-100 mt-3"
                onClick={() => router.push("/doctors")}
              >
                View Doctors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
