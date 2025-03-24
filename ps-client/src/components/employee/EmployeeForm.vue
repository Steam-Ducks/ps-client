<template>
  <form @submit.prevent="submitForm" class="employee-form">
    <div class="form-group">
      Nome:
      <input type="text" id="name" v-model="employee.name" required />
    </div>

    <div class="form-group">
      CPF:
      <input type="text" id="cpf" required />
    </div>

    <div class="form-group">
      Empresa:
      <select id="company" v-model="employee.company" required>
        <option value="">Selecione uma empresa</option>
      </select>
    </div>

    <div class="form-group">
      Cargo:
      <select id="cargo" v-model="employee.cargo" required>
        <option value="">Selecione um cargo</option>
      </select>
    </div>

    <div class="form-group">
      Remuneração:
      <input type="number" id="remuneracao" required/>
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
import EmployeeService from '@/services/EmployeeService.js';
import CreateButton from '@/components/ui/CreateButton.vue';
import Swal from 'sweetalert2';
import { Mask } from 'vue-the-mask';

export default {
  name: 'EmployeeForm',

  components: {
    CreateButton,
  },

  directives: {
    Mask,
  },

  emits: ['employee-created'],

  data() {
    return {
      employee: {
        name: '',
        cpf: '',
        Empresa: '',
        cargo: '',
        remuneracao: '',
      },
      errorMessage: '',
    };
  },

  methods: {
    async submitForm() {
      this.errorMessage = '';

      try {
        await EmployeeService.createEmployee(this.employee);

        Swal.fire({
          icon: 'success',
          title: 'Funcionario criado com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.$emit('employee-created');
          this.employee = {
            name: '',
            cpf: '',
            Empresa: '',
            cargo: '',
            remuneracao: '',
          };
        });
      } catch (error) {
        this.errorMessage = 'Erro ao cadastrar funcionario. Tente novamente.';
        console.error('Erro ao cadastrar funcionario:', error);
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