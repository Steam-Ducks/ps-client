import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = `${API_URL}/auth`;
const USERS_URL = `${API_URL}/users`;

const UserService = {
  getToken() {
    const token = localStorage.getItem('token');
    if (!token || token.trim() === '') {
      console.error('JWT token is missing or empty');
      return null;
    }
    return token;
  },

  getIsAdmin() {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true';
  },
  getUsername() {
    return localStorage.getItem('username');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
  },

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${AUTH_URL}/login`, credentials);
      const { accessToken, isAdmin, username } = response.data;

      if (!accessToken) {
        throw new Error('No access token received from the backend');
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('isAdmin', isAdmin);
      localStorage.setItem('username', username);

      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${AUTH_URL}/register`, userData);
      const { token } = response.data;

      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const response = await axios.get(`${USERS_URL}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  async deletedUsers(){
    try{
      const response = await axios.get(`${USERS_URL}/inactive`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários inativos:', error);
      const errorMessage = error.response?.data?.message || "Erro ao buscar usuários inativos.";
      throw new Error(errorMessage);
    }
  },

  async getUserById(userId) {
    try {
      const response = await axios.get(`${USERS_URL}/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await axios.post(`${USERS_URL}`, userData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao criar usuário";
      throw new Error(errorMessage);
    }
  },

  async updateUser(id, updateUser) {
    try {
      const response = await axios.put(`${USERS_URL}/${id}`, updateUser, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao editar usuário";
      throw new Error(errorMessage);
    }
  },

};

export default UserService;