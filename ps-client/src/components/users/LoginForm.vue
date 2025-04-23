<template>
  <div class="login-page">
    <div class="left-side">
      <img src="@/assets/image-login.png" alt="Login Image" class="left-image" />
    </div>

    <div class="right-side">
      <div class="form-container">
        <img src="@/assets/PontualLogo.png" alt="Pontual Logo" class="pontual-logo" />
        <h2 class="login-title">Login</h2>
        <div class="separator"></div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="form-group">
            <input type="email" id="email" v-model="credentials.email" required placeholder="email@altave.com.br" />
          </div>

          <!-- Password -->
          <div class="form-group">
            <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="credentials.password"
                required
                placeholder="********"
                maxlength="15"
                minlength="8"
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <EyeIcon v-if="!showPassword" class="icon" />
              <EyeSlashIcon v-else class="icon" />
            </span>
          </div>

          <!-- Submit Button -->
          <div>
            <CreateButton type="submit">Login</CreateButton>
          </div>


          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <p class="message">Problemas com acesso? Contate seu administrador.</p>

        </form>
      </div>

      <img src="@/assets/SteamDucksLogo.png" alt="Steam Ducks Logo" class="steam-ducks-logo" />
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';
import CreateButton from "@/components/ui/CreateButton.vue";
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'LogIn',
  components: { CreateButton, EyeIcon, EyeSlashIcon },

  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      errorMessage: '',
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
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
.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.left-side {
  width: 55%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.left-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.right-side {
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #FFFDFD;
}

@media (max-width: 1024px) {
  .left-side {
    width: 35%;
  }

  .right-side {
    width: 65%;
  }
}

@media (max-width: 768px) {
  .left-side {
    display: none;
  }

  .right-side {
    width: 100%;
  }
}
.form-container {
  width: 85%;
  max-width: 500px;
  min-width: 250px;
  text-align: center;
  border: 1px solid #6F08AF;
  border-radius: 30px;
  padding: 30px 20px;
  background-color: #ffffff;
}

.pontual-logo {
  width: 230px;
  margin: 30px auto 0;
}

.login-title {
  font-size: 1.4rem;
  font-weight: 300;
  color: #6F08AF;
  position: relative;
}

.login-title::after {
  content: '';
  display: block;
  width: 15%;
  height: 3px;
  background-color: #6F08AF;
  margin: 5px auto 20px;
}

.separator {
  width: 100%;
  height: 1px;
  background-color: #E0E0E0;
  margin: 45px auto;
}

.steam-ducks-logo {
  width: 130px;
  margin: 20px auto 0;
}

.login-form {
  margin-top: 20px;
}

.form-group {
  position: relative;
  margin-bottom: 15px;
}

input[type='email'],
input[type='password'],
input[type='text'] {
  width: 90%;
  padding: 10px;
  padding-right: 40px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  box-sizing: border-box;
}

.toggle-password {
  position: absolute;
  top: 55%;
  right: 25px;
  transform: translateY(-50%);
  cursor: pointer;
}

.icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

button {
  width: 90%;
  font-size: 1rem;
  margin-bottom: 75px;
}

.error-message {
  color: #dc2626;
  margin-top: 10px;
  min-height: 20px;
}

.message {
  font-size: 0.9rem;
  color: #000000;
  margin-bottom: 50px;
}
</style>