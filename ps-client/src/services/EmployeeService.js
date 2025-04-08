import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

const API_URL = 'http://localhost:8080/api/employees'; // Aonde o bootstrap está disponibilizando os dados

const EmployeeService = { // Aonde colocamos as funções para as requisições
  
  async createEmployee(createEmployee){
    try {
      const response = await axios.post(`${API_URL}`, createEmployee);
      return response.data; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar funcionário"
      throw new Error(errorMessage);
    }
  },

  async getAllEmployees(){
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao listar empresas: ' + error.message);
    }
  },

  async getEmployeeById(employeeId){
    try {
      const response = await axios.get(`${API_URL}/${employeeId}`);
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
      );
  
      return response.data.photoUrl;
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro no upload da imagem';
      throw new Error(msg);
    }
  },

};

export default EmployeeService;
