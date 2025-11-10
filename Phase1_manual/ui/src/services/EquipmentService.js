import API from "./api";

/**
 * EquipmentService
 * GET  /equipment/admin
 * GET  /equipment
 * POST /equipment
 * PUT  /equipment/:id
 * DELETE /equipment/:id
 */

export const getAllEquipmentAdmin = async () => {
  const res = await API.get("/equipment/admin");
  return res.data;
};
export const getAllEquipment = async () => {
  const res = await API.get("/equipment");
  return res.data;
};

export const createEquipment = async (payload) => {
  const res = await API.post("/equipment", payload);
  return res.data;
};

export const updateEquipment = async (id, payload) => {
  const res = await API.put(`/equipment/${id}`, payload);
  return res.data;
};

export const deleteEquipment = async (id) => {
  const res = await API.delete(`/equipment/${id}`);
  return res;
};
