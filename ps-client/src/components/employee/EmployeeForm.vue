<template>

  <form @submit.prevent="submitForm" class="employee-form">

    <!-- foto -->
    <img src="https://blogdebrinquedo.com.br/wp-content/uploads/2024/02/20240208boneco-nendoroid-bob-minions-02.jpg" class="profiele-picture"/>

    <!-- Nome -->
    <div class="form-group">
      Nome:
      <input type="text" id="name" v-model="employee.name" placeholder="Nome completo" required />
    </div>

    <!-- CPF -->
    <div class="form-group">
      CPF:
      <input
        type="text"
        id="cpf"
        v-model="employee.cpf"
        v-mask="cpfMask"
        placeholder="123.456.789-00"
        required
      />
    </div>

    <!-- Empresa -->
    <div class="form-group">
      Empresa:
      <select id="company_id" v-model="employee.company_id" required>
        <option value="" disabled>Selecione uma empresa</option>
        <option v-for="company in companies" :key="company.id" :value="parseInt(company.id)">
          {{ company.name }}
        </option>
      </select>
    </div>

    <!-- Cargo -->
    <div class="form-group">
      Cargo:
      <select id="position_id" v-model="employee.position_id" required>
        <option value="" disabled>Selecione um cargo</option>
        <option v-for="position in positions" :key="position.id" :value="parseInt(position.id)">
          {{ position.name }}
        </option>
      </select>
    </div>

    <!-- Remuneração -->
    <div class="form-group">
      Remuneração:
      <input type="text" id="salary" v-model="employee.salary" v-mask="currencyMask" placeholder="R$" required />
    </div>

    <!-- Botão de Cadastrar  -->
    <div class="button-container">
      <CreateButton> Cadastrar </CreateButton>
    </div>

    <!-- Mensagem de erro -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

  </form>

</template>

<script>

  import EmployeeService from '@/services/EmployeeService.js';
  import CompanyService from '@/services/CompanyService.js';
  import PositionService from '@/services/PositionService.js';
  import CreateButton from '@/components/ui/CreateButton.vue';
  import Swal from 'sweetalert2';
  import { IMaskDirective } from 'vue-imask';

  export default {
    name: 'EmployeeForm',

    components: {
      CreateButton,
    },

    directives: {
      mask: IMaskDirective,
    },

    emits: ['employee-created'],

    data() {
      return {
        
        employee: {
          name: '',
          cpf: '',
          company_id: null,
          position_id: null,
          salary: '',
        },
        errorMessage: '',
        companies: [],
        positions: [],

        cpfMask: {
          mask: '000.000.000-00',
        },

        currencyMask: {
          mask: Number,
          scale: 2,
        },

      };
    },

    async created() {
      try {
        this.companies = await CompanyService.getAllCompanies();
        this.positions = await PositionService.getAllPositions();
      } 
      catch (error) {
        console.error('Error fetching companies or positions:', error);
        this.errorMessage = 'Erro ao carregar empresas ou cargos.';
      }

    },

    methods: {
      async submitForm() {
        this.errorMessage = '';
        if (!this.employee.company_id) {
          this.errorMessage = 'Por favor, selecione uma empresa.';
          return;
        }
        if (!this.employee.position_id) {
          this.errorMessage = 'Por favor, selecione um cargo.';
          return;
        }

        try {
          await EmployeeService.createEmployee({
            name: this.employee.name,
            cpf: this.employee.cpf,
            companyId: this.employee.company_id,
            positionId: this.employee.position_id,
            salary: parseFloat(this.employee.salary),
          });

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
              company_id: null,
              position_id: null,
              salary: '',
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

  .employee-form {
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
    width: 100%;
  }

  label {
    display: block;
    color: #334155;
  }

  input[type='text'],
  input[type='number'],
  select {
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
    text-align: center;
    width: 100%;
  }

  .profiele-picture{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>
