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
        {
          title: '',
          data: null,
          class: 'actions',
          orderable: false,
          searchable: false,
          render: (data, type, row) => {
            return `<button class="edit-btn" data-id="${row.id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </button>`;
          }
        },
      ],
      tableOptions: {
        responsive: true,
        lengthMenu: [10],
        dom: 'frtip',
      },
    };
  },
  computed: {
    formattedPositions() {
      return this.positions.map((position) => ({
        id: position.id, // agora precisa passar o id também!
        name: position.name,
      }));
    },
  },
  mounted() {
    DataTable.use(DataTablesCore);
  },
  watch: {
    positions() {
      this.tableKey += 1;
      this.$nextTick(() => {
        this.attachEditButtonListeners();
      });
    },
    tableKey() {
      this.$nextTick(() => {
        this.attachEditButtonListeners();
      });
    },
  },
  methods: {
    attachEditButtonListeners() {
      // Remove todos os event listeners antes de adicionar de novo
      const buttons = this.$el.querySelectorAll('.edit-btn');
      buttons.forEach((button) => {
        button.removeEventListener('click', this.handleEditClick); // Evita múltiplos
        button.addEventListener('click', this.handleEditClick);
      });
    },
    handleEditClick(event) {
      const id = event.currentTarget.getAttribute('data-id');
      this.showEditPosition(id);
    },
    showEditPosition(id) {
      console.log('Editar posição com id:', id);
      this.$emit('edit-position', Number(id)); 
    },
  },
  beforeUnmount() {
    if (this.$refs.dataTable?.dt) {
      this.$refs.dataTable.dt.destroy(true);
    }
  },
};
</script>
