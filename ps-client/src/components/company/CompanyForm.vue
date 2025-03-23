<template>

  <div class="business-form">

    <h2 class="form-title">Cadastrar Nova Empresa</h2>

    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="CompanyName">Nome:</label>
        <input type="text" id="CompanyName" v-model="company.Name" required />
      </div>

      <div class="form-group">
        <label for="CNPJ">CNPJ:</label>
        <input type="text" id="CNPJ" v-model="company.CNPJ" required />
      </div>

      <div class="form-group">
        <label for="Telephone">Telefone:</label>
        <input type="text" id="Telephone" v-model="company.Telephone" required />
      </div>

      <FormButton type="primary" class="submit-button">Cadastrar</FormButton>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

    </form>
  </div>
</template>

<script>
import UserService from '@/services/UserService';
import FormButton from '@/components/ui/FormButton.vue';

export default {
  name: 'CompanyForm',
  components: {
    FormButton, 
  },
  emits: ['company-created'],
  
  data() {
    return {
      company: {
        Name: '',
        CNPJ: '',
        Telephone: '',
      },
      errorMessage: '',
    };
  },

  methods: {
    async submitForm() {
      this.errorMessage = ''; // Limpa a mensagem de erro
      
      try {
        await UserService.createCompany(this.company);

        // Limpa o formulário após o sucesso
        this.company = {
          Name: '',
          CNPJ: '',
          Telephone: '',
        };

        this.$emit('company-created');
      } catch (error) {
        this.errorMessage = 'Erro ao cadastrar empresa. Tente novamente.';
        console.error('Erro ao cadastrar empresa:', error);
      }
    },
  },
};
</script>

<style scoped>
.user-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #1e293b;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error-message {
  color: #dc2626;
  margin-top: 15px;
}
</style>
