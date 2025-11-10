import { useEffect, useState } from "react";
import {
  getRequests,
  approveRequest,
  rejectRequest,
  returnRequest,
} from "../../services/RequestService";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    const data = await getRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id) => {
    if (window.confirm("Are you sure you want to approve this request?")) {
      await approveRequest(id);
      loadRequests();
    }
  };

  const reject = async (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      await rejectRequest(id);
      loadRequests();
    }
  };

  const returned = async (id) => {
    if (window.confirm("Mark equipment as returned?")) {
      await returnRequest(id);
      loadRequests();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning text-dark";
      case "approved":
        return "badge bg-success";
      case "rejected":
        return "badge bg-danger";
      case "returned":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div>
      <h3 className="mb-4 fw-bold">Equipment Requests</h3>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#ID</th>
              <th>Equipment</th>
              <th>User</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className={req.status === "pending" && new Date(req.to_date) < new Date() ? "table-danger" : ""}
              >
                <td>{req.id}</td>
                <td>{req.equipmentName}</td>
                <td>{req.userName}</td>
                <td>{req.from_date}</td>
                <td>{req.to_date}</td>
                <td>
                  <span className={getStatusBadge(req.status)}>{req.status}</span>
                </td>
                <td className="text-center">
                  {req.status === "pending" ? (
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => reject(req.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => approve(req.id)}
                      >
                        Approve
                      </button>
                    </div>
                  ) : req.status === "approved" ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => returned(req.id)}
                    >
                      Mark Returned
                    </button>
                  ) : (
                    <span className="text-muted">No Actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <p className="text-center p-3 text-muted">No requests available</p>}
      </div>
    </div>
  );
}
