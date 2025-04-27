<template>
  <div v-if="companies.length > 0" class="company-list">
    <DataTable
        :data="formattedCompanies"
        :columns="columns"
        :options="tableOptions"
    >
      <template v-slot:actions="{ rowData }">
        <OptionsButton @click="handleAction(rowData)" />
      </template>
    </DataTable>
  </div>
  <div v-else class="no-companies-message">
    <p>Nenhuma empresa encontrada. Tente buscar novamente.</p>
  </div>

  <!-- Modal de Edição de Empresa -->
  <div v-if="isEditingCompany" class="modal">
    <div class="modal-content">
      <div class="close-button-container">
        <button @click="hideEditCompany" class="transparent-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="close-icon">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <CompanyEditForm
          :company-id="selectedCompanyId"
          @company-updated="companyUpdated"
      />
    </div>
  </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import OptionsButton from '@/components/ui/OptionsButton.vue';

import CompanyEditForm from '@/components/company/CompanyEditForm.vue';


export default {
  name: 'CompanyList',
  components: {
    DataTable,
    OptionsButton,
    CompanyEditForm,
  },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  emits: ['company-updated'],
  data() {
    return {
      tableKey: 0,
      isEditingCompany: false,
      selectedCompanyId: null,
      columns: [
        { title: 'Nome', data: 'name', class: 'name' },
        { title: 'CNPJ/CPF', data: 'cnpj', class: 'cnpj' },
        { title: 'Contato', data: 'contact', class: 'contact' },
        {
          title: '',
          data: null,
          class: 'actions',
          orderable: false,
          searchable: false,
          render: (data, type, row) => {
            return `<button class="edit-btn" data-id="${row.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg></button>`;
          }
        }
      ],
      tableOptions: {
        responsive: true,
        language: languagePTBR,
        dom: '<"top"f>rt<"bottom"lip><"clear">',
        drawCallback: () => {
          this.attachEventListeners();
        }
      },
    };
  },
  computed: {
    formattedCompanies() {
      return this.companies.map((company) => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        contact: company.contact,
      }));
    },
  },
  methods: {
    showEditCompany(companyId) {
      this.selectedCompanyId = companyId;
      this.isEditingCompany = true;
    },
    hideEditCompany() {
      this.isEditingCompany = false;
      this.selectedCompanyId = null;
    },
    companyUpdated() {
      this.hideEditCompany();
      this.$emit('company-updated');
    },
    handleAction(company) {
      // Usar o método showEditCompany para abrir o modal de edição
      this.showEditCompany(company.id);
    },
    attachEventListeners() {
      this.$nextTick(() => {
        const editButtons = document.querySelectorAll('.edit-btn');
        if (editButtons.length > 0) {
          editButtons.forEach((btn) => {
            // Remover event listeners anteriores para evitar duplicação
            btn.removeEventListener('click', this.handleEditButtonClick);
            // Adicionar novo event listener
            btn.addEventListener('click', this.handleEditButtonClick);
          });
        }
      });
    },
    handleEditButtonClick(event) {
      // Encontrar o elemento pai mais próximo com data-id
      let target = event.target;
      while (target && !target.getAttribute('data-id')) {
        target = target.parentElement;
      }

      if (target) {
        const companyId = target.getAttribute('data-id');
        if (companyId) {
          event.preventDefault();
          event.stopPropagation();
          this.showEditCompany(companyId);
        }
      }
    }
  },
  mounted() {
    DataTable.use(DataTablesCore);
    this.attachEventListeners();
  },
  updated() {
    this.attachEventListeners();
  },
  watch: {
    companies() {
      this.tableKey += 1;
      this.$nextTick(() => {
        this.attachEventListeners();
      });
    },
  },
  beforeUnmount() {
    // Remover todos os event listeners para evitar memory leaks
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.removeEventListener('click', this.handleEditButtonClick);
    });

    if (this.$refs.dataTable?.dt) {
      this.$refs.dataTable.dt.destroy(true);
    }
  },
};
</script>

<style scoped>
.company-list {
  width: 100%;
  margin-top: 20px;
}

.no-companies-message {
  text-align: center;
  margin-top: 20px;
  color: #6b7280;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(3px);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 500px;
  position: relative;
}

.close-button-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.transparent-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.close-icon {
  width: 24px;
  height: 24px;
  color: #6F08AF;
}

:deep(.edit-btn) {
  background: none;
  border: none;
  cursor: pointer;
  color: #6F08AF;
}

:deep(.edit-btn:hover) {
  color: #5a0690;
}
</style>
