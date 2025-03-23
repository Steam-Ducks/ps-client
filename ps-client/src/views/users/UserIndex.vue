<template>
  <div>
    <FormButton v-if="!isCreatingUser" @click="showCreateUser">
      Cadastrar Usuário
    </FormButton>
    <UserCreate v-if="isCreatingUser" @go-back="hideCreateUser" />
  </div>

  <div>
    <UserList />
  </div>
  
  </template>

<script>
import UserCreate from '@/views/users/UserCreate.vue';
import UserList from '@/views/users/UserList.vue';
import FormButton from '@/components/ui/FormButton.vue';

export default {
  name: 'UserIndex',
  components: {
    UserCreate,
    UserList,
    FormButton,
  },
  data() {
    return {
      isCreatingUser: false,
    };
  },
  methods: {
    showCreateUser() {
      this.isCreatingUser = true;
    },
    hideCreateUser() {
      this.isCreatingUser = false;
    },
  },
};
</script>
