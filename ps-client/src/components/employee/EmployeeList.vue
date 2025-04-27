<template>
  <div v-if="employees && employees.length > 0" class="employee-list">
    <DataTable
        ref="dataTable"
        :key="tableKey"
        :data="formattedemployees"
        :columns="columns"
        :options="tableOptions"
    >
      <template #column-actions="{ rowData }">
        <button
            class="edit-btn"
            @click="onEdit(rowData.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      </template>
    </DataTable>

  </div>
  <div v-else class="no-employee-message">
    <p>Nenhum funcionário encontrado. Tente buscar novamente.</p>
  </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import Buttons from 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import languagePTBR from '@/assets/dataTable/language/pt-BR.json';

DataTable.use(DataTablesCore);
DataTablesCore.use(Buttons);



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
  emits: ['edit-employee'],
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
        {
          title: '',
          data: null,
          orderable: false,
          class: 'actions',
          name: 'actions',
        },
      ],
      tableOptions: {
        responsive: true,
        select: true,
        lengthMenu: [10],
        buttons: [
          {
            extend: 'excel',
            title: 'teste',
            exportOptions: {
              columns: [1, 2]
            }
          }
        ],
        language: languagePTBR,
        dom: 'Bftip',
      },
    };
  },
  computed: {
    formattedemployees() {
      return this.employees.map((employee) => ({
        id: employee.id,
        foto: employee.photo,
        name: employee.name,
        cpf: employee.cpf,
        position: employee.position.name,
        company: employee.company.name,
      }));
    },
  },
  watch: {
    employees() {
      this.tableKey += 1;
    },
  },
  beforeUnmount() {
    if (this.$refs.dataTable?.dt) {
      this.$refs.dataTable.dt.destroy(true);
    }
  },
  methods: {
    onEdit(id) {
      console.log('[EmployeeList] Edit clicked, id =', id);
      this.$emit('edit-employee', id);
    },
  }
};
</script>

<style scoped>
.employee-list {
  margin-top: 25px;
}



</style>