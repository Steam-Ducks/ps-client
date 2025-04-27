import axios from 'axios';
import UserService from './UserService';

const API_URL = 'http://localhost:8080/api/timerecords';

const formatToLocalDateTimeString = (dateInput) => {
  let date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return `${dateInput}`;
    }
    date = new Date(dateInput);
  } else {
    console.warn("Tipo de data inválido recebido:", dateInput);
    return null;
  }

  if (!date || isNaN(date.getTime())) {
    console.warn("Não foi possível parsear a data:", dateInput);
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const startHour = 'T00:00:00';
const endHour = 'T23:59:59';

const TimeRecordService = {

     async getTimeRecords(employeeId, startDate, endDate) {
        try {
          const url = `${API_URL}/employee/${employeeId}`;

          // Formata as datas antes de enviar
          const formattedStartDate = formatToLocalDateTimeString(startDate) + startHour;
          const formattedEndDate = formatToLocalDateTimeString(endDate) + endHour;

          if (!formattedStartDate || !formattedEndDate) {
            throw new Error("Formato de data inválido fornecido.");
          }

          const params = {
            startDate: formattedStartDate, 
            endDate: formattedEndDate,     
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

    async updateTimeRecord(id, data){

      try{

        const url = `${API_URL}/${id}`;

        const response = await axios.put(url, data, {
                  headers: UserService.getAuthHeaders(),
          });

        return response;

      } catch (error) {
        console.error(`Erro ao atualizar o ponto com ID ${id}:`, error);
        throw error;    
      }
    },

    async createTimeRecord(recordData){

      try {
        const payload = {
          employeeId: recordData.employeeId,
          dateTime: recordData.dateTime
        };

        const response = await axios.post(API_URL, payload, {
          headers: UserService.getAuthHeaders(),
        });

        return response.data;

      } catch (error) {
        console.error('Erro ao criar registro de ponto:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido ao criar o registro de ponto.';
        throw new Error(errorMessage);
      }
    }

}

export default TimeRecordService;