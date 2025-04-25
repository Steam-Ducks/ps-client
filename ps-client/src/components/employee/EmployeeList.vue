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
            &#8230;
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
  position: relative;
}

.edit-button {
  background-color: #4a0673;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s;
  visibility: visible !important;
  opacity: 1 !important;
}

.edit-button:hover {
  background-color: #330450;
  transform: scale(1.1);
}
</style>
