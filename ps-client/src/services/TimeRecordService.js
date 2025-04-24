import axios from 'axios';

const TimeRecordService = {

     async getTimeRecords() {
        try {
          const response = await axios.get(`https://run.mocky.io/v3/735ce962-3331-42fe-aa91-17a3449256b8`);
          return response.data;
        }

        catch (error) {
            console.error('Erro ao buscar pontos:', error);
            throw error;
          }
    },

}

export default TimeRecordService;