import { useEffect, useState } from "react";
import { createRequest } from "../../services/RequestService";
import { getAllEquipmentAdmin } from "../../services/EquipmentService";
import RequestFormModal from "../../components/equipment/request-form-modal/RequestFormModal";

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

  useEffect(() => { loadEquipment(); }, []);

  useEffect(() => {
    let result = equipment;
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(i => i.category === category);
    setFiltered(result);
  }, [search, category, equipment]);

  const handleSave = async (formData) => {
    const payload = { ...formData, equipment_id: requestingEquipment.id, user_id: userId };
    await createRequest(payload);
    setShowModal(false);
    alert("Request created successfully!");
    loadEquipment();
  };

  const openCreateRequest = (item) => {
    setRequestingEquipment(item);
    setShowModal(true);
  };

  const categories = [...new Set(equipment.map(i => i.category))];

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Browse Equipment</h3>
      </div>

      {/* Search + Filter */}
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(""); setCategory(""); }}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="row">
        {filtered.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body">
                <h5 className="mb-2 fw-semibold">{item.name}</h5>

                <div className="mb-2">
                  <span className="badge bg-secondary me-2">{item.category}</span>
                  <span className="badge bg-info text-dark">{item.condition}</span>
                </div>

                <div className="mt-3">
                  <div>
                    <small className="text-muted">Quantity:</small> <b>{item.quantity}</b>
                  </div>
                  <div>
                    <small className="text-muted">Available:</small>{" "}
                    <b className={item.available > 0 ? "text-success" : "text-danger"}>
                      {item.available > 0 ? item.available : "Not available"}
                    </b>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-white border-0">
                <button
                  className="btn btn-primary w-100"
                  disabled={!(item.available > 0)}
                  onClick={() => openCreateRequest(item)}
                >
                  Request Borrow
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-muted mt-4">No equipment found</div>
        )}
      </div>

      <RequestFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        initialData={requestingEquipment}
      />
    </div>
  );
}
