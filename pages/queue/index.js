import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaUserClock,
  FaUserMd,
  FaCheckCircle,
  FaSearch,
  FaClock,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function QueueManagement() {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    patientName: "",
    queueNumber: "",
    doctorId: "",
    status: "waiting",
    priority: "normal",
  });

  const router = useRouter();

  useEffect(() => {
    fetchQueue();
    fetchDoctors();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue`);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load queue", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Failed to load doctors", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchQueue();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deletePatient = async (id) => {
    if (!confirm("Delete this patient from queue?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue/${id}`, {
        method: "DELETE",
      });
      fetchQueue();
    } catch (err) {
      console.error("Failed to delete patient", err);
    }
  };

  // ---------- Modal helpers ----------
  const openNew = () => {
    setForm({
      id: null,
      patientName: "",
      queueNumber: nextQueueNumber(),
      doctorId: "",
      status: "waiting",
      priority: "normal",
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      id: p.id,
      patientName: p.patientName,
      queueNumber: p.queueNumber,
      doctorId: p.doctor?.id || "",
      status: p.status,
      priority: p.priority || "normal",
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const saveForm = async () => {
    if (!form.patientName || !form.queueNumber || !form.doctorId) {
      alert("Please fill patient name, queue number and doctor.");
      return;
    }

    const payload = {
      patientName: form.patientName,
      queueNumber: Number(form.queueNumber),
      status: form.status,
      priority: form.priority,
      doctorId: Number(form.doctorId),
    };

    const url = form.id
      ? `${process.env.NEXT_PUBLIC_API_URL}/queue/${form.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/queue`;
    const method = form.id ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      closeModal();
      fetchQueue();
    } catch (err) {
      console.error("Failed to save queue item", err);
    }
  };

  const nextQueueNumber = () => {
    const nums = patients.map((p) => p.queueNumber || 0);
    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
    // Or compute position-based:
    // return (patients.length || 0) + 1;
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesFilter = filter === "All" || p.status === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.patientName?.toLowerCase().includes(q) ||
        p.status?.toLowerCase().includes(q) ||
        p.doctor?.name?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [patients, filter, search]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const estimateWait = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.max(0, Math.round(diffMs / 60000));
    return `${diffMins} min`;
  };

  const PriorityBadge = ({ priority }) => {
    if (priority === "urgent") {
      return (
        <span className="badge bg-danger d-inline-flex align-items-center gap-1">
          <FaExclamationTriangle /> Urgent
        </span>
      );
    }
    return <span className="badge bg-secondary">Normal</span>;
  };

  const StatusView = ({ status }) => {
    if (status === "waiting")
      return (
        <span className="text-warning d-inline-flex align-items-center gap-1">
          <FaUserClock /> Waiting
        </span>
      );
    if (status === "with_doctor")
      return (
        <span className="text-info d-inline-flex align-items-center gap-1">
          <FaUserMd /> With Doctor
        </span>
      );
    return (
      <span className="text-success d-inline-flex align-items-center gap-1">
        <FaCheckCircle /> Completed
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3 fw-bold">Queue Management</h4>

      {/* Filter & Search */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <label className="form-label m-0">Filter:</label>
          <select
            className="form-select form-select-sm w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="waiting">Waiting</option>
            <option value="with_doctor">With Doctor</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="input-group input-group-sm" style={{ width: "260px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search patients"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Queue List */}
      {filteredPatients.map((p) => (
        <div className="card mb-3 shadow-sm" key={p.id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {p.queueNumber}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <strong>{p.patientName}</strong>
                  <PriorityBadge priority={p.priority || "normal"} />
                </div>
                <div className="text-muted small mt-1">
                  <StatusView status={p.status} />
                </div>
                <div className="small text-muted mt-1 d-flex align-items-center gap-2">
                  <FaClock /> Arrival: {formatTime(p.createdAt)} | Est. Wait:{" "}
                  {estimateWait(p.createdAt)}
                </div>
                <div className="small text-muted mt-1">
                  Doctor: {p.doctor?.name || "-"}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="d-flex gap-2 align-items-center">
              <select
                className="form-select form-select-sm"
                value={p.status}
                onChange={(e) => updateStatus(p.id, e.target.value)}
              >
                <option value="waiting">Waiting</option>
                <option value="with_doctor">With Doctor</option>
                <option value="completed">Completed</option>
              </select>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => openEdit(p)}
              >
                <FaEdit />
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => deletePatient(p.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add New */}
      <div className="d-grid mt-4">
        <button className="btn btn-warning border" onClick={openNew}>
          Add New Patient to Queue
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {form.id ? "Edit Queue Entry" : "Add Patient to Queue"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.patientName}
                    onChange={(e) =>
                      setForm({ ...form, patientName: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Queue Number</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.queueNumber}
                    onChange={(e) =>
                      setForm({ ...form, queueNumber: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Doctor</label>
                  <select
                    className="form-select"
                    value={form.doctorId}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="waiting">Waiting</option>
                    <option value="with_doctor">With Doctor</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={saveForm}>
                  {form.id ? "Save Changes" : "Add to Queue"}
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
