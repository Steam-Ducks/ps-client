import axios from 'axios'; // Biblioteca para fazer requisições HTTP.
import UserService from './UserService'; // Serviço para obter os cabeçalhos de autenticação.

const API_URL = 'http://localhost:8080/api/companies'; // Aonde o bootstrap está disponibilizando os dados

const CompanyService = { // Aonde colocamos as funções para as requisições

  async createCompany(createCompany) {
    try {
      const response = await axios.post(`${API_URL}`, createCompany, {
        headers: UserService.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar empresa.";
      throw new Error(errorMessage);
    }
  },

  async getAllCompanies(){
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: UserService.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar empresas: ' + error.message);
    }
  },

  async getCompanyById(companyId){
    try {
      // Garantir que o ID seja tratado corretamente, removendo qualquer caractere especial
      const cleanId = String(companyId).replace(/[^0-9]/g, '');
      const response = await axios.get(`${API_URL}/${cleanId}`, {
        headers: UserService.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Erro completo:', error);
      throw new Error('Erro ao achar empresa: ' + error.message);
    }
  },

  // Método updateCompany corrigido
  async updateCompany(companyId, updateCompanyDto) {
    try {
      console.log('Atualizando empresa com ID:', companyId);
      console.log('Dados enviados:', updateCompanyDto);

      // Garantir que o ID seja tratado corretamente, removendo qualquer caractere especial
      const cleanId = String(companyId).replace(/[^0-9]/g, '');

      // Garantir que todos os campos necessários estejam presentes
      const completeData = {
        ...updateCompanyDto,
        // Adicionar outros campos que possam ser necessários mas não estão sendo enviados
        // Se a API espera o CNPJ mesmo que não seja alterado, incluí-lo aqui
        cnpj: updateCompanyDto.cnpj || ''
      };

      // Usar método PATCH em vez de PUT se a API esperar atualizações parciais
      const response = await axios.put(`${API_URL}/${cleanId}`, completeData, {
        headers: {
          ...UserService.getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta da atualização:', response);
      return response;
    } catch (error) {
      console.error('Erro completo ao atualizar empresa:', error);
      console.error('Resposta do servidor:', error.response?.data);
      console.error('Status do erro:', error.response?.status);
      throw new Error('Erro ao editar empresa: ' + (error.response?.data?.message || error.message));
    }
  },

  // Mantido para compatibilidade com código existente
  async editCompany(companyId, updateCompanyDto) {
    return this.updateCompany(companyId, updateCompanyDto);
  },

  async deleteCompanyById(companyId){
    try {
      // Garantir que o ID seja tratado corretamente, removendo qualquer caractere especial
      const cleanId = String(companyId).replace(/[^0-9]/g, '');
      const response = await axios.delete(`${API_URL}/${cleanId}`, {
        headers: UserService.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      throw new Error('Erro ao deletar empresa: ' + error.message);
    }
  },

};

export default CompanyService;
