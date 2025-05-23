<template>
  <form @submit.prevent="submitForm" class="employee-form">

    <div class="image-preview-container">
      <!-- foto -->
      <img :src="previewImage || employee.photo || defaultProfilePicture" class="profile-picture" alt="Profile Picture"/>
      <input type="file" id="photo" accept="image/png, image/jpeg" @change="onFileChange" class="selector"/>
      <label for="photo" class="upload-button">
        Selecionar Foto
      </label>
    </div>

    <!-- Nome -->
    <div class="form-group">
      Nome:
      <input
          type="text"
          id="name"
          v-model="employee.name"
          placeholder="Nome completo"
          required
      />
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
          maxlength="14"
          required
          disabled
      />
    </div>

    <!-- Empresa -->
    <div class="form-group">
      Empresa:
      <select id="company_id" v-model="employee.company_id" ref="companySelect" :disabled="!employee.isActive" :required="employee.isActive">
        <option
            v-for="company in companies"
            :key="company.id"
            :value="parseInt(company.id)"
        >
          {{ company.name }}
        </option>
      </select>
    </div>

    <!-- Cargo -->
    <div class="form-group">
      Cargo:
      <select id="position_id" v-model="employee.position_id" ref="positionSelect" :disabled="!employee.isActive" :required="employee.isActive">
        <option
            v-for="position in positions"
            :key="position.id"
            :value="parseInt(position.id)"
        >
          {{ position.name }}
        </option>
      </select>
    </div>

    <!-- Linha para Data de Início e Remuneração -->
    <div class="form-row">
      <!-- Data de início -->
      <div class="form-group">
        Data de início:
        <input
            type="date"
            id="start_date"
            v-model="employee.start_date"
            required
        />
      </div>

      <!-- Remuneração -->
      <div class="form-group">
        Remuneração por hora:
        <input
              type="text"
            id="salary"
            v-model="employee.salary"
            v-money="moneyConfig"
            placeholder="R$"
            :disabled="!employee.isActive"
            :required="employee.isActive"
        />
      </div>
    </div>

    <!-- Status do Funcionário -->
    <div class="form-group">
      Status:
      <div class="radio-group">
        <label for="statusActive">
          <input type="radio" id="statusActive" :value="true" v-model="employee.isActive" name="employeeStatus" @change="handleStatusChange">
          Ativo
        </label>
        <label for="statusInactive">
          <input type="radio" id="statusInactive" :value="false" v-model="employee.isActive" name="employeeStatus" @change="handleStatusChange">
          Inativo
        </label>
      </div>
    </div>

    <!-- Botão de Atualizar -->
    <div class="buttons-container">
      <CreateButton class="update-button full-width-button">Atualizar</CreateButton>
    </div>

  </form>
</template>

<script>
import EmployeeService from '@/services/EmployeeService';
import CompanyService from '@/services/CompanyService';
import PositionService from '@/services/PositionService';
import CreateButton from '@/components/ui/CreateButton.vue';
import Swal from 'sweetalert2';
import { IMaskDirective } from 'vue-imask';
// import { validate as validateCpf } from 'gerador-validador-cpf';
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.css';
import { VMoney } from 'v-money';


