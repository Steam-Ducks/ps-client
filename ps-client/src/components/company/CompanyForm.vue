<template>
  <form @submit.prevent="submitForm" class="company-form">
    <!-- Nome -->
    <div class="form-group">
      Nome:
      <input type="text" id="name" v-model="company.name" required />
    </div>

    <!-- CNPJ/CPF -->
    <div class="form-group">
      CNPJ/CPF:
      <input
        type="text"
        id="cnpj"
        v-model="company.cnpj"
        v-mask="cnpjMask"
        placeholder="00.000.000/0000-00"
        required
      />
    </div>

    <!-- Contato -->
    <div class="form-group">
      Contato:
      <input
        type="text"
        id="contact"
        v-model="company.contact"
        v-mask="phoneMask"
        placeholder="Telefone"
        required
      />
    </div>

    <!-- Botão de Cadastro -->
    <div>
      <CreateButton> Cadastrar </CreateButton>
    </div>

    <!-- Mensagem de erro -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script>
import CompanyService from '@/services/CompanyService.js';
import CreateButton from '@/components/ui/CreateButton.vue';
import Swal from 'sweetalert2';
import { IMaskDirective } from 'vue-imask';

export default {
  name: 'CompanyForm',

  components: {
    CreateButton,
  },

  directives: {
    mask: IMaskDirective,
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
      cnpjMask: {
        mask: [
          {
            mask: '000.000.000-00',
            maxLength: 11,
          },
          {
            mask: '00.000.000/0000-00',
            maxLength: 14,
          },
        ],
        dispatch: (appended, dynamicMasked) => {
          const number = dynamicMasked.value ;
          return number.length > 11 ? dynamicMasked.compiledMasks[1] : dynamicMasked.compiledMasks[0];
        },
      },
      phoneMask: {
        mask: [
          {
            mask: '(00) 0000-0000',
            maxLength: 10,
          },
          {
            mask: '(00) 00000-0000',
            maxLength: 11,
          },
        ],
        dispatch: (appended, dynamicMasked) => {
          const number = dynamicMasked.value
          return number.length > 10 ? dynamicMasked.compiledMasks[1] : dynamicMasked.compiledMasks[0];
        },
      },
    };
  },

  methods: {
    async submitForm() {
      this.errorMessage = '';

      // Limpar os dados antes de enviar para o servidor
      const companyToSubmit = {
        ...this.company,
        cnpj: this.company.cnpj,
        contact: this.company.contact,
      };

      try {
        await CompanyService.createCompany(companyToSubmit);

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
    this.errorMessage = error.message;
    console.error("Erro:", error.message);
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