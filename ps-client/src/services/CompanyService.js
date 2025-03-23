import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

const API_URL = 'http://localhost:8080/api'; // Aonde o bootstrap está disponibilizando os dados

const CompanyService = { // Aonde colocamos as funções para as requisições
  
  async createCompany(createCompany){
    try {
      const response = await axios.post(`${API_URL}/companies`, createCompany);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao criar empresa: ' + error.message);
    }
  },

  async getAllCompanies(){
    try {
      const response = await axios.get(`${API_URL}/companies`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao listar empresas: ' + error.message);
    }
  },

  async getCompanyById(companyId){
    try {
      const response = await axios.get(`${API_URL}/companies/${companyId}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao achar empresa: ' + error.message);
    }
  },

  async editCompany(companyId, updateCompanyDto) { 
    try {
      const response = await axios.put(`${API_URL}/companies/${companyId}`, updateCompanyDto);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao editar empresa: ' + error.message);
    }
  },

  async deleteCompanyById(companyId){
    try {
      const response = await axios.delete(`${API_URL}/companies/${companyId}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao deletar empresa: ' + error.message);
    }
  },

};

export default CompanyService;
