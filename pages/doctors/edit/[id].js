import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditDoctor() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    gender: "",
    location: "",
    availability: "",
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`);
    const data = await res.json();
    setForm(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/doctors");
  };

  return (
    <div className="container mt-5">
      <h2>Edit Doctor</h2>
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

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}