export default {
  name: 'EmployeeEditForm',

  components: {
    CreateButton,
  },

  directives: {
    mask: IMaskDirective,
    money: VMoney, 
  },

  props: {
    employeeId: {
      type: String,
      required: true
    }
  },

  emits: ['employee-updated'],

  data() {
    return {
      employee: {
        id: null,
        name: '',
        cpf: '',
        company_id: null,
        position_id: null,
        salary: '0,00',
        photo: null,
        start_date: null,
        isActive: true, // Novo campo para status
      },
      errorMessage: '',
      companies: [],
      positions: [],
      previewImage: null,
      defaultProfilePicture:
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
      cpfMask: {
        mask: '000.000.000-00',
      },
      moneyConfig: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2,
        masked: false
      },
      selectedFile: null,
      photoChanged: false,
    };
  },

  async created() {
    try {
      // Carregar empresas e cargos
      this.companies = await CompanyService.getAllCompanies();
      this.positions = await PositionService.getAllPositions();

      // Carregar dados do funcionário
      await this.fetchEmployeeData();
    } catch (error) {
      console.error('Error fetching data:', error);
      this.errorMessage = 'Erro ao carregar dados.';

      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar dados',
        text: 'Não foi possível carregar os dados do funcionário.',
        showConfirmButton: true,
      });
    }
  },

  mounted() {
    $(this.$refs.companySelect).select2({
      placeholder: 'Selecione uma empresa',
    });

    $(this.$refs.positionSelect).select2({
      placeholder: 'Selecione um cargo',
    });

    $(this.$refs.companySelect).on('change', () => {
      this.employee.company_id = $(this.$refs.companySelect).val();
    });

    $(this.$refs.positionSelect).on('change', () => {
      this.employee.position_id = $(this.$refs.positionSelect).val();
    });
  },

  updated() {
    // Atualizar os valores do select2 quando os dados do funcionário forem carregados
    if (this.employee.company_id) {
      $(this.$refs.companySelect).val(this.employee.company_id).trigger('change');
    }

    if (this.employee.position_id) {
      $(this.$refs.positionSelect).val(this.employee.position_id).trigger('change');
    }
  },

  beforeUnmount(){
    $(this.$refs.companySelect).select2('destroy');
    $(this.$refs.positionSelect).select2('destroy');
  },

  methods: {
    async fetchEmployeeData() {
      try {
        const employeeData = await EmployeeService.getEmployeeById(this.employeeId);

        // Formatar os dados recebidos para o formato esperado pelo formulário
        this.employee = {
          id: employeeData.id,
          name: employeeData.name,
          cpf: employeeData.cpf,
          company_id: employeeData.company ? parseInt(employeeData.company.id) : null,
          position_id: employeeData.position ? parseInt(employeeData.position.id) : null,
          salary: employeeData.salary.toString(),
          photo: employeeData.photo,
          start_date: employeeData.startDate ? employeeData.startDate : null,
          isActive: employeeData.status, // Mapear 'status' da API para 'isActive'
        };

        // Atualizar os selects
        this.$nextTick(() => {
          if (this.employee.company_id) {
            $(this.$refs.companySelect).val(this.employee.company_id).trigger('change');
          }

          if (this.employee.position_id) {
            $(this.$refs.positionSelect).val(this.employee.position_id).trigger('change');
          }
        });

      } catch (error) {
        console.error('Error fetching employee data:', error);
        throw error;
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.photoChanged = true;

      if (file) {
        this.previewImage = URL.createObjectURL(file);
      } else {
        this.previewImage = null;
      }
    },

    handleStatusChange() {
      if (!this.employee.isActive) {
        this.employee.company_id = null;
        this.employee.position_id = null;
        this.employee.salary = '0'; // Salário zerado para inativos

        // Atualizar Select2 para refletir os valores nulos
        this.$nextTick(() => {
          $(this.$refs.companySelect).val(null).trigger('change');
          $(this.$refs.positionSelect).val(null).trigger('change');
        });
      }
      // Se se tornar ativo, os campos :required="employee.isActive" garantirão que o usuário precise preenchê-los.
    },

    submitForm() {
      try {
        let photoUrl = this.employee.photo;

        const numericValue = this.employee.salary.replace(/[^\d,]/g, '').replace(',', '.')

        // Preparar os dados para envio
        const prepareData = async () => {
          // Só faz upload da foto se uma nova foi selecionada
          if (this.photoChanged && this.selectedFile) {
            try {
              photoUrl = await EmployeeService.updateEmployeePhoto(this.employee.photo, this.selectedFile);
            } catch (error) {
              console.error('Error uploading photo:', error);
              throw error;
            }
          }

          const employeeToSubmit = {
            name: this.employee.name,
            cpf: this.employee.cpf,
            companyId: this.employee.company_id,
            positionId: this.employee.position_id,
            salary: parseFloat(numericValue),
            photo: photoUrl,
            startDate: this.employee.start_date,
            status: this.employee.isActive, // Enviar 'isActive' como 'status' para a API
          };

          return employeeToSubmit;
        };

        // Executar a atualização
        prepareData().then(employeeToSubmit => {
           if (!employeeToSubmit.status) {
            return EmployeeService.terminateEmployee(this.employee.id);
          }
          return EmployeeService.updateEmployee(this.employee.id, employeeToSubmit);
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Funcionário atualizado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.$emit('employee-updated');
          });
        }).catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar funcionário!',
            text: error.message || 'Ocorreu um erro ao tentar atualizar o funcionário.',
            showConfirmButton: false,
            timer: 3500,
          });
          console.error('Erro ao atualizar funcionário:', error);
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao processar formulário!',
          text: error.message || 'Ocorreu um erro ao processar o formulário.',
          showConfirmButton: false,
          timer: 3500,
        });
        console.error('Erro ao processar formulário:', error);
      }
    },
  },
};
</script>

<style scoped>

.employee-form {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-title {
  text-align: center;
  color: #1e293b;
}

.form-row {
  display: flex;
  gap: 20px; /* Espaçamento entre os campos na linha */
  width: 100%;
}

.form-row .form-group {
  flex: 1; /* Faz com que cada form-group dentro da linha ocupe espaço igual */
  /* margin-bottom é herdado de .form-group, o que é bom */
}

.form-group {
  width: 100%;
  margin-bottom: 8px;
}

label {
  display: block;
  color: #334155;
}

input[type='text'],
input[type='date'],
input[type='number'],
select {
  width: 100%;
  height: 30px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  color: rgb(68, 68, 68)
}

input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

/* Novo container para os botões */
.buttons-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

/* Estilo para o botão de atualizar */
:deep(.update-button) {
  /* flex: 1; // Removido para permitir que o botão ocupe a largura total se for o único */
  /* margin-right: 10px; // Removido */
}

.full-width-button {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  background-color: #6F08AF;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background-color 0.2s;
  height: 40px;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.image-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.upload-button {
  cursor: pointer;
  color: #6F08AF;
}

.selector {
  display: none;
}

input[type="date"]:invalid {
  color: rgb(153, 153, 153);
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 15px; 
  margin-top: 5px; 

}

.radio-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0;
  font-weight: normal;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

.form-group input {
  font-family: Nunito;
}
</style>
