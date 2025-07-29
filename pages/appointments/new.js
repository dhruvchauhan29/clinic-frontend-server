import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function NewAppointment() {
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3001/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName,
        date,
        time,
        doctorId: parseInt(doctorId),
      }),
    });
    router.push("/appointments");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Schedule New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Patient Name</label>
          <input
            className="form-control"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Doctor</label>
          <select
            className="form-select"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-success">Book Appointment</button>
      </form>
    </div>
  );
}
