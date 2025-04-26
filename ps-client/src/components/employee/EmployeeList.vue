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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
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
  background-color: #ffffff;
  color: #4a0673;
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
  background-color: #f1d4fc;
  transform: scale(1.1);
}
</style>
