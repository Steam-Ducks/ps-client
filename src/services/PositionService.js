import axios from 'axios'; // Biblioteca para fazer requisições HTTP.
import UserService from './UserService';

const API_URL = 'http://localhost:8080/api/positions';

const PositionService = {

    async createPosition(createPosition) {
        try {
            const response = await axios.post(`${API_URL}`, createPosition, {
                headers: UserService.getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar cargo.";
            throw new Error(errorMessage);
        }
    },

    async getAllPositions() {
        try {
            const response = await axios.get(`${API_URL}`, {
                headers: UserService.getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao listar cargos.";
            throw new Error(errorMessage);
        }
    }
};

export default PositionService;