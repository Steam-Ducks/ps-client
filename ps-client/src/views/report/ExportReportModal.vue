<template>
  <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Exportar relatório</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="reportType">Tipo de Relatório</label>
            <select id="reportType" v-model="form.reportType" required>
              <option value="employee-list">Listagem de funcionários</option>
              <option value="all-companies">Listagem de empresas</option>
              <option value="employee-timesheet">Pontos de funcionário</option>
              <option value="company-hours">Horas trabalhadas por empresa</option>
            </select>
          </div>

          <div class="form-group" v-if="requiresPeriod">
            <label>Período</label>
            <div class="date-inputs">
              <div>
                <label for="startDate">De</label>
                <input type="date" id="startDate" v-model="form.startDate" required />
              </div>
              <div>
                <label for="endDate">Até</label>
                <input type="date" id="endDate" v-model="form.endDate" required />
              </div>
            </div>
          </div>
          <div class="form-group" v-if="requiresCompany">
            <label for="company">Empresa</label>
            <select id="company" v-model="form.companyId" :disabled="!companies.length" required>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="requiresEmployee">
            <label for="employee">Funcionário</label>
            <select id="employee" v-model="form.employeeId" :disabled="!employees.length" required>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="fileFormat">Formato do Arquivo</label>
            <select id="fileFormat" v-model="form.fileFormat" required>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <button type="submit" :disabled="!isFormValid">Exportar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import CompanyService from '@/services/CompanyService';
import EmployeeService from '@/services/EmployeeService';
import DashboardService from "@/services/DashboardService";

export default {
  name: 'ExportReportModal',
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'export-success'],
  setup(props, { emit }) {
    const form = ref({
      reportType: 'employee-list',
      fileFormat: 'excel', // Default to Excel
      companyId: null,
      employeeId: null,
      startDate: '',
      endDate: '',
    });
    const companies = ref([]);
    const employees = ref([]);
    const isLoading = ref(false);

    const requiresPeriod = computed(() =>
        ['employee-timesheet', 'company-hours'].includes(form.value.reportType)
    );
    const requiresCompany = computed(() =>
        ['employee-list', 'employee-timesheet', 'company-hours'].includes(form.value.reportType)
    );
    const requiresEmployee = computed(() =>
        ['employee-timesheet'].includes(form.value.reportType)
    );

    const isFormValid = computed(() => {
      if (requiresPeriod.value && (!form.value.startDate || !form.value.endDate)) {
        return false;
      }
      if (requiresCompany.value && !form.value.companyId) {
        return false;
      }
      if (requiresEmployee.value && !form.value.employeeId) {
        return false;
      }
      return true;
    });

    const loadCompanies = async () => {
      try {
        companies.value = await CompanyService.getAllCompanies();
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      }
    };

    const loadEmployees = async (companyId) => {
      try {
        employees.value = await EmployeeService.getEmployeesByCompanyId(companyId);
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        employees.value = [];
      }
    };

    watch(
        () => form.value.companyId,
        (newCompanyId) => {
          if (newCompanyId) {
            loadEmployees(newCompanyId);
          } else {
            employees.value = [];
          }
        }
    );

    const closeModal = () => {
      emit('close');
    };

    const submitForm = async () => {
      try {
        isLoading.value = true;

        const payload = {
          reportType: form.value.reportType,
          fileFormat: form.value.fileFormat, // Use the selected file format
          companyId: form.value.companyId || null,
          companyName: companies.value.find(c => c.id === form.value.companyId)?.name || '',
          employeeId: form.value.employeeId || null,
          employeeName: employees.value.find(e => e.id === form.value.employeeId)?.name || '',
          startDate: form.value.startDate || '',
          endDate: form.value.endDate || '',
        };

        await DashboardService.exportReport(payload);

        emit('export-success');
        closeModal();
      } catch (error) {
        console.error('Erro ao exportar relatório:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadCompanies();
    });

    return {
      form,
      companies,
      employees,
      isLoading,
      requiresPeriod,
      requiresCompany,
      requiresEmployee,
      isFormValid,
      closeModal,
      submitForm,
    };
  },
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
}

.modal-header h2 {
  margin: 0;
  color: #6F08AF;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.close-button:hover {
  color: #6F08AF;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #6F08AF;
  font-weight: 500;
}

.date-inputs {
  display: flex;
  gap: 20px;
}

.date-inputs div {
  flex: 1;
}

input[type="date"],
select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  background-color: #ffffff;
}
select {
  width: 100%;
}
input[type="date"] {
  width: 90%;
}

input[type="date"]:focus,
select:focus {
  border-color: #6F08AF;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #6F08AF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  font-family: Nunito, sans-serif;
  font-weight: 500;
}

button[type="submit"]:hover {
  background-color: #5a069c;
}

button[type="submit"]:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>