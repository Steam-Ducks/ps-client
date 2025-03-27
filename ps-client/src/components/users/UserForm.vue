<template>
  <div class="user-form">
    <h2 class="form-title">Cadastrar Novo Usuário</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="username">Nome:</label>
        <input type="text" id="username" v-model="user.username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <div class="form-group">
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="user.password" required />
      </div>
      <FormButton type="primary" class="submit-button">Cadastrar</FormButton>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import UserService from '@/services/UserService';
import FormButton from '@/components/ui/FormButton.vue';

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
      },
      errorMessage: '',
    };
  },
  methods: {
    async submitForm() {
      this.errorMessage = ''; 
      try {
        await UserService.createUser(this.user);
        this.user = {
          username: '',
          email: '',
          password: '',
        };
        this.$emit('user-created');
      } catch (error) {
        this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
        console.error('Erro ao cadastrar usuário:', error);
      }
    },
  },
};
</script>

<style scoped>
.user-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #1e293b;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
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
</style>
