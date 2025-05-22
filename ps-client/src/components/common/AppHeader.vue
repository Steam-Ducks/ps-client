<template>
  <header class="app-header">
    <CreateButton href="#" class="nav-link export-button" @click.prevent="openModal">
      <DocumentArrowDownIcon class="icon" />
      <span class="export-text">Exportar relatório</span>
    </CreateButton>
    <a href="#" class="nav-link" @click="handleLogout">
      <ArrowRightStartOnRectangleIcon class="icon" />
    </a>
  </header>
</template>

<script>
import { ArrowRightStartOnRectangleIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import UserService from '@/services/UserService';
import { useRouter } from 'vue-router';
import CreateButton from "@/components/ui/CreateButton.vue";

export default {
  name: 'AppHeader',
  components: {
    CreateButton,
    ArrowRightStartOnRectangleIcon,
    DocumentArrowDownIcon,
  },
  emits: ['open-modal'],
  setup(_, { emit }) {
    const router = useRouter();

    const handleLogout = () => {
      UserService.logout();
      router.push({ name: 'Login' });
    };

    const openModal = () => {
      emit('open-modal');
    };

    return {
      handleLogout,
      openModal,
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
}

.icon {
  width: 28px;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.nav-link {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6F08AF;
  font-family: Nunito;
  margin-right: 10px;
  padding: 0 10px;
}

.export-button {
  color: #FFFFFF;
  border-radius: 5px;
  padding: 1px 6px;
  height: 35px;
  font-size: 13.3px;
  font-family: Nunito;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-button:hover {
  background-color: #5a069c;
}

.export-text {
  margin-left: 5px;
  font-weight: 500;
}

.export-button .icon {
  color: white;
  width: 20px;
}

</style>
