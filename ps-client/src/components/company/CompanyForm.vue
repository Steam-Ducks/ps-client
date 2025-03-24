<template>
  <form @submit.prevent="submitForm" class="company-form">
    <div class="form-group">
      Nome:
      <input type="text" id="name" v-model="company.name" required />
    </div>

    <div class="form-group">
      CNPJ/CPF:
      <input
        type="text"
        id="cnpj"
        v-model="company.cnpj"
        :v-mask="cnpjMask"
        @input="validateCnpj"
        :maxlength="cnpjMaxLength"
        :minlength="cnpjMinLength"
        required
      />
    </div>

    <div class="form-group">
      Contato:
      <input
        type="text"
        id="contact"
        v-model="company.contact"
        :v-mask="phoneMask"
        @input="validateContact"
        :maxlength="phoneMaxLength"
        :minlength="phoneMinLength"
        required
      />
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
import { Mask } from 'vue-the-mask';

export default {
  name: 'CompanyForm',

  components: {
    CreateButton,
  },

  directives: {
    Mask,
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

  computed: {
    // Máscara para CNPJ/CPF
    cnpjMask() {
      return this.company.cnpj.replace(/\D/g, '').length <= 11
        ? '###.###.###-##' // CPF
        : '##.###.###/####-##'; // CNPJ
    },

    // Tamanho máximo e mínimo para CPF e CNPJ
    cnpjMaxLength() {
      return this.company.cnpj.replace(/\D/g, '').length <= 11 ? 14 : 18;
    },
    cnpjMinLength() {
      return this.company.cnpj.replace(/\D/g, '').length <= 11 ? 11 : 14; //CPF tem 11 digitos, CNPJ tem 14
    },

    // Máscara para telefone fixo/celular
    phoneMask() {
      return this.company.contact.replace(/\D/g, '').length > 10
        ? '(##) #####-####' // Celular
        : '(##) ####-####'; // Fixo
    },

    // Tamanho máximo e mínimo para telefone fixo e celular
    phoneMaxLength() {
      return this.company.contact.replace(/\D/g, '').length > 10 ? 15 : 14;
    },
    phoneMinLength() {
      return this.company.contact.replace(/\D/g, '').length > 10 ? 11 : 10; //Celular tem 11 digitos, fixo tem 10
    },
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

    // Validação simples de CNPJ/CPF
    validateCnpj() {
      // Remove todos os caracteres não numéricos
      this.company.cnpj = this.company.cnpj.replace(/\D/g, '');
    },
    validateContact() {
      // Remove todos os caracteres não numéricos
      this.company.contact = this.company.contact.replace(/\D/g, '');
    }
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
  width: 100%;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
}

input[type='text'],
input[type='number'] {
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
  margin-top: 20px;
}
</style>