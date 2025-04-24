<template>
  <div class="employee-list">
    <table>
      <thead>
      <tr>
        <th>Nome completo</th>
        <th>CPF</th>
        <th>Cargo</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="employee in employees" :key="employee.id">
        <td>{{ employee.name }}</td>
        <td>{{ employee.cpf }}</td>
        <td>{{ employee.position?.name }}</td>
        <td class="actions">
          <button @click="editEmployee(employee.id)" class="edit-button">
            Editar
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'EmployeeList',
  props: {
    employees: {
      type: Array,
      required: true
    }
  },
  emits: ['edit-employee'],
  methods: {
    editEmployee(id) {
      this.$emit('edit-employee', id);
    }
  }
};
</script>

<style scoped>
.employee-list {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  color: #475569;
  font-weight: 600;
}

tr:hover {
  background-color: #f1f5f9;
}

.actions {
  text-align: right;
}

.edit-button {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  color: #6F08AF;
  cursor: pointer;
  font-weight: 500;
}

.edit-button:hover {
  background-color: #e5e7eb;
}
</style>
