<template>
    <form @submit.prevent="submitForm" class="position-form">
      <div class="form-group">
        Cargo
        <input type="text" id="name" v-model="position.name" required placeholder="ex: Desenvolvedor de Software"/>
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
  import PositionService from '@/services/PositionService.js';
  import CreateButton from '@/components/ui/CreateButton.vue';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'PositionForm',
    components: {
      CreateButton,
    },
    emits: ['position-created'],
  
    data() {
      return {
        position: {
          name: '',
        },
        errorMessage: '',
      };
    },
  
    methods: {
      async submitForm() {
        this.errorMessage = '';
  
        try {
          await PositionService.createPosition(this.position);
  
          Swal.fire({
            icon: 'success',
            title: 'Cargo criado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.$emit('position-created');
            this.position = {
              name: '',
            };
          });
        } catch (error) {
          this.errorMessage = 'Erro ao cadastrar cargo. Tente novamente.';
          console.error('Erro ao cadastrar cargo:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .position-form {
    max-width:700px;
    margin: 0 auto;
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
    padding: 25px;
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
  