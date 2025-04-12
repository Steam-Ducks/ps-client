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
    />
  </div>
  <div v-else class="no-users-message">
    <p>Nenhum usuário encontrado. Tente buscar novamente.</p>
  </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';


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
  data() {
    return {
      tableKey: 0,
      columns: [
        { title: 'Nome', data: 'username' },
        { title: 'Email', data: 'email' },
      ],
      tableOptions: {
        responsive: true,
        lengthMenu: [10],
        dom: 'Bfrtip',
        
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json',
        },
      },
    };
  },
  computed: {
    formattedUsers() {
      return this.users.map((user) => ({
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
