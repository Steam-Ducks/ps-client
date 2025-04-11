<template>

<div class="head">
  
  <div class="Title">
    <h1> Espelho de ponto </h1>
    <p> Acompanhe abaixo os registros de ponto dos funcionários. Para visualizar os registros de um colaborador específico, selecione-o na barra abaixo. </p>
  </div>

  <div class="tools">
    <select class="search" ref="employeeSelect" v-model="selectedEmployeeId">
        <option 
            v-for="employee in employeeslist" 
            :key="employee.id" 
            :value="employee.id"
        >
             {{ employee.name }}
        </option>
    </select>

    <ReportButton>
      <DocumentArrowDownIcon/>
    </ReportButton>

    <label for="start-date">Início</label>
    <input type="date" id="start-date" v-model="startDate"/>

    <label for="end-date">Fim</label>
    <input type="date" id="end-date" v-model="endDate"/>

    <button @click="searchTimeRecords">
        Buscar
    </button>
    </div>

    <div v-if="selectedEmployee">
        <div class="info">

            <div class="Employee"> 
                <img 
                    :src="selectedEmployee.photo" 
                    :alt="'Foto de ' + selectedEmployee.name" 
                    class="employee-photo"
                >
                <div class="employee-details">
                <p class="employee-name">{{ selectedEmployee.name }}</p>
                <p>{{ selectedEmployee.position.name }}</p>
                </div>
            </div>
            
            <div class="total">
                <div class="total-column"> 
                    <p class="val">{{ selectedEmployee.id }} </p>
                    <p class="label">Total Trabalhado</p>
                </div>
                <div class="total-column"> 
                    <p class="val">{{ selectedEmployee.id }} </p>
                    <p class="label">Faltas</p>
                </div>
                <div class="total-column"> 
                    <p class="val">{{ selectedEmployee.id }} </p>
                    <p class="label">Faltas justificadas</p>
                </div>
                <div class="total-column"> 
                    <p class="val">{{ formatCurrency(selectedEmployee.salary) }} </p>
                    <p class="label">A receber</p>
                </div>
                <div class="total-column"> 
                    <p class="val">{{ formatCurrency(selectedEmployee.salary) }} </p>
                    <p class="label">Salário/hora</p>
                </div>
            </div>
        </div>

        <div class="apontamento">
            <table>
                <thead>
                    <th>Data</th>
                    <th>Turno</th>
                    <th>Horas previstas</th>
                    <th>Entrada 1</th>
                    <th>Saída 1</th>
                    <th>Saída 2</th>
                    <th>Saída 2</th>
                    <th>Total trabalhado</th>
                </thead>
            </table>
        </div>
    </div>
   
    <div class="default" v-else>
        Selecione um funcionário para visualizar os apontamentos
    </div>

</div>
</template>

<script>

import ReportButton from '@/components/ui/ReportButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import EmployeeService from '@/services/EmployeeService'; 
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.css'; 

export default {
  name: 'TimeRecordIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
  },
  data() {
    return {
      employees: [],
      selectedEmployeeId: "",
      selectedEmployee: null,
      startDate: '', 
      endDate: '',  
      timeRecords: [],
    };
  },
  computed: {
    employeeslist() {
      return this.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
      }));
    },
  },
  methods: {
        async searchTimeRecords() {
            
        if (!this.selectedEmployeeId) {
            alert('Por favor, selecione um funcionário.');
            return;
        }
        this.selectedEmployee = null;
        try {
            this.selectedEmployee = await EmployeeService.getEmployeeById(this.selectedEmployeeId);
        } catch (error) {
            console.error('Erro ao buscar dados do espelho de ponto:', error);
            alert('Erro ao buscar dados. Verifique o console.');
            this.selectedEmployee = null;
        } finally {
        }
        },
        formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
        }
    },
  
  async mounted() {
    this.employees = await EmployeeService.getAllEmployees();
    this.$nextTick(() => {
        const selectElement = $(this.$refs.employeeSelect);

        selectElement.select2({
        placeholder: '🔎 Selecione um funcionário',
        }).on('change', (e) => {
          this.selectedEmployeeId = e.target.value;
        });
        }
    )}
};
</script>

<style>

    .head{
        padding-top: 5px;
    }

    .search{
        width: 40%;
        height: 35px;
        border-radius: 5px;
    }

    .tools{
        display: flex;
        align-items: center;
        gap: 1%;
    }

    .info{
        display: flex;
        gap: 1%;
    }

    .Employee{
        width: 250px;
        Height: 80px;
        background-color: #F1D4FCCC;
        border-radius: 10px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 7%;
        padding-left: 1%;
        color: #6F08AF;
    }

    .employee-photo{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .employee-details p{
        margin-top: 0; 
        margin-bottom: 0;
        line-height: 1.2;
    }

    .employee-name{
        font-weight: bold;
    }

    .total{
        width: 700px;
        Height: 70px;
        background-color: #5b007d;
        border-radius: 10px;
        margin-top: 8px;
        display: grid;
        grid-template-columns: repeat(5, 1fr); 
        gap: 4px; 
        padding: 5px; 
        align-items: center; 
    }

    .total-column{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
    }

    .total-column p{
        margin-top: 0; 
        margin-bottom: 0;
        line-height: 1.2;
    }

    .val{
        font-weight: bold;
        font-size: 23px;
    }

    .label{
        padding-top:3px;
        font-size: 12px;
    }

    table{
        margin-top: 3%;
        width: 100%;
        border-collapse: collapse;
    }

    th{
        width:12.5%;
        text-align: center;
        border-bottom: 1px solid #71009a;
    }
    
    .default{
        width: 100%;
        padding-top: 2%
    }

</style>