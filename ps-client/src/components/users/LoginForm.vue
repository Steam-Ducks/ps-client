<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <!-- Email -->
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="credentials.email" required />
    </div>

    <!-- Password -->
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="credentials.password" required />
    </div>

    <!-- Submit Button -->
    <div>
      <button type="submit">Login</button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  name: 'LogIn',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      try {
        const response = await UserService.login(this.credentials);
        console.log('Login successful:', response);

        const redirectTo = this.$route.query.redirect || '/home';
        console.log('Redirecting to:', redirectTo);
        this.$router.push(redirectTo);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro desconhecido, tente novamente.';
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #334155;
}

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #1d4ed8;
}

.error-message {
  color: #dc2626;
  margin-top: 10px;
}
</style>