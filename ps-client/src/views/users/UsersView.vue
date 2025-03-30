<template>
  <div class="users-view">
    <h1 class="title">Lista de Usuários</h1>

    <FormButton v-if="showSearchButton" @click="buscarDados">Buscar Dados</FormButton>

    <FormButton v-else type="secondary" @click="resetSearch">Buscar</FormButton>

    <SearchBar v-if="isSearchVisible" v-model:searchQuery="searchQuery" />

    <UserList v-if="users.length > 0" :users="filteredUsers" />
    
  </div>
</template>

<script>
import UserService from '@/services/UserService';
import SearchBar from '@/components/ui/SearchBar.vue';
import UserList from '@/components/users/UserList.vue';
import FormButton from '@/components/ui/FormButton.vue';

export default {
  name: 'UsersView',
  components: {
    SearchBar,
    UserList,
    FormButton,
  },
  data() {
    return {
      users: [],
      searchQuery: '',
      isSearchVisible: true,
      showSearchButton: true,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(
        (user) =>
          user.username &&
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async buscarDados() {
      try {
        const response = await UserService.getAllUsers();
        console.log('Dados da API:', response);
        this.users = response;
        this.isSearchVisible = false;
        this.showSearchButton = false;
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        this.users = [];
      }
    },
    resetSearch() {
      this.users = [];
      this.searchQuery = '';
      this.isSearchVisible = true;
      this.showSearchButton = true;
    },
  },
  mounted() {
    this.buscarDados();
  },
};
</script>

<style scoped>
.users-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #1e293b;
  font-size: 2.5rem;
  margin-bottom: 25px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

/* Firulas extras */
.users-view::before {
  content: '';
  display: block;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 2px;
  margin-bottom: 20px;
}
</style>
