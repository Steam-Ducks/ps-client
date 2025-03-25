<template>
    <div class="employee-form-test-page">
      <h1>Employee Form Test Page</h1>
      <EmployeeForm @employee-created="handleEmployeeCreated" />
    </div>
  </template>
  
  <script>
  import EmployeeForm from '@/components/employee/EmployeeForm.vue';
  
  export default {
    name: 'EmployeeFormTest',
    components: {
      EmployeeForm,
    },
    methods: {
      handleEmployeeCreated() {
        console.log('Employee created event received!');
      },
    },
  };
  </script>
  
  <style scoped>
  .employee-form-test-page {
    padding: 20px;
  }
  </style>
  