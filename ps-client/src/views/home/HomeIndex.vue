<template>

  <div class="head">
    <div class="Title">
      <h1>Home</h1>
      <p>Olá {{ username }}! Aqui você pode acompanhar as principais métricas e informações do sistema.</p>
    </div>
  </div>

  <div class="filters">
    <div class="date-actions">
      <div class="date-range">
        <label>De:</label>
        <input type="date" v-model="startDate" @change="onDateChange" />
        <label>Até:</label>
        <input type="date" v-model="endDate" @change="onDateChange" />
      </div>
      <div class="actions">
        <CreateButton @click="selectAllCompanies">Selecionar Todos</CreateButton>
        <CreateButton @click="deselectAllCompanies">Desmarcar Todos</CreateButton>
      </div>
    </div>

    <multiselect
        class="multiselect"
        v-model="selectedCompanies"
        :options="companyOptions"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
        :preserve-search="true"
        placeholder="Busque ou selecione empresas..."
        label="name"
        track-by="id"
        :preselect-first="false"
        :show-labels="false"

    />
  </div>

  <div class="loading-overlay" v-if="isLoading">
    <img class="loading" src="../../assets/loading-icon.gif" alt="loading icon">
  </div>

  <div v-else>

    <div class="cards-container">
      <Card
          title="Empresas selecionadas"
          :value="cardData.selectedCompanies"
      />
      <Card
          title="Total de Funcionários"
          :value="cardData.totalEmployees"
          :subtext="cardData.newEmployees > 0 ? `+${cardData.newEmployees} novos neste período` : 'nenhum funcionário novo'"
          :subtext-class="cardData.newEmployees > 0 ? 'success' : 'note'"
      />
      <Card
          title="Folha Salarial"
          :value="`R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cardData.totalSalary)}`"
          :subtext="`Período anterior: R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cardData.totalSalaryLastPeriod)}`"
          subtext-class="note"
      />
    </div>

    <div class="charts-container">
      <div class="chart-box">
        <h2>Horas Trabalhadas</h2>
        <canvas id="workedHoursChart"></canvas>
      </div>

      <div class="chart-box">
        <h2>Novos Funcionários por empresa</h2>
        <canvas id="newEmployeesChart"></canvas>
      </div>
      <!-- removed for now
      <div class="chart-box">
        <h2>Registros de ponto alterados</h2>
        <canvas id="editedTimeRecords"></canvas>
      </div>
    -->

    </div>
  </div>
</template>
<script>
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { ptBR } from 'date-fns/locale';
import Card from '@/components/common/Card.vue';
import UserService from '@/services/UserService';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import CreateButton from "@/components/ui/CreateButton.vue";
import CompanyService from "@/services/CompanyService";
import { debounce } from 'lodash';
import DashboardService from "@/services/DashboardService";

