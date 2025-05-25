<template>
  <div class="head">

    <div class="Title">
      <h1> Usuários </h1>
      <p> Veja abaixo os usuários já cadastradas. Para adicionar um novo usuário, clique no botão + Novo Usuário. </p>
    </div>
    

    <div class="buttons">
      <ReportButton>
        <DocumentArrowDownIcon/>
      </ReportButton> 

      <button @click="toggleUserView" class="deactivate-button" :disabled="errorFetchingInactive && !showActiveUsers">
        {{ toggleButtonText }}
      </button>

      <CreateButton @click="showCreateUser">
        + Novo Usuário
      </CreateButton>
    </div>
  </div>
  <!--<div class="loading-overlay" v-if="isLoading">
    <img class="loading" src="../../assets/loading-icon.gif" alt="loading icon">
  </div>

  <div v-else>-->
    <div v-if="isCeatingUser" class="modal">
      <div class="modal-content">
        <UserCreate @go-back="hideCreateUser" @User-created="fetchUser"/>
      </div>
    </div>
  <!--</div>-->

  <div v-if="isEditingUser" class="modal">
    <div class="modal-content">
      <UserEdit :id="String(selectedUserId)" @go-back="hideEditUser" @user-updated="fetchUser"/>
    </div>
  </div>

  <UserList :users="displayedUsers" @edit-user="showEditUser"/>
    
  
</template>

<script>
import CreateButton from '@/components/ui/CreateButton.vue';
import UserCreate from './UserCreate.vue';
import UserList from '@/components/users/UserList.vue';
import UserService from '@/services/UserService';
import UserEdit from './UserEdit.vue';

export default {
  name: 'UserIndex',
  components: {
    CreateButton,
    UserCreate,
    UserList,
    UserEdit,
  },
  data() {
    return {
      isLoading: true,
      isCeatingUser: false,
      activeUsers: [],
      inactiveUsers: [],
      showActiveUsers: true, 
      isEditingUser: false,
      selectedUserId: null,
      errorFetchingInactive: false, 
    };
  },
  mounted() {
    this.fetchUser(); 
  },
  computed: {
    displayedUsers() {
      if (this.showActiveUsers) {
        return this.activeUsers;
      }
      return this.inactiveUsers;
    },
    toggleButtonText() {
      if (this.errorFetchingInactive && !this.showActiveUsers) {
        return 'Falha ao carregar inativos';
      }
      return this.showActiveUsers ? 'Mostrar Usuários Inativos' : 'Mostrar Usuários Ativos';
    }
  },
  methods: {
    loaded() {
      this.isLoading = false;
    },
    showCreateUser() {
      this.isCeatingUser = true;
    },
    hideCreateUser() {
      this.isCeatingUser = false;
    },
    showEditUser(userId) {
      this.selectedUserId = userId;
      this.isEditingUser = true;
    },
    hideEditUser() {
      this.isEditingUser = false;
      this.selectedUserId = null;
    },
    toggleUserView() {
      this.showActiveUsers = !this.showActiveUsers;
      if (!this.showActiveUsers && (this.inactiveUsers.length === 0 || this.errorFetchingInactive)) {
        this.fetchInactiveUsers();
      }
    },
    async fetchActiveUsers() {
      try {
        const data = await UserService.getAllUsers();
        this.activeUsers = data;
      } catch (error) {
        console.error('Erro ao buscar usuários ativos:', error);
        this.activeUsers = []; 
      }
    },
    async fetchInactiveUsers() {
      try {
        const data = await UserService.deletedUsers();
        this.inactiveUsers = data;
        this.errorFetchingInactive = false;
      } catch (error) {
        console.error('Erro ao buscar usuários inativos:', error);
        this.inactiveUsers = []; 
        this.errorFetchingInactive = true; 
      }
    },
    async fetchUser() {
      await this.fetchActiveUsers();
      await this.fetchInactiveUsers();
    },
  },
};
</script>

<style scoped>

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .buttons {
    display: flex;
    gap: 10px; 
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); 
    display: flex;
    justify-content: center; 
    align-items: center; 
    z-index: 1000;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(3px);
  }

  :deep(.deactivate-button) {
    background-color: #e2e8f0;
    color: #1f2937;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  :deep(.deactivate-button):hover {
    background-color: #cbd5e1;
  }

  .modal-content {
    width: 30%;
    max-width: 600px;
    min-height: 300px;
    top: 81px;
    left: 633px;
    border-radius: 20px;
    background-color: #FFFFFF;
    padding: 30px 50px;
    max-height: 90vh;
    overflow-y: auto;  
  }

  .modal-content::-webkit-scrollbar {
    display: none;
  }

  .Title{
    width: 50%;
  }
</style>
