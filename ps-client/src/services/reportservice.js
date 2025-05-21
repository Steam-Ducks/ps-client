import axios from 'axios';

class ReportService {
    /**
     * Exporta um relatório com base nos parâmetros fornecidos
     *
     * @param {Object} params - Parâmetros para exportação do relatório
     * @param {string} params.reportType - Tipo de relatório (employee-list, all-companies, time-record, company-hours)
     * @param {number|null} params.companyId - ID da empresa (opcional, dependendo do tipo de relatório)
     * @param {number|null} params.employeeId - ID do funcionário (opcional, dependendo do tipo de relatório)
     * @param {string|null} params.startDate - Data inicial (formato DD/MM/YYYY, opcional)
     * @param {string|null} params.endDate - Data final (formato DD/MM/YYYY, opcional)
     * @returns {Promise} - Promise com o resultado da exportação
     */
    static async exportReport(params) {
        try {
            const response = await axios.post('/api/reports/export', params, {
                responseType: 'blob', // Importante para receber arquivos binários
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response;
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            throw error;
        }
    }

    /**
     * Obtém a lista de empresas disponíveis
     *
     * @returns {Promise} - Promise com a lista de empresas
     */
    static async getCompanies() {
        try {
            const response = await axios.get('/api/companies', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response;
        } catch (error) {
            console.error('Erro ao obter empresas:', error);
            throw error;
        }
    }

    /**
     * Obtém a lista de funcionários de uma empresa
     *
     * @param {number} companyId - ID da empresa
     * @returns {Promise} - Promise com a lista de funcionários
     */
    static async getEmployeesByCompany(companyId) {
        try {
            const response = await axios.get(`/api/companies/${companyId}/employees`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response;
        } catch (error) {
            console.error('Erro ao obter funcionários:', error);
            throw error;
        }
    }
}

export default ReportService;