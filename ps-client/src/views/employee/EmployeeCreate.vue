<template>  
  <div class="employee-create-view">

    <div class="button-container">
      <button @click="goBack" class="transparent-button">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <h2> Novo Funcionário </h2>
    <p> Preencha os campos abaixo para cadastrar o Funcionário </p>
  
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
        this.$emit('employee-created');
      },
    },
  };
</script>

<style scoped>

  .employee-create-view {
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
