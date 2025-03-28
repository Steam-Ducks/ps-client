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
        minlength="11"
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
            length: 11,
          },
          {
            mask: '00.000.000/0000-00',
            length: 14,
          },
        ],
        dispatch: (appended, dynamicMasked) => {
          const number = (dynamicMasked.value + appended).replace(/\D/g, '');
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
          const number = (dynamicMasked.value + appended).replace(/\D/g, '');
          return number.length > 10 ? dynamicMasked.compiledMasks[1] : dynamicMasked.compiledMasks[0];
        },
      },
    };
  },
  watch: {
    'company.cnpj': function (novoValor) {
      if (novoValor) {
        this.company.cnpj = novoValor.replace(/\D/g, '');
      }
    }
  },
  methods: {
    async submitForm() {
      let errorMessage = '';

      var cnpjLimpo = this.company.cnpj.replace(/\D/g, '').trim()
      console.log(cnpjLimpo.length)
        if (cnpjLimpo.length != 11 && cnpjLimpo.length != 14) {
          errorMessage = 'CNPJ/CPF Inválidos';
          Swal.fire({
            icon: 'warning',
            title: 'Faltam informações',
            text: errorMessage,
            showConfirmButton: false,
            timer: 2500,
          });
          return;
        } 
      // Formatar os dados antes de enviar para o servidor
      let cnpjFormatado;
      if (cnpjLimpo.length === 11) {
        cnpjFormatado = cnpjLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else {
        cnpjFormatado = cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      const companyToSubmit = {
        ...this.company,
        cnpj: cnpjFormatado,
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
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastar Empresa',
          text: error.message,
          showConfirmButton: false,
          timer: 3500,
        })
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