<template>
      <form @submit.prevent="submitForm" class="user-form" v-if="user">
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
          <input type="password" id="password" v-model="user.password" maxlength="15" minlength="8" />
          <div class="obs"> Caso não queira alterar, apenas deixe em branco </div>
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
          <CreateButton type="button" @click="deactivateUser" class="deactivate-button">Desativar</CreateButton>
          <CreateButton> Editar </CreateButton>
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
  name: 'UserEditForm',
  components: {
    CreateButton, 
  },
  props: {
    userId: {
      type: [String, Number],
      required: true,
    },
  },
  
  emits: ['user-updated'],

  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        isAdmin: false,
      },
      errorMessage: '',
    };
  },

  async created() {
    try {
      // Carregar dados do funcionário
      await this.fetchUserData();
    } catch (error) {
      const $erro = console.error('Erro ao carregar dados:', error);

      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar dados',
        text: $erro,
        showConfirmButton: true,
      });
    }
  },

  methods: {

    async deactivateUser() {
      this.user.isActive = false;
      try {
        await UserService.updateUser(this.user.id, this.user);
        Swal.fire({
          icon: 'success',
          title: 'Usuário desativado',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao desativar usuário',
          text: error.message || 'Ocorreu um erro ao tentar desativar o usuário.',
          showConfirmButton: false,
          timer: 3500,
        });
        console.error('Erro ao desativar usuário:', error);
      }
    },

    async fetchUserData() {
      try {
        const userData = await UserService.getUserById(this.userId);

        this.user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          password: '',
          isAdmin: userData.isAdmin,
        };

      } catch (error) {
      const $erro = console.error('Erro ao carregar dados:', error);

         Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar dados',
        text: $erro,
        showConfirmButton: true,
      });
      }
    },

    async submitForm() {

      this.errorMessage = ''; 

      try {
        
        const userToSubmit = {
          // O ID é passado na URL, não no corpo para updateUser
          username: this.user.username,
          email: this.user.email,
          isAdmin: this.user.isAdmin,
        };

        if (this.user.password && this.user.password.trim() !== '') {
          userToSubmit.password = this.user.password;
        }

        if (!this.user.id) {
          this.showErrorAlert("ID do usuário não encontrado. Não é possível atualizar.");
          return;
        }

        await UserService.updateUser(this.user.id, userToSubmit);

        Swal.fire({
          icon: 'success',
          title: 'Usuário atualizado com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.user.password = ''; 
          this.$emit('user-updated');
        });          
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao editar cadastro do Usuário',
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
.obs{
  font-size: 15px;
  color: gray;
}

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
  gap: 10px;
}

.deactivate-button {
  background-color: #e2e8f0;
  color: black;
}

.deactivate-button:hover {
  background-color: #eee8e8;
  color: black;
}


</style>