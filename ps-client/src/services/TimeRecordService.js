import axios from 'axios';
import UserService from './UserService';

const API_URL = 'http://localhost:8080/api/timerecords';

const TimeRecordService = {

     async getTimeRecords(employeeId, startDate, endDate) {
        try {
          const url = `${API_URL}/employee/${employeeId}`;

          const params = {
            startDate: startDate, 
            endDate: endDate,     
          };
          
          const response = await axios.get(url, {
            params: params,
            headers: UserService.getAuthHeaders(),
          });

          return response.data;
        }

        catch (error) {
            console.error('Erro ao buscar pontos:', error);
            throw error;
          }
    },

}

export default TimeRecordService;