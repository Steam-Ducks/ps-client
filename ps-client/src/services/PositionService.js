import axios from 'axios';

const API_URL = 'http://localhost:8080/api/positions'; 

const PositionService = {
    async getAllPositions(){
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data; 
      } catch (error) {
        throw new Error('Erro ao listar empresas: ' + error.message);
      }
    },
};

export default PositionService;
