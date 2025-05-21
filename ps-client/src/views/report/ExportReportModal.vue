<template>
  <header class="app-header">
    <a href="#" class="nav-link export-button" @click.prevent="handleExportReport">
      <DocumentArrowDownIcon class="icon" />
      <span class="export-text">Exportar relatório</span>
    </a>
    <a href="#" class="nav-link" @click="handleLogout">
      <ArrowRightStartOnRectangleIcon class="icon" />
    </a>

    <!-- Modal de Exportação de Relatório -->
    <div class="modal-overlay" v-if="showExportModal" @click.self="closeExportModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Exportar relatório</h2>
          <button class="close-button" @click="closeExportModal">×</button>
        </div>

        <div class="modal-body">
          <!-- Tipo de Relatório -->
          <div class="form-group">
            <label for="reportType">Tipo de Relatório</label>
            <div class="select-container">
              <select
                  id="reportType"
                  v-model="reportType"
                  class="form-control report-type-select"
              >
                <option value="employee-list">Relatório de Listagem de funcionários de uma empresa</option>
                <option value="all-companies">Relatório de Listagem de todas as empresas</option>
                <option value="employee-timesheet">Relatório de Listagem de pontos de um funcionário</option>
                <option value="company-hours">Relatório de empresa com horas trabalhadas</option>
              </select>
              <span class="select-icon">▼</span>
            </div>
          </div>

          <!-- Período - Mostrado para relatórios que precisam de período -->
          <div class="form-group" v-if="showPeriodFilter">
            <label>Período</label>
            <div class="date-inputs">
              <div class="date-input-container">
                <input
                    type="text"
                    v-model="startDate"
                    class="form-control date-input"
                    readonly
                    @click="openStartDatePicker"
                />
                <CalendarIcon class="calendar-icon" @click="openStartDatePicker" />
              </div>
              <span class="date-separator">até</span>
              <div class="date-input-container">
                <input
                    type="date"
                    v-model="endDate"
                    class="form-control date-input"


                />
                <CalendarIcon class="calendar-icon" @click="openEndDatePicker" />
              </div>
            </div>
          </div>

          <!-- Empresa - Mostrado para todos os relatórios exceto listagem de todas as empresas -->
          <div class="form-group" v-if="showCompanyFilter">
            <label for="company">Empresa</label>
            <div class="select-container">
              <select
                  id="company"
                  v-model="company"
                  class="form-control"
                  :disabled="!companies.length"
              >
                <option value="" disabled selected>Selecione uma opção</option>
                <option v-for="comp in companies" :key="comp.id" :value="comp.id">
                  {{ comp.name }}
                </option>
              </select>
              <span class="select-icon">▼</span>
            </div>
          </div>

          <!-- Funcionário - Mostrado apenas para relatórios que precisam de funcionário -->
          <div class="form-group" v-if="showEmployeeFilter">
            <label for="employee">Funcionário</label>
            <div class="select-container">
              <select
                  id="employee"
                  v-model="employee"
                  class="form-control"
                  :disabled="!employees.length"
              >
                <option value="" disabled selected>Selecione uma opção</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.name }}
                </option>
              </select>
              <span class="select-icon">▼</span>
            </div>
          </div>

          <button
              class="export-button-modal"
              @click="exportReport"
              :disabled="!isFormValid || isLoading"
          >
            <span v-if="isLoading">Processando...</span>
            <span v-else>Exportar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Data -->
    <div class="date-picker-overlay" v-if="showDatePicker" @click.self="closeDatePicker">
      <div class="date-picker-container">
        <div class="date-picker-header">
          <h3>{{ datePickerTitle }}</h3>
        </div>
        <div class="date-picker-body">
          <div class="date-picker-input-container">
            <input
                type="text"
                v-model="tempDate"
                class="date-picker-input"
                placeholder="DD/MM/AAAA"
                @input="validateTempDateFormat"
            />
          </div>
          <div class="date-picker-actions">
            <button class="date-picker-button confirm" @click="confirmDateSelection">OK</button>
            <button class="date-picker-button cancel" @click="closeDatePicker">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { ArrowRightStartOnRectangleIcon, DocumentArrowDownIcon, CalendarIcon } from '@heroicons/vue/24/solid';
import UserService from '@/services/UserService';
import { useRouter } from 'vue-router';
// Importação comentada para evitar erros de lint enquanto não for utilizada
// import ReportService from '@/services/report/ReportService';

