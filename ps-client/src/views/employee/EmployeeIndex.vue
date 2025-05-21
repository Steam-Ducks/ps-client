<template>
  <div class="head">

    <div class="Title">
      <h1 class="title-text"> Funcionários </h1>
      <p> Veja abaixo os Funcionários já cadastradas. Para adicionar um novo funcionário, clique no botão + Novo Funcionário. </p>
    </div>

    <div class="buttons">

      <ReportButton>
        <DocumentArrowDownIcon/>
      </ReportButton>

      <button @click="toggleEmployeeView" class="toggle-view-button" :disabled="errorFetchingInactiveEmployees && !showActiveEmployees">
        {{ toggleButtonText }}
      </button>

      <CreateButton @click="showCreateEmployee" class="new-employee-button">
        + Novo funcionário
      </CreateButton>
    </div>
  </div>

  <div v-if="isCreatingEmployee" class="modal">
    <div class="modal-content">
      <EmployeeCreate @go-back="hideCreateEmployee" @employee-created="fetchAllEmployees"/>
    </div>
  </div>

  <div v-if="isEditingEmployee" class="modal">
    <div class="modal-content">
      <EmployeeEdit :id="String(selectedEmployeeId)" @go-back="hideEditEmployee" @employee-updated="fetchAllEmployees"/>
    </div>
  </div>

  <EmployeeList :employees="displayedEmployees" @edit-employee="showEditEmployee"/>


</template>

<script>
import ReportButton from '@/components/ui/ReportButton.vue';
import CreateButton from '@/components/ui/CreateButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import EmployeeCreate from './EmployeeCreate.vue';
import EmployeeEdit from './EmployeeEdit.vue';
import EmployeeList from '@/components/employee/EmployeeList.vue';
import EmployeeService from '@/services/EmployeeService';

export default {
  name: 'EmployeeIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    CreateButton,
    EmployeeCreate,
    EmployeeEdit,
    EmployeeList,
  },
  data() {
    return {
      isCreatingEmployee: false,
      isEditingEmployee: false,
      selectedEmployeeId: null,
      activeEmployees: [],
      inactiveEmployees: [],
      showActiveEmployees: true,
      errorFetchingInactiveEmployees: false,
    };
  },
  mounted() {
    this.fetchAllEmployees();
  },
  computed: {
    displayedEmployees() {
      return this.showActiveEmployees ? this.activeEmployees : this.inactiveEmployees;
    },
    toggleButtonText() {
      if (this.errorFetchingInactiveEmployees && !this.showActiveEmployees) {
        return 'Falha ao carregar inativos';
      }
      return this.showActiveEmployees ? 'Mostrar Funcionários Inativos' : 'Mostrar Funcionários Ativos';
    }
  },
  methods: {
    showCreateEmployee() {
      this.isCreatingEmployee = true;
    },
    hideCreateEmployee() {
      this.isCreatingEmployee = false;
    },
    showEditEmployee(employeeId) {
      this.selectedEmployeeId = employeeId;
      this.isEditingEmployee = true;
    },
    hideEditEmployee() {
      this.isEditingEmployee = false;
      this.selectedEmployeeId = null;
    },

    toggleEmployeeView() {
      this.showActiveEmployees = !this.showActiveEmployees;
      if (!this.showActiveEmployees && (this.inactiveEmployees.length === 0 || this.errorFetchingInactiveEmployees)) {
        this.fetchInactiveEmployees();
      }
    },

    async fetchActiveEmployees() {
      try {
        const data = await EmployeeService.getAllEmployees();
        this.activeEmployees = data;
        this.errorFetchingInactiveEmployees = false; 
      } catch (error) {
        console.error('Erro ao buscar funcionários ativos:', error);
        this.activeEmployees = [];
      }
    },

    async fetchInactiveEmployees() {
      try {
        const data = await EmployeeService.getInactvatedEmployee();
        this.inactiveEmployees = data;
        this.errorFetchingInactiveEmployees = false;
      }catch(error){
        console.error('Erro ao buscar funcionários inativos:', error);
        this.inactiveEmployees = [];
        this.errorFetchingInactiveEmployees = true;
      }
    },

    async fetchAllEmployees() {
      await this.fetchActiveEmployees();
      await this.fetchActiveEmployees();
      await this.fetchInactiveEmployees();
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
}

.title-text {
  color: #6F08AF;
  font-size: 28px;
  margin-bottom: 8px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.new-employee-button {
  background-color: #6F08AF;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
}

.toggle-view-button {
  background-color: #e2e8f0; /* Cor similar ao UserIndex */
  color: #1f2937; /* Cor similar ao UserIndex */
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-view-button:hover {
  background-color: #cbd5e1; /* Cor similar ao UserIndex */
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
  width: 30%;
  max-width: 600px;
  min-height: 300px;
  top: 81px;
  left: 633px;
  border-radius: 20px;
  background-color: #FFFFFF;
  padding: 30px 50px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.Title {
  width: 50%;
}

</style>
