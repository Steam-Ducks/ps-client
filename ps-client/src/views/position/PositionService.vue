import axios from 'axios';

export default {
  async getAllCargos() {
    const response = await axios.get('/api/cargos');
    return response.data;
  },

  async createCargo(cargo) {
    await axios.post('/api/cargos', cargo);
  },

  async updateCargo(id, cargo) {
    await axios.put(`/api/cargos/${id}`, cargo);
  }
};
