<template>
  <header class="app-header">
    <a href="#" class="nav-link" @click="handleLogout">
      <ArrowRightStartOnRectangleIcon class="icon" />
    </a>
  </header>
</template>

<script>
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/solid';
import UserService from '@/services/UserService';
import { useRouter } from 'vue-router';

export default {
  name: 'AppHeader',

  components: {
    ArrowRightStartOnRectangleIcon,
  },

  setup() {
    const router = useRouter();

    const handleLogout = () => {
      UserService.logout();
      router.push({ name: 'Login' });
    };

    return {
      handleLogout,
    };
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  top: 0;
  left: 0;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  position: fixed;
  z-index: 1;
}

.icon {
  width: 28px;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.nav-link {
  height: 100%;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6F08AF;
  font-family: Nunito;
  margin-right: 10px;
}
</style>