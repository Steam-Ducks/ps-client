<template>
  <div v-if="employees && employees.length > 0" class="employee-list">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>cargo</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        <EmployeeItem v-for="employee in employees" :key="employee.id" :employee="employee" />
      </tbody>
    </table>
  </div>
  <div v-else class="no-employee-message">
    <p>Nenhum funcionario encontrado. Tente buscar novamente.</p>
  </div>
</template>

<script>
import EmployeeItem from './EmployeeItem.vue';

export default {
  name: 'EmployeeList',
  components: {
    EmployeeItem,
  },
  props: {
    employees: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.employee-list {
  margin-top: 25px;
}

.no-employees-message {
  text-align: center;
  color: #64748b;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
