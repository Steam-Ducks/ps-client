<template>
  <form @submit.prevent="submitForm" class="company-form">
    <div class="form-group">
      Nome:
      <input type="text" id="name" v-model="company.name" required />
    </div>

    <div class="form-group">
      CNPJ:
      <input type="text" id="cnpj" v-model="company.cnpj" required />
    </div>

    <div class="form-group">
      Contato:
      <input type="text" id="contact" v-model="company.contact" required />
    </div>

    <div>
      <CreateButton> Cadastrar </CreateButton>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script>
import CompanyService from '@/services/CompanyService.js';
import CreateButton from '@/components/ui/CreateButton.vue';
import Swal from 'sweetalert2';

export default {
  name: 'CompanyForm',
  components: {
    CreateButton,
  },
  emits: ['company-created'],

  data() {
    return {
      company: {
        name: '',
        cnpj: '',
        contact: '',
      },
      errorMessage: '',
    };
  },

  methods: {
    async submitForm() {
      this.errorMessage = '';

      try {
        await CompanyService.createCompany(this.company);

        Swal.fire({
          icon: 'success',
          title: 'Empresa criada com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.$emit('company-created');
          this.company = {
            name: '',
            cnpj: '',
            contact: '',
          };
        });
      } catch (error) {
        this.errorMessage = 'Erro ao cadastrar empresa. Tente novamente.';
        console.error('Erro ao cadastrar empresa:', error);
      }
    },
  },
};
</script>

<style scoped>
.company-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-title {
  text-align: center;
  color: #1e293b;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%; /* Make form groups take full width */
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

.button-container {
  margin-top: 20px; /* Add some space above the button */
}
</style>