export default {
  name: 'AppHeader',

  components: {
    ArrowRightStartOnRectangleIcon,
    DocumentArrowDownIcon,
    CalendarIcon
  },

  setup() {
    const router = useRouter();
    const showExportModal = ref(false);
    const showDatePicker = ref(false);
    const datePickerType = ref(''); // 'start' ou 'end'
    const tempDate = ref('');
    const datePickerTitle = ref('');

    // Estados para o formulário de exportação
    const reportType = ref('employee-list');
    const company = ref('');
    const employee = ref('');
    const startDate = ref('01/01/2024');
    const endDate = ref('31/01/2025');
    const isLoading = ref(false);

    // Dados para o formulário
    const companies = ref([]);
    const employees = ref([]);

    // Carregar empresas ao montar o componente
    onMounted(async () => {
      try {
        // Quando o backend estiver pronto, descomentar este bloco
        /*
        isLoading.value = true;
        const ReportService = (await import('@/services/report/ReportService')).default;
        const response = await ReportService.getCompanies();
        companies.value = response.data;
        isLoading.value = false;
        */

        // Dados simulados para demonstração (remover quando backend estiver pronto)
        companies.value = [
          { id: 1, name: 'Empresa A' },
          { id: 2, name: 'Empresa B' },
          { id: 3, name: 'Empresa C' }
        ];
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        isLoading.value = false;
      }
    });

    // Filtros condicionais baseados no tipo de relatório
    const showPeriodFilter = computed(() => {
      return ['employee-list', 'all-companies', 'employee-timesheet'].includes(reportType.value);
    });

    const showCompanyFilter = computed(() => {
      return ['employee-list', 'employee-timesheet', 'company-hours'].includes(reportType.value);
    });

    const showEmployeeFilter = computed(() => {
      return ['employee-timesheet'].includes(reportType.value);
    });

    // Validação do formulário
    const isFormValid = computed(() => {
      // Validação base
      let isValid = !!reportType.value;

      // Validação de empresa quando necessário
      if (showCompanyFilter.value) {
        isValid = isValid && !!company.value;
      }

      // Validação de funcionário quando necessário
      if (showEmployeeFilter.value) {
        isValid = isValid && !!employee.value;
      }

      // Validação de período quando necessário
      if (showPeriodFilter.value) {
        isValid = isValid && !!startDate.value && !!endDate.value;
      }

      return isValid;
    });

    // Resetar campos quando mudar o tipo de relatório
    watch(reportType, () => {
      if (!showCompanyFilter.value) {
        company.value = '';
      }

      if (!showEmployeeFilter.value) {
        employee.value = '';
      }
    });

    // Carregar funcionários quando uma empresa for selecionada
    watch(company, async (newValue) => {
      if (newValue && showEmployeeFilter.value) {
        try {
          isLoading.value = true;

          // Quando o backend estiver pronto, descomentar este bloco
          /*
          const ReportService = (await import('@/services/report/ReportService')).default;
          const response = await ReportService.getEmployeesByCompany(newValue);
          employees.value = response.data;
          */

          // Simulação para demonstração (remover quando backend estiver pronto)
          setTimeout(() => {
            employees.value = [
              { id: 1, name: 'Funcionário 1' },
              { id: 2, name: 'Funcionário 2' },
              { id: 3, name: 'Funcionário 3' }
            ];
            isLoading.value = false;
          }, 500);
        } catch (error) {
          console.error('Erro ao carregar funcionários:', error);
          isLoading.value = false;
        }
      } else {
        employees.value = [];
      }

      // Resetar seleção de funcionário quando mudar a empresa
      employee.value = '';
    });

    const handleLogout = () => {
      UserService.logout();
      router.push({ name: 'Login' });
    };

    const handleExportReport = () => {
      showExportModal.value = true;
    };

    const closeExportModal = () => {
      showExportModal.value = false;
    };

    // Funções para o seletor de data personalizado
    const openStartDatePicker = () => {
      datePickerType.value = 'start';
      tempDate.value = startDate.value;
      datePickerTitle.value = 'Selecione a data inicial (DD/MM/AAAA):';
      showDatePicker.value = true;
    };

    const openEndDatePicker = () => {
      datePickerType.value = 'end';
      tempDate.value = endDate.value;
      datePickerTitle.value = 'Selecione a data final (DD/MM/AAAA):';
      showDatePicker.value = true;
    };

    const closeDatePicker = () => {
      showDatePicker.value = false;
      tempDate.value = '';
    };

    const validateTempDateFormat = () => {
      // Permitir digitação parcial
      if (tempDate.value.length < 10) return;

      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(tempDate.value)) {
        // Se o formato não for válido, restaurar para o valor padrão
        if (datePickerType.value === 'start') {
          tempDate.value = startDate.value;
        } else {
          tempDate.value = endDate.value;
        }
      }
    };

    const confirmDateSelection = () => {
      if (datePickerType.value === 'start') {
        startDate.value = tempDate.value;
      } else {
        endDate.value = tempDate.value;
      }
      closeDatePicker();
    };

    // Função para exportar o relatório
    const exportReport = async () => {
      if (!isFormValid.value) return;

      try {
        isLoading.value = true;

        // Preparar parâmetros para a API
        const params = {
          reportType: reportType.value,
          companyId: company.value || null,
          employeeId: employee.value || null,
          startDate: startDate.value || null,
          endDate: endDate.value || null
        };

        console.log('Exportando relatório com os parâmetros:', params);

        // Quando o backend estiver pronto, descomentar este bloco
        /*
        const ReportService = (await import('@/services/report/ReportService')).default;
        const response = await ReportService.exportReport(params);

        if (response.data) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `relatorio_${new Date().toISOString()}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
        */

        // Simulação para demonstração (remover quando backend estiver pronto)
        setTimeout(() => {
          alert('Relatório exportado com sucesso! (Simulação)');
          isLoading.value = false;
          closeExportModal();
        }, 1000);
      } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        alert('Erro ao exportar relatório. Por favor, tente novamente.');
        isLoading.value = false;
      }
    };

    return {
      handleLogout,
      handleExportReport,
      showExportModal,
      closeExportModal,
      reportType,
      company,
      employee,
      startDate,
      endDate,
      companies,
      employees,
      isFormValid,
      isLoading,
      showPeriodFilter,
      showCompanyFilter,
      showEmployeeFilter,
      openStartDatePicker,
      openEndDatePicker,
      showDatePicker,
      datePickerType,
      tempDate,
      datePickerTitle,
      closeDatePicker,
      validateTempDateFormat,
      confirmDateSelection,
      exportReport
    };
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  top: 0;
  left: 0;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  position: fixed;
}

