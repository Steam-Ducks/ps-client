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
        headers: UserService.getAuthHeaders(), // Inclui os cabeçalhos de autenticação
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar empresas: ' + error.message);
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

};

export default EmployeeService;