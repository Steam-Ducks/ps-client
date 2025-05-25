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
    },

    async exportReport({
                           reportType,
                           fileFormat = 'pdf',
                           companyId = null,
                           companyName = '',
                           employeeId = null,
                           employeeName = '',
                           startDate = '',
                           endDate = '',
                       }) {
        const reportRequestDto = {
            reportType,
            fileFormat,
            companyId,
            companyName,
            employeeId,
            employeeName,
            startDate,
            endDate,
        };
        try {
            const response = await axios.post(`${API_URL}/export`, reportRequestDto, {
                headers: {
                    ...UserService.getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'report.xlsx';

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');


            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } catch (error) {
            console.error('Erro ao exportar relatório:', error.message);
            throw new Error('Erro ao exportar relatório: ' + error.message);
        }
    }
};

export default DashboardService;