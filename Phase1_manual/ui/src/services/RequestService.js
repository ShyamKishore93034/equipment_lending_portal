import API from "./api";

// Request

export const getRequests = async (id) => {
  const res = await API.get(`/request`);
  return res.data;
};

export const createRequest = async (payload) => {
  const res = await API.post(`/request`, payload);
  return res;
};

export const approveRequest = async (id) => {
  const res = await API.put(`/request/${id}/approve`);
  return res;
};

export const rejectRequest = async (id) => {
  const res = await API.put(`/request/${id}/reject`);
  return res;
};

export const returnRequest = async (id) => {
  const res = await API.put(`/request/${id}/return`);
  return res;
};
