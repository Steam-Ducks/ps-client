import axios from "axios";
import UserService from "./UserService";

const API_URL = 'http://localhost:8080/api/dashboard';

const DashboardService = {
    async getDashboard(startDate, endDate) {
        try {
            const response = await axios.get(`${API_URL}`, {
                headers: UserService.getAuthHeaders(),
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar dashboard: ' + error.message);
        }
    }
};

export default DashboardService;