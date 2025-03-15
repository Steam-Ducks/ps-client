<template>
  <li class="user-item">
    <div class="user-info">
      <span class="user-label">ID:</span> <span class="user-id">{{ user.userId }}</span>
    </div>
    <div class="user-info">
      <span class="user-label">Nome:</span> <span class="user-name">{{ user.username }}</span>
    </div>
    <div class="user-info">
      <span class="user-label">Email:</span> <span class="user-email">{{ user.email }}</span>
    </div>
    <div class="user-info">
      <span class="user-label">Senha:</span> <span class="user-password">{{ user.password }}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'UserItem',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.user-item {
  padding: 20px;
  background-color: #ffffff;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.user-info {
  margin-bottom: 12px;
}

.user-label {
  font-weight: bold;
  color: #1e293b;
}

.user-id,
.user-name,
.user-email,
.user-password {
  color: #64748b;
}
</style>
