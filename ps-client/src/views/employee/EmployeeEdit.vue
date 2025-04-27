<template>
  <div class="employee-edit-view">

    <div class="button-container">
      <button @click="goBack" class="transparent-button">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <h2>Editar Funcionário</h2>
    <p>Atualize os campos abaixo para editar o Funcionário</p>

    <EmployeeEditForm :employee-id="id" @employee-updated="goBack" />
  </div>

</template>

<script>
import EmployeeEditForm from '@/components/employee/EmployeeEditForm.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'EmployeeEdit',
  components: {
    EmployeeEditForm,
    XMarkIcon,
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack() {
      this.$emit('go-back');
      this.$emit('employee-updated');
    },
  },
};
</script>

<style scoped>

.employee-edit-view {
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
