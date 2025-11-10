import { useEffect, useState } from "react";
import {
  getRequests,
  approveRequest,
  rejectRequest,
  returnRequest,
} from "../../services/RequestService";

export default function RequestList() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const data = await getRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id) => {
    if (window.confirm("Are you sure you to approve?")) {
      await approveRequest(id);
      loadRequests();
    }
  };
  const reject = async (id) => {
    if (window.confirm("Are you sure you to reject?")) {
      await rejectRequest(id);
      loadRequests();
    }
  };
  const returned = async (id) => {
    if (window.confirm("Are you sure eequipment returned?")) {
      await returnRequest(id);
      loadRequests();
    }
  };

  return (
    <div>
      <h4>Equipment Approvals</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle w-100">
          <thead className="table-dark">
            <tr>
              <th>Request ID</th>
              <th>Equipment Name</th>
              <th>User Name</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.equipmentName}</td>
                <td>{request.userName}</td>
                <td>{request.from_date}</td>
                <td>{request.to_date}</td>
                <td>
                  <span
                    class={
                      (request.status === "pending" &&
                        "badge rounded-pill text-bg-warning") ||
                      (request.status === "approved" &&
                        "badge rounded-pill text-bg-success")
                    }
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === "approved" ? (
                    <button
                      className="btn btn-sm btn-success w-100"
                      onClick={() => returned(request.id)}
                    >
                      Mark as Returned
                    </button>
                  ) : request.status === "pending" ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => reject(request.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-sm btn-success me-2 w-100"
                        onClick={() => approve(request.id)}
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <p class="text-info">No actions available</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
