import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

const API_URL = 'http://localhost:8080/api/positions'; // Aonde o bootstrap está disponibilizando os dados

const PositionService = {

    async createPosition(createPosition){
        try {
            const response = await axios.post(`${API_URL}`, createPosition);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao criar cargo: ' + error.message);
        }
    },

    async getAllPositions(){
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao listar cargos: ' + error.message);
        }
    }
}

export default PositionService;
