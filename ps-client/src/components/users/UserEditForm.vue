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

        <div class="form-row">

          <!-- Tipo do Usuário -->
          <div class="form-group">
            Tipo do Usuário
            <select v-model="user.isAdmin" id="isAdmin" required>
              <option :value="true">Administrador</option>
              <option :value="false">Padrão</option>
            </select>
          </div>

          <!-- Status do Usuário -->
          <div class="form-group">
            Status:
            <div class="radio-group">
              <label for="statusActive">
                <input type="radio" id="statusActive" :value="true" v-model="user.isActive" name="userStatus">
                Ativo
              </label>
              <label for="statusInactive">
                <input type="radio" id="statusInactive" :value="false" v-model="user.isActive" name="userStatus">
                Inativo
              </label>
            </div>
          </div>
          
        </div>
        
        <div class="button-container">
          <CreateButton class="update-button"> Editar </CreateButton>
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
        isActive: true, // Valor padrão inicial
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

    async fetchUserData() {
      try {
        const userData = await UserService.getUserById(this.userId);

        this.user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          password: '',
          isAdmin: userData.isAdmin,
          // Assumindo que a API retorna 'isActive'. Se não, padrão para true.
          isActive: userData.isActive !== undefined ? userData.isActive : true,
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
          isActive: this.user.isActive, // Inclui o status de atividade
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

.form-row {
  display: flex;
  gap: 20px; /* Espaçamento entre os campos na linha */
  width: 100%; 
}

.form-row .form-group {
  flex: 1; /* Faz com que cada form-group dentro da linha ocupe espaço igual */
  padding-bottom: 15px; /* Reduz o padding inferior para economizar espaço vertical */
}

.radio-group-column { /* Estilo para radio buttons empilhados */
  display: flex;
  flex-direction: column;
  gap: 8px; /* Espaçamento entre os radio buttons empilhados */
}
.radio-group {
  display: flex;
  align-items: center;
  gap: 15px; /* Espaçamento entre os botões de rádio */
}

.radio-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
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
    justify-content: space-between; 
    width: 100%;
    justify-content: center; 
  }

:deep(.update-button) {
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

</style>