<template>
  <form @submit.prevent="submitForm" class="employee-form">
    <div class="form-group">
      Nome:
      <input type="text" id="name" v-model="employee.name" placeholder="Nome completo" required />
    </div>

    <div class="form-group">
      CPF:
      <input type="text" id="cpf" v-mask="'###.###.###-##'" v-model="employee.cpf" placeholder="123.456.789-00" required />
    </div>

    <div class="form-group">
      Empresa:
      <select id="company_id" v-model="employee.company_id" required>
        <option value="" disabled>Selecione uma empresa</option>
        <option v-for="company in companies" :key="company.id" :value="parseInt(company.id)">
          {{ company.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      Cargo:
      <select id="position_id" v-model="employee.position_id" required>
        <option value="" disabled>Selecione um cargo</option>
        <option v-for="position in positions" :key="position.id" :value="parseInt(position.id)">
          {{ position.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      Remuneração:
      <input type="number" id="salary" v-model="employee.salary" placeholder="R$" required/>
    </div>

    <div class="button-container">
      <CreateButton> Cadastrar </CreateButton>
    </div>

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
        company_id: Number(null), 
        position_id: Number(null), 
        salary: '',
      },
      errorMessage: '',
      companies: [],
      positions: [],
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
                    companyId: this.employee.company_id, // Changed to company_id
                    positionId: this.employee.position_id, // Changed to position_id
                    salary: this.employee.salary
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
                        company_id: Number(null), // Changed to Number
                        position_id: Number(null), // Changed to Number
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

</style>
