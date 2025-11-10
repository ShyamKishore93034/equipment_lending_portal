import { useEffect, useState } from "react";
import api from "../../services/api";
import RequestFormModal from "../../components/equipment/request-form-modal/RequestFormModal";
import { createRequest, returnRequest } from "../../services/RequestService";
import {
  getAllEquipmentAdmin,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../../services/EquipmentService";

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestingEquipment, setRequestingEquipment] = useState(null);

  const userId = localStorage.getItem("id");

  const loadEquipment = async () => {
    const data = await getAllEquipmentAdmin();
    setEquipment(data);
    setLoading(false);
  };

  // Fetch all equipment
  useEffect(() => {
    loadEquipment();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = equipment;

    if (search) {
      result = result.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      result = result.filter((i) => i.category === category);
    }
    setFiltered(result);
  }, [search, category, equipment]);

  const handleSave = async (formData) => {
    console.log("Saved data:", formData);
    const payload = {
      ...formData,
      equipment_id: requestingEquipment.equipment_id,
      user_id: userId,
    };
    console.log("Saved data:", payload);
    try {
      await createRequest(payload);
      setShowModal(false);
      window.alert("Request created successfully!");
    } catch (error) {
      console.error("Error creating request:", error);
      console.error("Error creating request:", error.response.data.error);
      window.alert(error.response.data.error || "Failed to create request.");
    }
    loadEquipment();
  };

  const openCreateRequest = (equipment_id, name) => {
    console.log("User ID:", localStorage.getItem("id"));
    console.log("Opening request for:", name);
    const data = {
      equipment_id: equipment_id,
      user_id: userId,
      name: name,
    };
    setRequestingEquipment(data);
    setShowModal(true);
  };

  // Get unique categories for dropdown
  const categories = [...new Set(equipment.map((i) => i.category))];

  if (loading)
    return (
      <div className="text-center">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div>
      <h2 className="mb-4">Equipment List</h2>

      {/* Search & Filter */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="row">
        {filtered.length === 0 ? (
          <p className="text-muted">No equipment found.</p>
        ) : (
          filtered.map((item) => (
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {item.category}
                    <br />
                    <strong>Condition:</strong> {item.condition}
                    <br />
                    <strong>Qty:</strong> {item.quantity}
                    <br />
                    <strong>Available:</strong>{" "}
                    {item.available > 0 ? item.available : "No"}
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <button
                    className="btn btn-sm btn-outline-primary w-100"
                    disabled={!(item.available > 0)}
                    onClick={() => openCreateRequest(item.id, item.name)}
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <RequestFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        onSave={handleSave}
        initialData={requestingEquipment}
      />
    </div>
  );
}
