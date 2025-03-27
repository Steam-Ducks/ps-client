import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

const UPLOAD_IMAGE_URL = 'http://localhost:8080/api/upload-image'; // URL para upload de imagem
const API_URL = 'http://localhost:8080/api/employees'; // Aonde o bootstrap está disponibilizando os dados

const EmployeeService = { // Aonde colocamos as funções para as requisições
  
  async createEmployee(createEmployee){
    try {
      const response = await axios.post(`${API_URL}`, createEmployee);
      return response.data; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar funcionário"
      throw new Error(errorMessage);
    }
  },

  async getAllEmployees(){ // Changed the method name to 'getAllEmployees'
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao listar empresas: ' + error.message);
    }
  },

  async getEmployeeById(employeeId){
    try {
      const response = await axios.get(`${API_URL}/${employeeId}`);
      return response.data; 
    } catch (error) {
      throw new Error('Erro ao achar empresa: ' + error.message);
    }
  },

  async uploadEmployeePhotoToSupabase(file, uniqueFileName) {
    try {
      const formData = new FormData();
      formData.append('photo', file, uniqueFileName);

      const response = await axios.post(UPLOAD_IMAGE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Imagem enviada com sucesso para o backend e Supabase!');
      return response.data; // Retorna a resposta do backend (pode ser o caminho da imagem no Supabase)
    } catch (error) {
      console.error('Erro ao enviar imagem para o backend e Supabase:', error);
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao enviar imagem para o backend e Supabase.";
      throw new Error(errorMessage);
    }
  },

};

export default EmployeeService;
