import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaCalendarCheck } from "react-icons/fa";
import { FaUserMd, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`);
    const data = await res.json();
    setAppointments(data);
  };

  const fetchDoctors = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`);
    const data = await res.json();
    setDoctors(data);
  };

  const updateStatus = async (id, newStatus) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAppointments();
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
      method: "DELETE",
    });
    fetchAppointments();
  };

  const openEditModal = (appointment) => {
    setSelectedAppointment({ ...appointment });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleUpdate = async () => {
    if (!selectedAppointment || !selectedAppointment.doctor?.id) {
      alert("Please select a doctor before submitting.");
      return;
    }

    const payload = {
      patientName: selectedAppointment.patientName,
      date: selectedAppointment.date,
      time: selectedAppointment.time,
      status: selectedAppointment.status,
      doctorId: selectedAppointment.doctor.id,
    };

    try {
      if (selectedAppointment.id) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments/${selectedAppointment.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      fetchAppointments();
      setShowModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error("Failed to submit appointment", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold">Appointment Management</h3>

      {appointments.map((appt) => (
        <div className="card mb-3" key={appt.id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <strong>{appt.patientName}</strong> <br />
              <small className="text-muted d-flex align-items-center gap-1">
                <FaUserMd /> {appt.doctor?.name}
              </small>
              <br />
              <small
                className="text-muted d-flex align-items-center gap-1"
                style={{ marginTop: "-18px" }}
              >
                <FaCalendarAlt className="mt-0" /> {appt.date}
                <FaClock /> {appt.time}
              </small>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Status badge with icon */}
              <span
                className={`badge d-flex align-items-center gap-1 ${
                  appt.status === "booked"
                    ? "bg-primary"
                    : appt.status === "completed"
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {appt.status === "booked" && <FaCalendarCheck />}
                {appt.status === "completed" && <FaCheckCircle />}
                {appt.status === "cancelled" && <FaTimesCircle />}
                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              </span>

              <select
                className="form-select"
                value={appt.status}
                onChange={(e) => updateStatus(appt.id, e.target.value)}
              >
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                className="btn btn-outline-primary"
                onClick={() => openEditModal(appt)}
              >
                <FaEdit />
              </button>

              <button
                className="btn btn-outline-danger"
                onClick={() => handleDelete(appt.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAppointment.patientName}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        patientName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedAppointment.date}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={selectedAppointment.time}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <select
                    className="form-select"
                    value={selectedAppointment?.doctor?.id || ""}
                    onChange={(e) => {
                      const selectedDocId = parseInt(e.target.value);
                      const selectedDoc = doctors.find(
                        (doc) => doc.id === selectedDocId
                      );
                      setSelectedAppointment({
                        ...selectedAppointment,
                        doctor: selectedDoc,
                      });
                    }}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={selectedAppointment.status}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleUpdate} className="btn btn-success">
                  Update
                </button>
                <button onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary w-100 mt-4"
        onClick={() => {
          setSelectedAppointment({
            patientName: "",
            date: "",
            time: "",
            status: "booked",
            doctor: null,
          });
          setShowModal(true);
        }}
      >
        Schedule New Appointment
      </button>
    </div>
  );
}
