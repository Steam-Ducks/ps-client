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
    
      <CreateButton @click="showCreateUser">
        + Novo Usuário
      </CreateButton>
    </div>
  </div>
  
  <div v-if="isCeatingUser" class="modal">
    <div class="modal-content">
      <UserCreate @go-back="hideCreateUser" @User-created="fetchUser"/>
    </div>
  </div>

  <UserList :users="users"/>
    
  
</template>

<script>
import ReportButton from '@/components/ui/ReportButton.vue';
import CreateButton from '@/components/ui/CreateButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import UserCreate from './UserCreate.vue';  
import UserList from '@/components/users/UserList.vue';
import UserService from '@/services/UserService';

export default {
  name: 'UserIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    CreateButton,
    UserCreate,
    UserList,
  },
  data() {
    return {
      isCeatingUser: false,
      users: [], 
    };
  },
  mounted() {
    this.fetchUser(); 
  },
  methods: {
    showCreateUser() {
      this.isCeatingUser = true;
    },
    hideCreateUser() {
      this.isCeatingUser = false;
    },
    async fetchUser() {
      try {
        const data = await UserService.getAllUsers();
        this.users = data; 
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
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