.icon {
  width: 28px;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.nav-link {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6F08AF;
  font-family: Nunito;
  margin-right: 10px;
  padding: 0 10px;
}

.export-button {
  margin-right: 5px;
  background-color: #6F08AF;
  color: #FFFFFF;
  border-radius: 4px;
  padding: 1px 6px;
  width: 155px;
  height: 35px;
  font-size: 13.3333px;
  font-family: Nunito;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-button:hover {
  background-color: #5a069c;
}

.export-text {
  margin-left: 5px;
  font-weight: 500;
}

.export-button .icon {
  color: white;
  width: 20px;
}

/* Estilos do Modal */
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
  background-color: white;
  border-radius: 8px;
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
  border-bottom: 1px solid #eee;
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

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  appearance: none;
  background-color: #FFFFFF;
}

.report-type-select {
  padding: 12px 1px;
}

.form-control:focus {
  border-color: #6F08AF;
}

.date-inputs {
  display: flex;
  align-items: center;
}

.date-input-container {
  position: relative;
  flex: 1;
}

.date-input {
  padding: 12px 12px 12px 12px;
  padding-right: 30px;
  height: 50.6px;
  box-sizing: border-box;
  cursor: pointer;
}

.date-separator {
  font-size: 14px;
  color: #666666;
  margin: 0 10px;
  font-family: Nunito;
  width: 19.7px;
  text-align: center;
  display: inline-block;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #6F08AF;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6F08AF;
  font-size: 12px;
  pointer-events: none;
}

.select-container {
  position: relative;
}

.export-button-modal {
  width: 100%;
  padding: 12px;
  background-color: #6F08AF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  font-family: Nunito;
  font-weight: 500;
}

.export-button-modal:hover {
  background-color: #5a069c;
}

.export-button-modal:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Estilos do Seletor de Data */
.date-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100; /* Acima do modal principal */
}

.date-picker-container {
  background-color: #1e2a2e;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.date-picker-header {
  padding: 15px 20px;
  border-bottom: 1px solid #333;
}

.date-picker-header h3 {
  margin: 0;
  color: white;
  font-size: 1rem;
  font-weight: normal;
}

.date-picker-body {
  padding: 20px;
}

.date-picker-input-container {
  margin-bottom: 20px;
}

.date-picker-input {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #000;
  color: #00ff00;
  outline: none;
  box-sizing: border-box;
}

.date-picker-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.date-picker-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  font-family: Nunito;
}

.date-picker-button.confirm {
  background-color: #00ff00;
  color: black;
}

.date-picker-button.cancel {
  background-color: #4a5459;
  color: white;
}
</style>
