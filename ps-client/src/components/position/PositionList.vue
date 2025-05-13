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
    >
      <template v-slot:actions="{ rowData }">
          <OptionsButton @click="handleAction(rowData)" />
       </template>
    </DataTable>
  </div>
  <div v-else class="no-positions-message">
    <p>Nenhum cargo encontrado. Tente buscar novamente.</p>
  </div>

  <div v-if= "isEditingPosition" class="modal">
    <div class="modal-content">
      <div class="close-button-container">
        <button @click="hideEditPosition" class="transparent-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="close-icon">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
       <PositionEditForm
          :position-id="selectedPositionId"
          @position-updated="positionUpdated"
      />
    </div>
  </div>
  
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import languagePTBR from '@/assets/dataTable/language/pt-BR.json';
import PositionEditForm from './PositionEditForm.vue';
import OptionsButton from '../ui/OptionsButton.vue';

export default {
  name: 'PositionList',
  components: {
    DataTable,
    OptionsButton,
    PositionEditForm,
  },
  props: {
    positions: {
      type: Array,
      required: true,
    },
  },
  emits: ['position-updated'],
  data() {
    return {
      tableKey: 0,
      isEditingPosition : false,
      selectedPositionId : null,
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
        language: languagePTBR,
        dom: 'frtip',
         drawCallback: () => {
          this.attachEventListeners();
        }
      },
    };
  },
  computed: {
    formattedPositions() {
      return this.positions.map((position) => ({
        id: position.id,
        name: position.name,
      }));
    },
  },
  methods: {
    showEditPosition(id) {
      console.log('Editar posição com id:', id);
      this.$emit('edit-position', Number(id)); 
    },
    hideEditPosition() {
      this.isEditingPosition = false;
      this.selectedPositionId = null;
      this.$emit('position-updated');
    },
    positionUpdated() {
      this.hideEditPosition();
      this.$emit('position-updated');
    },
    handleAction(position){
      this.showEditPosition(position.id);
    },
    attachEventListeners(){
      this.$nextTick(() => {
        const editButtons = document.querySelectorAll('.edit-btn');
        if (editButtons.length > 0) {
          editButtons.forEach((btn) => {
            btn.removeEventListener('click', this.handleEditButtonClick);
            btn.addEventListener('click', this.handleEditButtonClick);
          });
        }
      })
    },
    handleEditButtonClick(event) {
      let target = event.target;
      while (target && !target.getAttribute('data-id')) {
        target = target.parentElement;
      }

      if (target) {
        const positionId = target.getAttribute('data-id');
        if (positionId) {
          event.preventDefault();
          event.stopPropagation();
          this.showEditPosition(positionId);
        }
      }
    }
  },
  mounted() {
    DataTable.use(DataTablesCore);
    this.attachEventListeners();
  },
  updated(){
    this.attachEventListeners();
  },
  watch: {
    positions() {
      this.tableKey += 1;
      this.$nextTick(() => {
        this.attachEventListeners();
      });
    },
  },
  beforeUnmount() {
    if (this.$refs.dataTable?.dt) {
      this.$refs.dataTable.dt.destroy(true);
    }
  },
};
</script>
