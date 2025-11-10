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
    if (editingItem) {
      await updateEquipment(editingItem.id, formData);
    } else {
      await createEquipment(formData);
    }
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
    if (window.confirm("Are you sure you that equipment have been returned?")) {
      await returnRequest(id);
      loadEquipment();
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Equipment</h2>
        <button className="btn btn-success" onClick={openAdd}>
          Add New Equipment
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Quantity</th>
              <th>Available</th>
              <th>Actions</th>
              <th>Borrowers</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.condition}</td>
                <td>{item.quantity}</td>
                <td>{item.isAvailable ? item.available : "No"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  {item.currentUsers && item.currentUsers.length > 0 ? (
                    <table className="w-100 table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Is Overdue</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.currentUsers.map((user, index) => (
                          <tr className={user.isOverDue ? "table-danger" : ""}>
                            <td>{index + 1}</td>
                            <td>{user.userName}</td>
                            <td>{user.isOverDue ? "Yes" : "No"}</td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  openReturnConfirmation(user.requestId)
                                }
                              >
                                Return Now
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span>No current borrowers</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
