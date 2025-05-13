<template>
  <div class="user-edit-view">

  <div class="button-container">
    <button @click="goBack" class="transparent-button">
      <XMarkIcon class="icon" />
    </button>
  </div>

  <h2> Editar Usuário </h2>
  <p> Altere os campos abaixo para editar o usuário </p>

  <UserEditForm :user-id="id" @user-updated="goBack" />
  </div>

</template>

<script>
import UserEditForm from '@/components/users/UserEditForm.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'UserEdit',
  components: {
    UserEditForm,
    XMarkIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    goBack() {
      this.$emit('go-back');
      this.$emit('user-updated'); // Corrected event name
    },
  },
};
</script>

<style scoped>
.user-edit-view {
    width: 100%;
    position: relative;
}

  .button-container {
    display: flex;
    justify-content: flex-end;
    position: absolute;  
    top: 0;  
    right: 0;  
    z-index: 10; 
  }

  .transparent-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .icon {
    width: 28px;
    height: 28px;
  }

</style>
