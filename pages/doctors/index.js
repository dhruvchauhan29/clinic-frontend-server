import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3001/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await fetch(`http://localhost:3001/doctors/${id}`, {
        method: "DELETE",
      });
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor", err);
    }
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor({ ...doctor });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:3001/doctors/${selectedDoctor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDoctor),
      });
      fetchDoctors();
      closeModal();
    } catch (err) {
      console.error("Error updating doctor", err);
    }
  };

  const getBadgeClass = (availability) => {
    switch (availability?.toLowerCase()) {
      case "available":
        return "badge bg-success";
      case "busy":
        return "badge bg-warning text-dark";
      case "off duty":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Doctors</h2>
        <Link href="/doctors/add" className="btn btn-warning">
          Add New Doctor
        </Link>
      </div>

      {doctors.map((doc) => (
        <div key={doc.id} className="card mb-3 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Dr. {doc.name}</h5>
              <small className="text-muted">{doc.specialization}</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className={getBadgeClass(doc.availability)}>
                {doc.availability}
              </span>
              <span className="text-muted small">Location: {doc.location}</span>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => openEditModal(doc)}
              >
                <FaEdit />
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteDoctor(doc.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal for editing doctor */}
      {showModal && selectedDoctor && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Doctor</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedDoctor.name}
                    onChange={(e) =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedDoctor.specialization}
                    onChange={(e) =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={selectedDoctor.gender}
                    onChange={(e) =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedDoctor.location}
                    onChange={(e) =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Availability</label>
                  <select
                    className="form-select"
                    value={selectedDoctor.availability}
                    onChange={(e) =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        availability: e.target.value,
                      })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="off duty">Off Duty</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleUpdate}>
                  Update
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
