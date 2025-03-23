<template>
  <div v-if="users.length > 0" class="user-list">
    <ul>
      <UserItem v-for="user in users" :key="user.userId" :user="user" />
    </ul>
  </div>
  <div v-else class="no-users-message">
    <p>Nenhum usuário encontrado. Tente buscar novamente.</p>
  </div>
</template>

<script>
import UserItem from './CompanyItem.vue'; // Caminho atualizado

export default {
  name: 'UserList',
  components: {
    UserItem,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.user-list {
  margin-top: 25px;
}

.no-users-message {
  text-align: center;
  color: #64748b;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
