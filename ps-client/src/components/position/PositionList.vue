<template>
  <div v-if="positions.length > 0" class="position-list">
    <DataTable
      :key="tableKey"
      ref="dataTable"
      :data="formattedPositions"
      :columns="columns"
      :options="tableOptions"
      class="display nowrap my-custom-table"
      style="width:100%"
    />
  </div>
  <div v-else class="no-positions-message">
    <p>Nenhum cargo encontrado. Tente buscar novamente.</p>
  </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';



export default {
  name: 'PositionList',
  components: {
    DataTable,
  },
  props: {
    positions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tableKey: 0,
      columns: [
        { title: 'Nome', data: 'name' },
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
    formattedPositions() {
      return this.positions.map((position) => ({
        name: position.name
      }));
    },
  },
  mounted() {
    DataTable.use(DataTablesCore);
  },
  watch: {
    positions() {
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
  .position-list {
    margin-top: 25px;
  }

  .no-positions-message {
    text-align: center;
    color: #64748b;
    font-size: 1.2rem;
    margin-top: 20px;
  }

</style>
