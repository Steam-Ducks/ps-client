import axios from 'axios';
import UserService from './UserService';

const API_URL = 'http://localhost:8080/api/timerecords';

const formatToLocalDateTimeString = (dateInput) => {
  let date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return `${dateInput}T00:00:00`;
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
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const TimeRecordService = {

     async getTimeRecords(employeeId, startDate, endDate) {
        try {
          const url = `${API_URL}/employee/${employeeId}`;

          // Formata as datas antes de enviar
          const formattedStartDate = formatToLocalDateTimeString(startDate);
          const formattedEndDate = formatToLocalDateTimeString(endDate);

          // Verifica se a formatação foi bem-sucedida
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

}

export default TimeRecordService;