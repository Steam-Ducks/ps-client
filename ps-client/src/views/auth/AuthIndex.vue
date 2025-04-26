<template>
  <LoginForm />
</template>

<script>
import LoginForm from '@/components/users/LoginForm.vue';

export default {
  name: 'AuthIndex',
  components: {
    LoginForm,
  },
  beforeRouteEnter(to, from, next) {
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (isAuthenticated) {
      localStorage.removeItem('token');

    }
    next();
  }
};
</script>