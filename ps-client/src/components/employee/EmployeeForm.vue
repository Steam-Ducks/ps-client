<template>
  <form @submit.prevent="submitForm" class="employee-form">

    <div class="image-preview-container">
        <!-- foto --> 
        <img :src="previewImage || defaultProfilePicture" class="profile-picture" alt="Profile Picture"/>
        <input type="file" id="photo" accept="image/*" @change="onFileChange" class="selector"/>
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
        required
      />
    </div>

    <!-- Empresa -->
    <div class="form-group">
      Empresa:
      <select id="company_id" v-model="employee.company_id" required>
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
      <select id="position_id" v-model="employee.position_id" required>
        <option
          v-for="position in positions"
          :key="position.id"
          :value="parseInt(position.id)"
        >
          {{ position.name }}
        </option>
      </select>
    </div>

    <!-- Remuneração -->
    <div class="form-group">
      Remuneração:
      <input
        type="text"
        id="salary"
        v-model="employee.salary"
        v-mask="currencyMask"
        placeholder="R$"
        required
      />
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
          photo: null,
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
      };
    },

    async created() {
      try {
        this.companies = await CompanyService.getAllCompanies();
        this.positions = await PositionService.getAllPositions();
      } catch (error) {
        console.error('Error fetching companies or positions:', error);
        this.errorMessage = 'Erro ao carregar empresas ou cargos.';
      }
    },

    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        this.selectedFile = file;

        if (file) {
          this.previewImage = URL.createObjectURL(file);
        } else {
          this.previewImage = null;
        }
      },

      moveImageToAssets(file, uniqueFileName) {
        console.log(`Simulando mover ${file.name} para assets/img/employees/${uniqueFileName}`);
      },

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
        if (!this.selectedFile) {
          this.errorMessage = 'Por favor, selecione uma imagem.';
          return;
        }

        try {
          const timestamp = new Date().getTime();
          const random = Math.floor(Math.random() * 1000);
          const fileExtension = this.selectedFile.name.split('.').pop();
          const uniqueFileName = `employee_${timestamp}_${random}.${fileExtension}`;

          this.employee.photo = `img/employees/${uniqueFileName}`;

          this.moveImageToAssets(this.selectedFile, uniqueFileName);

          // Cria o objeto para enviar como JSON
          const employeeToSubmit = {
            name: this.employee.name,
            cpf: this.employee.cpf,
            companyId: this.employee.company_id,
            positionId: this.employee.position_id,
            salary: parseFloat(this.employee.salary),
            photo: this.employee.photo,
          };

          // Envia os dados do funcionário
          await EmployeeService.createEmployee(employeeToSubmit);

          // Envia a imagem separadamente
          await EmployeeService.uploadEmployeePhotoToSupabase(this.selectedFile, uniqueFileName);

          Swal.fire({
            icon: 'success',
            title: 'Funcionario criado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          })
          .then(() => {
            this.$emit('employee-created');
            this.employee = {
              name: '',
              cpf: '',
              company_id: null,
              position_id: null,
              salary: '',
              photo: null,
            };
            this.previewImage = null;
            this.selectedFile = null;
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
  input[type='number'],
  select {
    width: 100%;
    height: 30px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .error-message {
    color: #dc2626;
  }

  .button-container {
    text-align: center;
    width: 100%;
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

  .selector{
    display: none;
  }
</style>
