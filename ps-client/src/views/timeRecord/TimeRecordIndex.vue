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

    <label for="start-date">Início</label>
    <input type="date" id="start-date" v-model="startDate"/>

    <label for="end-date">Fim</label>
    <input type="date" id="end-date" v-model="endDate"/>

    <ReportButton @click="searchTimeRecords">
        <MagnifyingGlassIcon/>
    </ReportButton>

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
                    <p class="val">{{ totalWorkedPeriod }}</p>
                    <p class="label">Total trabalhado no período</p>
                </div>
                <div class="total-column">
                    <p class="val">{{ totalSalaryPeriod }}</p> 
                    <p class="label">Total a receber no período</p>
                </div>
                <div class="total-column"> 
                    <p class="val"> {{formatCurrency( selectedEmployee.salary )}} </p>
                    <p class="label">Salario/hora</p>
                </div>
            </div>

            <div>
                <div style="margin: 10px">
                    <ReportButton>
                        <DocumentArrowDownIcon/>
                    </ReportButton>
                </div>
                <div style="display: flex; gap: 3%; margin-left: 5px;">
                    <button @click="removeColuna">
                        -
                    </button>
                    <button @click="adicionaColuna">
                        +
                    </button>
                </div>
            </div>
        </div>

        <div class="apontamento">
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Entrada 1</th>
                        <th>Saída 1</th>
                        <th v-if="hasAnyEntrada2 || marcacaoCount > 0">Entrada 2</th>
                        <th v-if="hasAnyEntrada2 || marcacaoCount > 0">Saída 2</th>
                        <th v-if="hasAnyEntrada3 || marcacaoCount > 1">Entrada 3</th>
                        <th v-if="hasAnyEntrada3 || marcacaoCount > 1">Saída 3</th>
                        <th>Total trabalhado</th>
                        <th>Total a receber</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="processedTimeRecords.length === 0">
                        <td :colspan="3 + (hasAnyEntrada2 ? 2 : 0) + (hasAnyEntrada3 ? 2 : 0) + 2" style="text-align: center;">Nenhum registro encontrado para o período selecionado.</td>
                    </tr>
                    <tr v-for="(record, index) in processedTimeRecords" :key="index">
                        <td class="data">
                            {{ record.date }}
                        </td>
                        <td class="marcacao">
                            <input class="ponto" :value="record.entrada1 ?? '--:--'"/>
                        </td>
                        <td class="marcacao">
                            <input class="ponto" :value="record.saida1 ?? '--:--'"/>
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada2 || marcacaoCount > 0">
                            <input class="ponto" :value="record.entrada2 ?? '--:--'"/>
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada2 || marcacaoCount > 0">
                            <input class="ponto" :value="record.saida2 ?? '--:--'"/>
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada3 || marcacaoCount > 1">
                            <input class="ponto" :value="record.entrada3 ?? '--:--'"/>
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada3 || marcacaoCount > 1">
                            <input class="ponto" :value="record.saida3 ?? '--:--'"/>
                        </td>
                        <td class="total-trabalhado">
                            {{ record.totalTrabalhadoDia }}
                        </td>
                        <td class="total-trabalhado">
                            {{ record.totalSalaryDay }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="footer">
            <button class="save">
                salvar
            </button>
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
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import EmployeeService from '@/services/EmployeeService'; 
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.css'; 

export default {
  name: 'TimeRecordIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
  },
  data() {
    return {
      employees: [],
      selectedEmployeeId: "",
      selectedEmployee: null,
      startDate: '', 
      endDate: '',  
      timeRecords: [],
      processedTimeRecords: [],
      marcacaoCount: 0,
    };
  },
  computed: {
    // Lista os funcionarios no select
    employeeslist() {
      return this.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
      }));
    },
    hasAnyEntrada2() {
        return this.processedTimeRecords.some(record => record.entrada2);
    },
    hasAnyEntrada3() {
        return this.processedTimeRecords.some(record => record.entrada3);
    },

    // Calcula o total de horas trabalhadas no período selecionado
    totalWorkedPeriod() {
      if (!this.processedTimeRecords || this.processedTimeRecords.length === 0) {
        return '00:00';
      }

      const totalMinutes = this.processedTimeRecords.reduce((sum, record) => {
        const parts = record.totalTrabalhadoDia.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (!isNaN(hours) && !isNaN(minutes)) {
            return sum + (hours * 60) + minutes;
        }
        return sum;
      }, 0); // Valor inicial da soma é 0

      // Converte o total de minutos de volta para HH:MM
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    },

    // Calcula o salário total a receber no período selecionado
    totalSalaryPeriod() {
        if (!this.processedTimeRecords || this.processedTimeRecords.length === 0 || !this.selectedEmployee) {
            return this.formatCurrency(0); // Retorna R$ 0,00 se não houver dados
        }

        const totalSalary = this.processedTimeRecords.reduce((sum, record) => {
            // Remove 'R$', espaços e troca vírgula por ponto para converter para número
            const numericValue = parseFloat(record.totalSalaryDay.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
            if (!isNaN(numericValue)) {
                return sum + numericValue;
            }
            return sum;
        }, 0); // Valor inicial da soma é 0

        return this.formatCurrency(totalSalary);
    }
  },
  
  methods: {

    // Seleciona o funcionáro e busca os pontos
    async searchTimeRecords() {

        if (!this.selectedEmployeeId) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, selecione um funcionário',
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        // Reseta o estado antes de buscar novos dados
        this.selectedEmployee = null;
        this.timeRecords = [];
        this.processedTimeRecords = [];

        try {

            this.selectedEmployee = await EmployeeService.getEmployeeById(this.selectedEmployeeId);

            // Busca todos os pontos
                const responseData = [
                    { "id": 1, "dateTime": "2025-01-10T08:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 2, "dateTime": "2025-01-10T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 2, "dateTime": "2025-01-10T18:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 2, "dateTime": "2025-01-10T19:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 3, "dateTime": "2025-01-11T08:15:00", "isEdited": true, "employeeId": 87 },
                    { "id": 4, "dateTime": "2025-01-11T17:10:00", "isEdited": false, "employeeId": 87 },
                    { "id": 5, "dateTime": "2025-01-12T08:05:00", "isEdited": false, "employeeId": 87 },
                    { "id": 6, "dateTime": "2025-01-12T16:55:00", "isEdited": false, "employeeId": 87 },
                    { "id": 7, "dateTime": "2025-01-13T08:10:00", "isEdited": true, "employeeId": 87 },
                    { "id": 8, "dateTime": "2025-01-13T17:05:00", "isEdited": false, "employeeId": 87 },
                    { "id": 9, "dateTime": "2025-01-14T08:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 10, "dateTime": "2025-01-14T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 11, "dateTime": "2025-01-15T08:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 12, "dateTime": "2025-01-15T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 13, "dateTime": "2025-01-16T08:10:00", "isEdited": false, "employeeId": 87 },
                    { "id": 14, "dateTime": "2025-01-16T17:10:00", "isEdited": false, "employeeId": 87 },
                    { "id": 15, "dateTime": "2025-01-17T08:20:00", "isEdited": true, "employeeId": 87 },
                    { "id": 16, "dateTime": "2025-01-17T17:15:00", "isEdited": false, "employeeId": 87 },
                    { "id": 17, "dateTime": "2025-01-18T08:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 18, "dateTime": "2025-01-18T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 19, "dateTime": "2025-01-19T08:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 20, "dateTime": "2025-01-19T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 21, "dateTime": "2025-01-20T08:05:00", "isEdited": false, "employeeId": 87 },
                    { "id": 22, "dateTime": "2025-01-20T16:55:00", "isEdited": false, "employeeId": 87 },
                    { "id": 23, "dateTime": "2025-01-21T08:10:00", "isEdited": false, "employeeId": 87 },
                    { "id": 24, "dateTime": "2025-01-21T17:05:00", "isEdited": false, "employeeId": 87 },
                    { "id": 25, "dateTime": "2025-01-22T08:00:00", "isEdited": true, "employeeId": 87 },
                    { "id": 26, "dateTime": "2025-01-22T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 27, "dateTime": "2025-01-23T08:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 28, "dateTime": "2025-01-23T17:00:00", "isEdited": false, "employeeId": 87 },
                    { "id": 29, "dateTime": "2025-01-24T08:10:00", "isEdited": false, "employeeId": 87 },
                    { "id": 30, "dateTime": "2025-01-24T17:10:00", "isEdited": false, "employeeId": 87 },
                    { "id": 31, "dateTime": "2025-01-25T08:20:00", "isEdited": true, "employeeId": 87 },
                    { "id": 32, "dateTime": "2025-01-25T17:15:00", "isEdited": false, "employeeId": 87 }
                ];

                this.timeRecords = responseData;

            // Filtra os pontos que foram obtidos
                this.timeRecords = responseData.filter(record => {
                    
                    const matchesEmployee = record.employeeId == 87; //Depois trocar para o selectedEmployeeId 

                    // Pega os primeiros 10 caracteres de dateTime yyyy-mm-dd
                    const recordDateStr = record.dateTime.substring(0, 10);

                    // Filtra as datas entre maior ou igual a startDate e menor ou igual a endDate
                    const matchesStartDate = !this.startDate || recordDateStr >= this.startDate;
                    const matchesEndDate = !this.endDate || recordDateStr <= this.endDate;

                    return matchesEmployee && matchesStartDate && matchesEndDate;
                });

            // Variável com os dados filtrados
            this.processedTimeRecords = this.processRecordsForTable(this.timeRecords);


        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao buscar dados',
                text: error?.response?.data?.message || error.message,
                showConfirmButton: false,
                timer: 3500,
            });
            console.error("Erro em searchTimeRecords:", error);
            this.selectedEmployee = null;
            this.timeRecords = [];
            this.processedTimeRecords = [];
        }
    },

    // Trata os pontos para aparecerem na tabela
    processRecordsForTable(records) {
        try {
            // Junta os pontos que foram feitos no mesmo dia
            const groupedByDate = records.reduce((acc, record) => {

                // Verifica se é uma string com o dia, se não for ignora
                if (!record || typeof record.dateTime !== 'string' || record.dateTime.length < 10) {
                    return acc;
                }

                // Armazena a parte da data do datetime yyyy-mm-dd
                const dateStr = record.dateTime.substring(0, 10);
                if (!acc[dateStr]) {
                    acc[dateStr] = [];
                }

                // Retorna o acumulador atualizado para a próxima iteração.
                acc[dateStr].push(record);
                return acc;
            },{});

            // Separa as horas das marcações
            const tableRows = Object.keys(groupedByDate)
                // Para cada registro em um mesmo dia, deixa em ordem crescente
                .map(dateStr => {
                    const dailyRecords = groupedByDate[dateStr].sort((a, b) =>
                        new Date(a.dateTime) - new Date(b.dateTime) 
                    );

                    // Cria a linha para a tabela
                    const row = {
                        date: this.formatDate(dateStr),
                        entrada1: dailyRecords[0] ? this.formatTime(dailyRecords[0].dateTime) : null,
                        saida1:   dailyRecords[1] ? this.formatTime(dailyRecords[1].dateTime) : null,
                        entrada2: dailyRecords[2] ? this.formatTime(dailyRecords[2].dateTime) : null,
                        saida2:   dailyRecords[3] ? this.formatTime(dailyRecords[3].dateTime) : null,
                        entrada3: dailyRecords[4] ? this.formatTime(dailyRecords[4].dateTime) : null,
                        saida3:   dailyRecords[5] ? this.formatTime(dailyRecords[5].dateTime) : null,
                        totalTrabalhadoDia: this.calculateDayWorked(dailyRecords),
                        totalSalaryDay: this.calculateDaySalary(dailyRecords),
                    };
                    return row;
                })
                // Função para ordenar datas
                .sort((a, b) => {
                    try {
                        // separa as datas em variaveis diferentes pra comparação
                        const datePartsA = a.date.split('/');
                        const datePartsB = b.date.split('/');

                         // Cria objetos Date no formato YYYY-MM-DD
                        const dateA = new Date(`${datePartsA[2]}-${datePartsA[1]}-${datePartsA[0]}`);
                        const dateB = new Date(`${datePartsB[2]}-${datePartsB[1]}-${datePartsB[0]}`);

                         // Compara as datas. Retorna negativo se A < B, positivo se A > B, 0 se A == B.
                        return dateA - dateB;
                        
                    } catch (sortError) {
                            return 0;
                    }
                });
            return tableRows;

        } catch (error) {
            return [];
        }
    },

    adicionaColuna(){
        if(this.marcacaoCount < 2){
            this.marcacaoCount++
        }
    },

    removeColuna(){
        if (this.marcacaoCount > 0) {
            this.marcacaoCount--;
        }
    },

    // Reorganiza a data para exibição
    formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    },

    // Pega o dateTime do array e retorna apenas as horas
    formatTime(dateTimeString) {
        return dateTimeString.substring(11, 16);
    },

    // Calcula o tempo trabalhado
    calculateDayWorked(dailyRecords) {
        let totalMillis = 0;
        // Calcula período 1 (Entrada 1 - Saída 1)
        if (dailyRecords[0] && dailyRecords[1]) {
            totalMillis += new Date(dailyRecords[1].dateTime) - new Date(dailyRecords[0].dateTime);
        }
        // Calcula período 2 (Entrada 2 - Saída 2)
        if (dailyRecords[2] && dailyRecords[3]) {
            totalMillis += new Date(dailyRecords[3].dateTime) - new Date(dailyRecords[2].dateTime);
        }
        // Calcula período 3 (Entrada 3 - Saída 3)
        if (dailyRecords[4] && dailyRecords[5]) {
            totalMillis += new Date(dailyRecords[5].dateTime) - new Date(dailyRecords[4].dateTime);
        }
        if (totalMillis <= 0) return '00:00';
        
        // Converte a soma das horas para a formatação correta
        const totalSeconds = Math.floor(totalMillis / 1000);    
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    },

    calculateDaySalary(dailyRecords) {   
        let totalMillis = 0;
        // Calcula período 1 (Entrada 1 - Saída 1)
        if (dailyRecords[0] && dailyRecords[1]) {
            totalMillis += new Date(dailyRecords[1].dateTime) - new Date(dailyRecords[0].dateTime);
        }
        // Calcula período 2 (Entrada 2 - Saída 2)
        if (dailyRecords[2] && dailyRecords[3]) {
            totalMillis += new Date(dailyRecords[3].dateTime) - new Date(dailyRecords[2].dateTime);
        }
        // Calcula período 3 (Entrada 3 - Saída 3)
        if (dailyRecords[4] && dailyRecords[5]) {
            totalMillis += new Date(dailyRecords[5].dateTime) - new Date(dailyRecords[4].dateTime);
        }
        if (totalMillis <= 0) return '00:00';

        
        const totalSeconds = Math.floor(totalMillis / 1000);    
        const hours = totalSeconds / 3600;
        const salary = hours * this.selectedEmployee.salary;
        return this.formatCurrency(salary);
    },

    // Converte o dinheiro em reais
        formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
        },
  },
  
  async mounted() {
    // Busca todos os funcionários
    this.employees = await EmployeeService.getAllEmployees();

    // Transforma o select em select2
    this.$nextTick(() => {
        const selectElement = $(this.$refs.employeeSelect);

        selectElement.select2({
        placeholder: '🔎 Selecione um funcionário',
        }).on('change', (e) => {
          this.selectedEmployeeId = e.target.value;
        });
    })
  },

  watch: {
    processedTimeRecords: {
      handler(newRecords) {
        const hasEntrada3 = newRecords.some(record => record.entrada3);
        const hasEntrada2 = newRecords.some(record => record.entrada2);

        if (hasEntrada3) {
          this.marcacaoCount = 2;
        } else if (hasEntrada2) {
          this.marcacaoCount = 1;
        } else {
          this.marcacaoCount = 0;
        }
      },
      immediate: true, 
    }
  },
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
        color: inherit;
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
        grid-template-columns: repeat(3, 1fr); 
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

    .data{
        width:12.5%;
        text-align: center;
    }

    .Previsto{
        width:12.5%;
        text-align: center;
    }

    .marcacao{
        width:12.5%;
        text-align: center;
    }

    .total-trabalhado{
        width:12.5%;
        text-align: center;
    }

    .ponto {
        border: none; 
        width: 100%;
        text-align: center;
        font-family: inherit;
        box-shadow: none;
    }

    .save{
        border: 5px;
        padding: 0.7%;
        border-radius: 10%;
        background-color:#5b007d;
        color: white;
    }

    .footer{
        padding-left: 3%;
        padding-top: 10px;
    }

    input[type="date"]{
        height: 25px;
        border-radius: 5px;
        font-size: 16px;
        font-family: inherit;
        color: inherit;
        box-shadow: none;
    }
</style>
