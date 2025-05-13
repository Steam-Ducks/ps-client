<template>
  <div v-if="users.length > 0" class="user-list">
    <DataTable
      :key="tableKey"
      ref="dataTable"
      :data="formattedUsers"
      :columns="columns"
      :options="tableOptions"
      class="display nowrap my-custom-table"
      style="width:100%"
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
  
  <div v-else class="no-users-message">
    <p>Nenhum usuário encontrado. Tente buscar novamente.</p>
  </div>

</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import languagePTBR from '@/assets/dataTable/language/pt-BR.json';
import Buttons from 'datatables.net-buttons';

DataTable.use(DataTablesCore);
DataTablesCore.use(Buttons);


export default {
  name: 'UserList',
  components: {
    DataTable,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  emits: ['edit-user'],
  data() {
    return {
      tableKey: 0,
      columns: [
        { title: 'Nome', data: 'username' },
        { title: 'Email', data: 'email' },
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
        dom: 'Bftip',
        language: languagePTBR
      },
    };
  },
  computed: {
    formattedUsers() {
      return this.users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
      }));
    },
  },
  mounted() {
    DataTable.use(DataTablesCore);
  },
  watch: {
    users() {
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
      console.log('[UserList] Edit clicked, id =', id);
      this.$emit('edit-user', id);
    },
  }
};
</script>

<style scoped>
  .user-list {
    margin-top: 25px;
  }

  .no-users-message {
    text-align: center;
    color: #64748b;
    font-size: 1.2rem;
    margin-top: 20px;
  }

</style>
