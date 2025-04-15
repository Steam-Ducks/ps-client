import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = `${API_URL}/auth`;
const USERS_URL = `${API_URL}/users`;

const UserService = {
  // Helper to get the token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Helper to set the Authorization header
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Login method
  async login(credentials) {
    try {
      const response = await axios.post(`${AUTH_URL}/login`, credentials);
      const { token } = response.data;

      // Save the token to localStorage
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    }
  },

  // Register method
  async register(userData) {
    try {
      const response = await axios.post(`${AUTH_URL}/register`, userData);
      const { token } = response.data;

      // Save the token to localStorage
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  // Get all users (authenticated)
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

  // Get user by ID (authenticated)
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

  // Create user (authenticated)
  async createUser(userData) {
    try {
      const response = await axios.post(`${USERS_URL}`, userData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
};

export default UserService;