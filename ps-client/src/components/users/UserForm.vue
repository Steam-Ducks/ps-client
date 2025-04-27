<template>
    <form @submit.prevent="submitForm" class="user-form">
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
          <input type="password" id="password" v-model="user.password" maxlength="15" minlength="8" required />
        </div>

        <!--tipo usuario-->
        <div class="form-group">
          Tipo do Usuário
          <select v-model="user.isAdmin" id="isAdmin" required>
            <option :value="true">Administrador</option>
            <option :value="false">Padrão</option>
          </select>
        </div>

        <div class="button-container">
        <CreateButton> Cadastrar </CreateButton>
        </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

    </div>
  </form>
</template>

<script>
import UserService from '@/services/UserService';
import CreateButton from '@/components/ui/CreateButton.vue';
import Swal from 'sweetalert2';

export default {
  name: 'UserForm',
  components: {
    CreateButton, 
  },
  
  emits: ['user-created'],

  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        isAdmin: null,
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
          isAdmin: null,
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
.user-form {
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
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>