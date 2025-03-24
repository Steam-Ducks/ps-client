<template>
  <div class="emplyee-create-view">
    <div class="button-container">
      <button @click="goBack" class="transparent-button">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <h2> Novo Colaborador </h2>
    <p> Preencha os campos abaixo para cadastrar o colaborador </p>

    <EmployeeForm @employee-created="goBack" />
  </div>
</template>

<script>
import EmployeeForm from '@/components/employee/EmployeeForm.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'EmployeeCreate',
  components: {
    EmployeeForm,
    XMarkIcon,
  },
  methods: {
    goBack() {
      this.$emit('go-back');
    },
  },
};
</script>

<style scoped>
.employee-create-view {
  width: 100%;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
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