export default {
  name: 'HomeIndex',
  components: {
    CreateButton,
    Card,
    Multiselect
  },
  data() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      isLoading: true,
      username: '',
      selectedCompanies: [],
      companyOptions: [],
      dashboardAll: [],
      cardData: {
        selectedCompanies: 0,
        totalEmployees: 0,
        newEmployees: 0,
        totalSalary: 0,
        totalSalaryLastPeriod: 0
      },
      tempChart: null,
      workedHoursChartInstance: null,
      startDate: firstDay.toISOString().slice(0, 10),
      endDate: lastDay.toISOString().slice(0, 10),
    };
  },
  async mounted() {
    this.username = UserService.getUsername();
    await this.fetchCompanies();
    await this.fetchDashboard(this.startDate, this.endDate);
    this.updateDashboard();
  },
  watch: {
    selectedCompanies: 'updateDashboard'
  },
  methods: {
    loaded() {
      this.isLoading = false;
    },
    async onDateChange() {
      if (this.startDate && this.endDate && new Date(this.endDate) > new Date(this.startDate)) {
        console.log("date updated, fetching for dates:", this.startDate, this.endDate);
        await this.fetchDashboard(this.startDate, this.endDate);
        this.updateDashboard();
      }
    },
    async fetchCompanies() {
      try {
        const companies = await CompanyService.getAllCompanies();
        this.companyOptions = companies.map(({ id, name }) => ({ id, name }));
        this.selectedCompanies = [...this.companyOptions];
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    },
    async fetchDashboard(startDate, endDate) {
      try {
        const response = await DashboardService.getDashboard(startDate, endDate);
        this.dashboardAll = response;
        this.loaded();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
    updateDashboard: debounce(function () {
      const selectedIds = this.selectedCompanies.map(c => c.id);
      const filteredData = this.dashboardAll.filter(entry => selectedIds.includes(entry.companyId));

      const totalEmployees = filteredData.reduce((sum, entry) => sum + (entry.totalEmployees || 0), 0);
      const totalSalary = filteredData.reduce((sum, entry) => sum + (entry.totalSalary || 0), 0);
      const totalSalaryLastPeriod = filteredData.reduce((sum, entry) => sum + (entry.totalSalaryLastPeriod || 0), 0);
      const newEmployees = filteredData.reduce((sum, entry) => {
        const employeeCounts = Object.values(entry.newEmployees || {});
        return sum + employeeCounts.reduce((subSum, count) => subSum + count, 0);
      }, 0);
      this.cardData = {
        selectedCompanies: selectedIds.length,
        totalEmployees,
        newEmployees,
        totalSalary,
        totalSalaryLastPeriod
      };

      this.$nextTick(() => {
        this.renderWorkedHoursChart();
        /* removed for now
        this.renderEditedTimeRecordsChart();
         */
        this.renderNewEmployeesChart();
      });
    }, 500),

    renderWorkedHoursChart() {
      const canvas = document.getElementById('workedHoursChart');
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      if (this.workedHoursChartInstance) {
        this.workedHoursChartInstance.destroy();
        this.workedHoursChartInstance = null;
      }

      const selectedIds = this.selectedCompanies.map(c => c.id);
      const filteredData = this.dashboardAll
          .filter(entry => selectedIds.includes(entry.companyId))
          .sort((a, b) => b.totalWorkedHours - a.totalWorkedHours);

      canvas.height = Math.max(filteredData.length * 18, 200);

      const labels = filteredData.map(entry => {
        const company = this.companyOptions.find(opt => opt.id === entry.companyId);
        return company ? company.name : 'Unknown';
      });

      const rawData = filteredData.map(entry => entry.totalWorkedHours);

      this.workedHoursChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Horas trabalhadas',
            data: rawData,
            backgroundColor: '#6F08AF',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw;
                  const totalMinutes = Math.round(value * 60);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return `${hours}h ${minutes}m`;
                }
              }
            }
          },
          scales: {
            x: { beginAtZero: true, title: { display: true, text: 'Horas trabalhadas (h)' } },
            y: { title: { display: false } }
          },
          animation: {
            duration: 100
          }
        }
      });
    },
    /* removed for now
    renderEditedTimeRecordsChart() {
      const canvas = document.getElementById('editedTimeRecords');
      const hoursChartCanvas = document.getElementById('workedHoursChart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (this.editedTimeRecordsChartInstance) {
        this.editedTimeRecordsChartInstance.destroy();
      }

      canvas.height = hoursChartCanvas ? hoursChartCanvas.height : 300;

      const selectedIds = this.selectedCompanies.map(c => c.id);

      const allDates = new Set();
      this.dashboardAll.forEach(entry => {
        if (!selectedIds.includes(entry.companyId)) return;
        Object.keys(entry.manualChangesByDate || {}).forEach(d => allDates.add(d));
      });

      let newStartDate = new Date(this.startDate);
      newStartDate.setDate(newStartDate.getDate() - 3);
      allDates.add(newStartDate.toISOString().slice(0, 10));

      let newEndDate = new Date(this.endDate);
      newEndDate.setDate(newEndDate.getDate() + 3);
      allDates.add(newEndDate.toISOString().slice(0, 10));

      const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

      const dateInfo = {};
      sortedDates.forEach(date => {
        dateInfo[date] = { total: 0, details: [] };
      });

      this.dashboardAll.forEach(entry => {
        if (!selectedIds.includes(entry.companyId)) return;
        const name = this.companyOptions.find(c => c.id === entry.companyId)?.name || `ID ${entry.companyId}`;
        Object.entries(entry.manualChangesByDate || {}).forEach(([date, count]) => {
          if (!dateInfo[date]) return;
          dateInfo[date].total += count;
          dateInfo[date].details.push({ name, count });
        });
      });

      const data = sortedDates.map(date => ({ x: date, y: dateInfo[date].total }));

      this.editedTimeRecordsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Total de alterações',
            data,
            borderColor: '#6F08AF',
            borderWidth: 3,
            pointRadius: 2.8,
            fill: false,
            tension: 0.15
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'nearest',
              callbacks: {
                title: (items) => {
                  const dateVal = items[0].parsed.x;
                  const dateObj = new Date(dateVal);
                  return dateObj.toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  });
                },
                label: (ctx) => {
                  const dateVal = ctx.parsed.x;
                  const dateKey = new Date(dateVal).toISOString().slice(0, 10);
                  const info = dateInfo[dateKey] || { total: 0 };
                  return `Total: ${info.total}`;
                },
                afterBody: (ctxItems) => {
                  const dateVal = ctxItems[0].parsed.x;
                  const dateKey = new Date(dateVal).toISOString().slice(0, 10);
                  const info = dateInfo[dateKey] || { details: [] };
                  return info.details.map(d => `• ${d.name}: ${d.count}`);
                }
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'yyyy-MM-dd',
                unit: 'day',
                displayFormats: { day: 'dd/MM' }
              },
              adapters: { date: { locale: ptBR } },
              title: { display: true, text: 'Data' },
              min: newStartDate.toISOString().slice(0, 10),
              max: newEndDate.toISOString().slice(0, 10),
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Número de alterações' }
            }
          }
        }
      });
    },*/

    renderNewEmployeesChart() {
      const canvas = document.getElementById('newEmployeesChart');
      const hoursChartCanvas = document.getElementById('workedHoursChart');
      if (!canvas || !hoursChartCanvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (this.newEmployeesChartInstance) {
        this.newEmployeesChartInstance.destroy();
      }

      canvas.height = hoursChartCanvas.height;

      const selectedIds = this.selectedCompanies.map(c => c.id);

      const allDates = new Set();
      this.dashboardAll.forEach(entry => {
        if (!selectedIds.includes(entry.companyId)) return;
        Object.keys(entry.newEmployees || {}).forEach(d => allDates.add(d));
      });

      let newStartDate = new Date(this.startDate);
      newStartDate.setDate(newStartDate.getDate() - 3);
      allDates.add(newStartDate.toISOString().slice(0, 10));

      let newEndDate = new Date(this.endDate);
      newEndDate.setDate(newEndDate.getDate() + 3);
      allDates.add(newEndDate.toISOString().slice(0, 10));

      const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

      const dateInfo = {};
      sortedDates.forEach(date => {
        dateInfo[date] = { total: 0, details: [] };
      });

      this.dashboardAll.forEach(entry => {
        if (!selectedIds.includes(entry.companyId)) return;
        const name = this.companyOptions.find(c => c.id === entry.companyId)?.name || `ID ${entry.companyId}`;
        Object.entries(entry.newEmployees || {}).forEach(([date, count]) => {
          if (!dateInfo[date]) return;
          dateInfo[date].total += count;
          dateInfo[date].details.push({ name, count });
        });
      });

      const data = sortedDates.map(date => ({ x: date, y: dateInfo[date].total }));

      this.newEmployeesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Novos Funcionários',
            data,
            borderColor: '#6F08AF',
            borderWidth: 3,
            pointRadius: 2.8,
            fill: false,
            tension: 0.15
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'nearest',
              callbacks: {
                title: (items) => {
                  const dateVal = items[0].parsed.x;
                  const dateObj = new Date(dateVal);
                  return dateObj.toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  });
                },
                label: (ctx) => {
                  const dateVal = ctx.parsed.x;
                  const dateKey = new Date(dateVal).toISOString().slice(0, 10);
                  const info = dateInfo[dateKey] || { total: 0 };
                  return `Total: ${info.total}`;
                },
                afterBody: (ctxItems) => {
                  const dateVal = ctxItems[0].parsed.x;
                  const dateKey = new Date(dateVal).toISOString().slice(0, 10);
                  const info = dateInfo[dateKey] || { details: [] };
                  return info.details.map(d => `• ${d.name}: ${d.count}`);
                }
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              offset: true,
              time: {
                parser: 'yyyy-MM-dd',
                unit: 'day',
                displayFormats: { day: 'dd/MM' }
              },
              adapters: { date: { locale: ptBR } },
              title: { display: true, text: 'Data' },
              min: newStartDate.toISOString().slice(0, 10),
              max: newEndDate.toISOString().slice(0, 10)
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Número de Novos Funcionários' },
              ticks: {
                stepSize: 1,
              }
            }
          }
        }
      });
    },
    selectAllCompanies() {
      this.selectedCompanies = [...this.companyOptions];
    },
    deselectAllCompanies() {
      this.selectedCompanies = [];
    }
  }
};
</script>


<style scoped>



.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #6F08AF;
}

.Title {
  width: 80%;
}

.Title h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.Title p {
  font-size: 16px;
}

.date-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.date-range {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.date-range input[type="date"] {
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.filters {
  margin-bottom: 1.5rem;
}

.filters label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filters select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.filters .actions {
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cards-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.charts-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.chart-box {
  flex: 1 1 45%;
  background-color: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

canvas {
  max-width: 100%;
  height: auto;
  max-height: 500px;
}

.multiselect {
  width: 100%;
}

:deep(.multiselect__tags) {
  min-height: 20px;
  border-radius: 6px;
  border: 1px solid #6F08AF;
  padding: 0.25rem 0.5rem;
  max-height: 80px;
  overflow-y: auto;
}
:deep(.multiselect__tag) {
  background-color: #f6e9fa;
  color: #6F08AF;
  border: 1px solid #6F08AF;
  font-weight: bold;
}

:deep(.multiselect__option--highlight) {
  background-color: #fcf8ff;
  color: #6F08AF;
}

:deep(.multiselect__option--selected) {
  background-color: #f6f1fd;
  color: #6F08AF;
}


</style>
