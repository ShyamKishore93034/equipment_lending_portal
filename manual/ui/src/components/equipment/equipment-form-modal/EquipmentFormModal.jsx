import { useState, useEffect } from "react";

export default function EquipmentFormModal({
  show,
  onHide,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    condition: "Good",
    quantity: 1,
    availability: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        category: "",
        condition: "Good",
        quantity: 1,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit" : "Add"} Equipment
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row text-start">
                <div className="col-12">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Media">Media</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Lab">Lab</option>
                    <option value="Media">Media</option>
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="condition" className="form-label">
                    Condition
                  </label>
                  <select
                    id="condition"
                    className="form-select"
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="quantity" className="form-label">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {initialData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
