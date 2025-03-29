import axios from 'axios'; // Biblioteca para fazer requisições HTTP.

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

  async getAllEmployees(){
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
      formData.append('file', file, uniqueFileName);
  
      const path = `https://iscjueykmwxxzoanzcoo.supabase.co/storage/v1/object/userfiles/photos/${uniqueFileName}`
      console.log(path)
      const response = await axios.post(`https://iscjueykmwxxzoanzcoo.supabase.co/storage/v1/object/userfiles/photos/${uniqueFileName}`, formData, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzY2p1ZXlrbXd4eHpvYW56Y29vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTcyNzMzMiwiZXhwIjoyMDU3MzAzMzMyfQ.QjlIc7Il28PgOkiBc8a_zES9ZNysrxN9W7fSYmDoZ8s', // Your Supabase JWT token
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Image uploaded successfully to Supabase!');
      return response.data;
    } catch (error) {
      console.log(uniqueFileName)
      console.error('Error uploading image to Supabase:', error);
      const errorMessage = error.response?.data?.message || 'Unknown error uploading image to Supabase.';
      throw new Error(errorMessage);
    }
  },

};

export default EmployeeService;
