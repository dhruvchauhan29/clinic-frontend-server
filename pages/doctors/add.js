import { useState } from "react";
import { useRouter } from "next/router";

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    gender: "",
    location: "",
    availability: "Available",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/doctors");
    } catch (err) {
      console.error("Error creating doctor", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit}>
        {["name", "specialization", "gender", "location"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              className="form-control"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Availability</label>
          <select
            className="form-select"
            name="availability"
            value={form.availability}
            onChange={handleChange}
          >
            <option>Available</option>
            <option>Busy</option>
            <option>Off Duty</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Add Doctor
        </button>
      </form>
    </div>
  );
}
