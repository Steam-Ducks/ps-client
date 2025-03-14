import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

const API_URL = 'http://localhost:8080/api'; // Aonde o bootstrap está disponibilizando os dados

const UserService = { // Aonde colocamos as funções para as requisições

  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } 
    
    catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },


  async getUserById(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } 
    
    catch (error) {
      console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

};

export default UserService;
