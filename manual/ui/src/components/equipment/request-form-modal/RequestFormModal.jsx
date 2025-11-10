import { useState, useEffect } from "react";

export default function RequestFormModal({
  show,
  onHide,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    from_date: "",
    to_date: "",
  });

  useEffect(() => {
    console.log("Initial data in RequestFormModal:", initialData);
    setForm({
  
      from_date: "",
      to_date: "",
    });
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
            <h5 className="modal-title">Create Equipment Request</h5>
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
                  <p>
                    <b>Equipment Name: {initialData.name}</b>
                  </p>
                </div>
                <div className="col-12">
                  <label htmlFor="from_date" className="form-label">
                    From
                  </label>
                  <input
                    id="from_date"
                    type="date"
                    className="form-control"
                    name="from_date"
                    value={form.from_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="to_date" className="form-label">
                    From
                  </label>
                  <input
                    id="to_date"
                    type="date"
                    className="form-control"
                    name="to_date"
                    value={form.to_date}
                    onChange={handleChange}
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
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
