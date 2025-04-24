import axios from 'axios';

// Crie uma instância do axios com a URL base da sua API
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8091',
  headers: {
    'Content-Type': 'application/json'
  }
});

class EmployeeService {
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with id ${id}:`, error);
      throw error;
    }
  }

  async createEmployee(employee) {
    try {
      const response = await api.post('/employees', employee);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(employee) {
    try {
      const response = await api.put(`/employees/${employee.id}`, employee);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with id ${employee.id}:`, error);
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee with id ${id}:`, error);
      throw error;
    }
  }

  async uploadEmployeePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/employees/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.photoUrl;
    } catch (error) {
      console.error('Error uploading employee photo:', error);
      throw error;
    }
  }
}

export default new EmployeeService();
