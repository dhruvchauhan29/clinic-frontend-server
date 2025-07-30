import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditAppointment() {
  const router = useRouter();
  const { id } = router.query;

  const [appointment, setAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`)
        .then((res) => res.json())
        .then(setAppointment);

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`)
        .then((res) => res.json())
        .then(setDoctors);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: appointment.patientName,
        date: appointment.date,
        time: appointment.time,
        doctorId: parseInt(appointment.doctor.id),
        status: appointment.status,
      }),
    });
    router.push("/appointments");
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Edit Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Patient Name</label>
          <input
            className="form-control"
            value={appointment.patientName}
            onChange={(e) =>
              setAppointment({ ...appointment, patientName: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={appointment.date}
            onChange={(e) =>
              setAppointment({ ...appointment, date: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-control"
            value={appointment.time}
            onChange={(e) =>
              setAppointment({ ...appointment, time: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Doctor</label>
          <select
            className="form-select"
            value={appointment.doctor.id}
            onChange={(e) =>
              setAppointment({
                ...appointment,
                doctor: { ...appointment.doctor, id: parseInt(e.target.value) },
              })
            }
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={appointment.status}
            onChange={(e) =>
              setAppointment({ ...appointment, status: e.target.value })
            }
          >
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button className="btn btn-primary">Update Appointment</button>
      </form>
    </div>
  );
}
