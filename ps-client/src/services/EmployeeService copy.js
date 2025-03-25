import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

const API_URL = 'http://localhost:8080/api/employees'; // Aonde o bootstrap está disponibilizando os dados

const EmployeeService = { // Aonde colocamos as funções para as requisições
  
  async createEmployee(createEmployee){
    try {
      const response = await axios.post(`${API_URL}`, createEmployee);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao criar cadastro de funcionario: ' + error.message);
    }
  },

  async getAllEmployees(){ 
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao listar cadastros de funcionarios: ' + error.message);
    }
  },

  async getEmployeeById(employeeId){
    try {
      const response = await axios.get(`${API_URL}/${employeeId}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao achar cadastro de funcionario: ' + error.message);
    }
  },

};

export default EmployeeService;
