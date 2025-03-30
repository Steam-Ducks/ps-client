<template>
  <div class="user-create-view">
    <div class="button-container">
      <FormButton @click="goBack">Voltar</FormButton>
    </div>
    <UserForm @user-created="handleUserCreated" />
  </div>
</template>

<script>
import UserForm from '@/components/users/UserForm.vue';
import FormButton from '@/components/ui/FormButton.vue';

export default {
  name: 'UserCreate',
  components: {
    UserForm,
    FormButton, // Add the component here
  },
  methods: {
    goBack() {
      this.$emit('go-back');
    },
    handleUserCreated() {
      this.$emit('go-back');
    },
  },
};
</script>

<style scoped>

.button-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
