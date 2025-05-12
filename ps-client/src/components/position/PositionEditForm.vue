<template>
    <form @submit.prevent="submitForm" class="position-form">
      <div class="form-group">
        Cargo
        <input type="text" id="name" v-model="formPosition.name" required placeholder="ex: Desenvolvedor de Software"/>
      </div>
  
      <div>
        <CreateButton> Editar </CreateButton>
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
    name: 'PositionEditForm',
    components: {
      CreateButton,
    },
    emits: ['position-edited'],
    props: {
      position: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        formPosition: { ...this.position },
        errorMessage: '',
      };
    },
  
    watch: {
      // Caso a prop position mude, vamos garantir que a cópia seja atualizada.
      position(newPosition) {
        this.formPosition = { ...newPosition };  // Atualiza a cópia sempre que a prop mudar
      },
    },
  
    methods: {
      async submitForm() {
        this.errorMessage = '';
  
        try {
          await PositionService.updatePosition(this.formPosition.id, this.formPosition);
  
          Swal.fire({
            icon: 'success',
            title: 'Cargo editado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.$emit('position-edited', this.formPosition);  // Emite evento para o componente pai.
            this.formPosition = { name: '' };  // Limpa o formulário após salvar.
          });
        } catch (error) {
          this.errorMessage = 'Erro ao editar cargo. Tente novamente.';
          console.error('Erro ao editar cargo:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .position-form {
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .form-group {
    padding: 10px 0 25px;
    margin-bottom: 0px;
    width: 100%;
    font-size: 18px;
    font-weight: 300;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #334155;
  }
  
  input[type='text'] {
    margin-top: 6px;
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
  