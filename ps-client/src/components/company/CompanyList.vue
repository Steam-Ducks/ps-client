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
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import OptionsButton from '@/components/ui/OptionsButton.vue';

export default {
  name: 'CompanyList',
  components: {
    DataTable,
    OptionsButton,
  },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  emits: ['delete-company'], 
  data() {
    return {
      tableKey: 0,
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
            return `<button class="edit-btn" data-id="${row.id}">✏️</button>
                    <button class="delet-btn" data-id="${row.id}">🗑️</button>`;
          }
        }
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
    handleAction(company) {
      console.log("Ação para empresa:", company);
    },
    attachEventListeners() {
      this.$nextTick(() => {
        document.querySelectorAll('.action-btn').forEach((btn) => {
          btn.addEventListener('click', (event) => {
            const companyId = event.target.getAttribute('data-id');
            const selectedCompany = this.companies.find(c => c.id == companyId);
            if (selectedCompany) {
              this.handleAction(selectedCompany);
            }
          });
        });
      });
    }
  },
  mounted() {
    DataTable.use(DataTablesCore);
    this.attachEventListeners();
  },
  watch: {
    companies() {
      this.tableKey += 1;
      this.attachEventListeners();
    },
  },
  beforeUnmount() {
    if (this.$refs.dataTable?.dt) {
      this.$refs.dataTable.dt.destroy(true);
    }
  },
};
</script>