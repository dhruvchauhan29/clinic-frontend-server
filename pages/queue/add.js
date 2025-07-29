import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AddToQueue() {
  const [patientName, setPatientName] = useState("");
  const [queueNumber, setQueueNumber] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3001/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Failed to load doctors", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          queueNumber: parseInt(queueNumber),
          doctorId: parseInt(doctorId),
        }),
      });
      router.push("/queue");
    } catch (err) {
      console.error("Failed to add patient", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Patient to Queue</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Patient Name</label>
          <input
            type="text"
            className="form-control"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Queue Number</label>
          <input
            type="number"
            className="form-control"
            value={queueNumber}
            onChange={(e) => setQueueNumber(e.target.value)}
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
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Add to Queue
        </button>
      </form>
    </div>
  );
}
