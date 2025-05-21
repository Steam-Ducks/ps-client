import axios from 'axios'; // Biblioteca para fazer requisições HTTP.
import UserService from '@/services/UserService'; // Serviço para obter os cabeçalhos de autenticação.

const API_URL = 'http://localhost:8080/api/employees'; // Aonde o bootstrap está disponibilizando os dados

const EmployeeService = { // Aonde colocamos as funções para as requisições

  async createEmployee(createEmployee) {
    try {
      const response = await axios.post(`${API_URL}`, createEmployee, {
        headers: UserService.getAuthHeaders(), // Inclui os cabeçalhos de autenticação
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar funcionário";
      throw new Error(errorMessage);
    }
  },

  async getAllEmployees() {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: UserService.getAuthHeaders(), 
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar colaboradores: ' + error.message);
    }
  },

  async getInactvatedEmployee() {
    try {
      const response = await axios.get(`${API_URL}/inactivated`, {
        headers: UserService.getAuthHeaders(), 
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar colaboradores: ' + error.message);
    }
  },

  async getEmployeeById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: UserService.getAuthHeaders(), // Inclui os cabeçalhos de autenticação
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao achar empresa: ' + error.message);
    }
  },

  async updateEmployee(id, updateEmployee) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateEmployee, {
        headers: UserService.getAuthHeaders(), 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar funcionário";
      throw new Error(errorMessage);
    }
  },

  async uploadEmployeePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
          `${API_URL}/uploadPhoto`,
          formData,
          {
            headers: {
              ...UserService.getAuthHeaders(), // Inclui os cabeçalhos de autenticação
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      return response.data.photoUrl;
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro no upload da imagem';
      throw new Error(msg);
    }
  },

  async updateEmployeePhoto(photoURL, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('photoURL', photoURL);

      const response = await axios.put(
          `${API_URL}/updatePhoto`,
          formData,
          {
            headers: {
              ...UserService.getAuthHeaders(),
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      return response.data.photoUrl;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar a foto do funcionário';
      throw new Error(errorMessage);
    }
  },

  async terminateEmployee(employeeId) {
    try {
      await axios.put(
          `${API_URL}/${employeeId}/terminate`,
          null,
          {
            headers: UserService.getAuthHeaders()
          }
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao desativar o funcionário';
      throw new Error(errorMessage);
    }
  }

};

export default EmployeeService;