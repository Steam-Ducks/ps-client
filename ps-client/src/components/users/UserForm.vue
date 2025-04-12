<template>
    <form @submit.prevent="submitForm">
      <div class="form-group">

        <!-- nome -->
        <div class="form-group">
          Nome:
          <input type="text" id="username" v-model="user.username" required />
        </div>

        <!-- email -->
        <div class="form-group">
          Email:
          <input type="email" id="email" v-model="user.email" required />
        </div>

        <!-- senha -->
        <div class="form-group">
          Senha:
          <input type="password" id="password" v-model="user.password" required />
        </div>

        <!--tipo usuario-->
        <div class="form-group">
          Tipo do Usuário
          <select v-model="user.is_admin" id="is_admin" required>
            <option :value="true">Administrador</option>
            <option :value="false">Padrão</option>
          </select>
        </div>

      <FormButton type="primary" class="submit-button">Cadastrar</FormButton>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

    </div>
  </form>
</template>

<script>
import UserService from '@/services/UserService';
import FormButton from '@/components/ui/FormButton.vue';
import Swal from 'sweetalert2';

export default {
  name: 'UserForm',
  components: {
    FormButton, 
  },
  
  emits: ['user-created'],

  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        is_admin: null,
      },
      errorMessage: '',
    };
  },

  methods: {
    async submitForm() {

      this.errorMessage = ''; 

      try {
        await UserService.createUser(this.user);

        Swal.fire({
          icon: 'success',
          title: 'Usuário cadastrada com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
        this.user = {
          username: '',
          email: '',
          password: '',
          is_admin: null,
        };
      });

        this.$emit('user-created');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastar Empresa',
          text: error.message,
          showConfirmButton: false,
          timer: 3500,
        });
      }
    },
    showErrorAlert(errorMessage) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltam informações',
        text: errorMessage,
        showConfirmButton: false,
        timer: 2500,
      });
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

  select, 
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
    margin-top: 20px;
  }
</style>