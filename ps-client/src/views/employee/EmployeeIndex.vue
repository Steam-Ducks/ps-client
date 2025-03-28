<template>
    <div class="head">
  
      <div class="Title">
        <h1> Funcionários </h1>
        <p> Veja abaixo os Funcionários já cadastradas. Para adicionar um novo funcionario, clique no botão + Novo Funcionário. </p>
      </div>
  
      <div class="buttons">

        <ReportButton>
          <DocumentArrowDownIcon/>
        </ReportButton> 
         
        <CreateButton @click="showCreateEmployee">
          + Novo Funcionário
        </CreateButton>
      </div>
    </div>
    
    <div v-if="isCeatingEmployee" class="modal">
      <div class="modal-content">
        <EmployeeCreate @go-back="hideCreateEmployee" @employee-created="fetchEmployee"/>
      </div>
    </div>
  
    <EmployeeList :employees="employees"/>
      
    
</template>
  
<script>
  import ReportButton from '@/components/ui/ReportButton.vue';
  import CreateButton from '@/components/ui/CreateButton.vue';
  import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
  import EmployeeCreate from './EmployeeCreate.vue';  
  import EmployeeList from '@/components/employee/EmployeeList.vue';
  import EmployeeService from '@/services/EmployeeService';
  
  export default {
    name: 'EmployeeIndex',
    components: {
      ReportButton,
      DocumentArrowDownIcon,
      CreateButton,
      EmployeeCreate,
      EmployeeList,
    },
    data() {
      return {
        isCeatingEmployee: false,
        employees: [], 
      };
    },
    mounted() {
      this.fetchEmployee(); 
    },
    methods: {
      showCreateEmployee() {
        this.isCeatingEmployee = true;
      },
      hideCreateEmployee() {
        this.isCeatingEmployee = false;
      },
      async fetchEmployee() {
        try {
          const data = await EmployeeService.getAllEmployees(); // Changed the method name to 'getAllEmployees'
          this.employees = data; 
        } catch (error) {
          console.error('Erro ao buscar empresas:', error);
        }
      },
    },
  };
</script>
  
<style scoped>
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .buttons {
      display: flex;
      gap: 10px; 
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
      width: 25%;
      height: 80%;
      top: 81px;
      left: 633px;
      border-radius: 20px;
      background-color: #FFFFFF;
      padding-left: 50px;
      padding-right: 50px;
      padding-bottom:30px;
    }

</style>
