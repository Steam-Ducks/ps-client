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
      <select id="company_id" v-model="employee.company_id" ref="companySelect" required>
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
      <select id="position_id" v-model="employee.position_id" ref="positionSelect" required>
        <option
            v-for="position in positions"
            :key="position.id"
            :value="parseInt(position.id)"
        >
          {{ position.name }}
        </option>
      </select>
    </div>

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
      Remuneração por hora trabalhada:
      <input
          type="text"
          id="salary"
          v-model="employee.salary"
          v-mask="currencyMask"
          placeholder="R$"
          required
      />
    </div>

    <!-- Botões de Atualizar e Desativar -->
    <div class="buttons-container">
      <button type="button" @click="deactivateEmployee" class="deactivate-button">Desativar</button>
      <CreateButton class="update-button">Atualizar</CreateButton>
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
// Removendo a importação não utilizada
// import { validate as validateCpf } from 'gerador-validador-cpf';
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.css';


export default {
  name: 'EmployeeEditForm',

  components: {
    CreateButton,
  },

  directives: {
    mask: IMaskDirective,
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
        salary: '',
        photo: null,
        start_date: null,
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
      currencyMask: {
        mask: Number,
        scale: 2,
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
          company_id: parseInt(employeeData.companyId),
          position_id: parseInt(employeeData.positionId),
          salary: employeeData.salary.toString(),
          photo: employeeData.photo,
          start_date: employeeData.startDate,
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

    deactivateEmployee() {
      // Confirmar com o usuário antes de desativar
      Swal.fire({
        title: 'Desativar funcionário?',
        text: 'Isso removerá a associação deste funcionário com a empresa atual. Deseja continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6F08AF',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, desativar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Preparar os dados para envio com company_id como null
          const employeeToSubmit = {
            id: this.employee.id,
            name: this.employee.name,
            cpf: this.employee.cpf,
            companyId: null, // Definindo a empresa como null
            positionId: this.employee.position_id,
            salary: parseFloat(this.employee.salary),
            photo: this.employee.photo,
            startDate: this.employee.start_date,
          };

          // Executar a atualização
          EmployeeService.updateEmployee(employeeToSubmit)
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Funcionário desativado com sucesso!',
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  this.$emit('employee-updated');
                });
              })
              .catch(error => {
                Swal.fire({
                  icon: 'error',
                  title: 'Erro ao desativar funcionário!',
                  text: error.message || 'Ocorreu um erro ao tentar desativar o funcionário.',
                  showConfirmButton: false,
                  timer: 3500,
                });
                console.error('Erro ao desativar funcionário:', error);
              });
        }
      });
    },

    submitForm() {
      try {
        let photoUrl = this.employee.photo;

        // Preparar os dados para envio
        const prepareData = async () => {
          // Só faz upload da foto se uma nova foi selecionada
          if (this.photoChanged && this.selectedFile) {
            try {
              photoUrl = await EmployeeService.uploadEmployeePhoto(this.selectedFile);
            } catch (error) {
              console.error('Error uploading photo:', error);
              throw error;
            }
          }

          const employeeToSubmit = {
            id: this.employee.id,
            name: this.employee.name,
            cpf: this.employee.cpf,
            companyId: this.employee.company_id,
            positionId: this.employee.position_id,
            salary: parseFloat(this.employee.salary),
            photo: photoUrl,
            startDate: this.employee.start_date,
          };

          return employeeToSubmit;
        };

        // Executar a atualização
        prepareData().then(employeeToSubmit => {
          return EmployeeService.updateEmployee(employeeToSubmit);
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

/* Estilo para o botão de desativar */
.deactivate-button {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  background-color: #e2e8f0;
  color: #1f2937;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background-color 0.2s;
  height: 40px;
}

.deactivate-button:hover {
  background-color: #cbd5e1;
}

/* Estilo para o botão de atualizar */
:deep(.update-button) {
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

</style>
