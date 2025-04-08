<template>
  <div v-if="employees && employees.length > 0" class="employee-list">
    <DataTable
      :data="formattedemployees"
      :columns="columns"
      :options="tableOptions"
    />
  </div>
  <div v-else class="no-employee-message">
    <p>Nenhum funcionário encontrado. Tente buscar novamente.</p>
  </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';

export default {
  name: 'EmployeeList',
  components: {
    DataTable,
  },
  props: {
    employees: {
      type: Array,
      required: true,
    },
  },
  data() {
      return {
        tableKey: 0,
        columns: [
          { title: ' ',
            data: 'foto',
            orderable: false, 
            render: (data) => {
              return `<img src="${data}" alt="Foto de perfil" class="photo"/>`;
            },
            class:'image'
          },
          { title: 'Nome completo', data: 'name', class:'name' },
          { title: 'CPF', data: 'cpf', class:'cpf' },
          { title: 'Cargo', data: 'position', class:'position' },
          { title: 'Empresa', data: 'company', class:'company' },
        ],
        tableOptions: {
          responsive: true,
          language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json',
          },
          dom: '<"top"f>rt<"bottom"lip><"clear">',
        },
      };
    },
    computed: {
      formattedemployees() {
        return this.employees.map((employee) => ({
          foto: employee.photo,
          name: employee.name,
          cpf: employee.cpf,
          position: employee.position.name,
          company: employee.company.name,
        }));
      },
    },
    mounted() {
      DataTable.use(DataTablesCore);
    },
    watch: {
      employee() {
        this.tableKey += 1;
      },
    },
    beforeUnmount() {
      if (this.$refs.dataTable?.dt) {
        this.$refs.dataTable.dt.destroy(true);
      }
    },
  };
</script>

<style scoped>
.employee-list {
  margin-top: 25px;
}

.no-employees-message {
  color: #64748b;
  font-size: 1.2rem;
  margin-top: 20px;
}

.img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

</style>
