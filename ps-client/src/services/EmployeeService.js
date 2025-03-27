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

  async getAllEmployees(){ // Changed the method name to 'getAllEmployees'
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

};

export default EmployeeService;
