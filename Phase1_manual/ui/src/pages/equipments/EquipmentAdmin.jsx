import { useEffect, useState } from "react";
import {
  getAllEquipmentAdmin,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../../services/EquipmentService";
import { returnRequest } from "../../services/RequestService";
import EquipmentFormModal from "../../components/equipment/equipment-form-modal/EquipmentFormModal";

export default function EquipmentAdmin() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadEquipment = async () => {
    const data = await getAllEquipmentAdmin();
    setEquipment(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleSave = async (formData) => {
    if (editingItem) await updateEquipment(editingItem.id, formData);
    else await createEquipment(formData);

    setShowModal(false);
    setEditingItem(null);
    loadEquipment();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      await deleteEquipment(id);
      loadEquipment();
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openReturnConfirmation = async (id) => {
    if (window.confirm("Confirm equipment return?")) {
      await returnRequest(id);
      loadEquipment();
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height:"60vh" }}>
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div className="container-fluid px-4">
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Equipment Management</h3>
          <div className="text-muted">Manage inventory and borrowers status here</div>
        </div>

        <button className="btn btn-dark px-4 py-2" onClick={openAdd}>
          + Add Equipment
        </button>
      </div>

      {/* Table card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-dark text-white">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Qty</th>
                <th>Available</th>
                <th>Borrowers</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.condition}</td>
                  <td><span className="badge bg-primary">{item.quantity}</span></td>
                  <td><span className="badge bg-success">{item.available}</span></td>
                  <td>
                    {item.currentUsers && item.currentUsers.length > 0 ? (
                      <span className="badge bg-warning text-dark">
                        {item.currentUsers.length} Active Borrowers
                      </span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>

                  <td className="text-end">
                    <button className="btn btn-outline-dark btn-sm me-2" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EquipmentFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}
