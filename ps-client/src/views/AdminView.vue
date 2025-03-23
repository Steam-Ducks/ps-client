<template>

  <div>
    <FormButton v-if="!isCreatingUser" @click="showCreateUser">
      Cadastrar Usuário
    </FormButton>
    <UserCreateView v-if="isCreatingUser" @go-back="hideCreateUser" />
  </div>

  <div>
    <UsersView />
  </div>

</template>

<script>
import UserCreateView from '@/views/users/UserCreateView.vue';
import UsersView from '@/views/users/UsersView.vue';
import FormButton from '@/components/ui/FormButton.vue';

export default {
  data() {
    return {
      isCreatingUser: false,
    };
  },
  components: {
    UserCreateView,
    UsersView,
    FormButton,
  },
};
</script>
<style scoped>
.admin-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

</style>