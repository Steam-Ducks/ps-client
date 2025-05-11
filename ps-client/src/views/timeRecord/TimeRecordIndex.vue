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
                        <div class="button-coluna" @click="removeColuna">
                            -
                        </div>
                        <div class="button-coluna" @click="adicionaColuna">
                            +
                        </div>
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="processedTimeRecords.length === 0">
                        <td :colspan="3 + (hasAnyEntrada2 ? 2 : 0) + (hasAnyEntrada3 ? 2 : 0) + 2" style="text-align: center;">Nenhum registro encontrado para o período selecionado.</td>
                    </tr>
                    <tr v-for="(record, index) in processedTimeRecords" :key="index">
                        <td class="data" nome="date" :value="record.date">
                            {{ record.date }}
                        </td>
                        <td class="marcacao">
                            <input class="ponto" 
                                :value="record.entrada1 ?? '--:--'" 
                                :id="record.id1"
                                @keyup.enter="handleTimeUpdate($event, record.id1, record.originalDate)"
                                v-imask="timeMask"
                                
                            />
                        </td>
                        <td class="marcacao">
                            <input class="ponto" 
                                :value="record.saida1 ?? '--:--'" 
                                :id="record.id2"
                                @keyup.enter="handleTimeUpdate($event, record.id2, record.originalDate)"
                                v-imask="timeMask"
                            />
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada2 || marcacaoCount > 0">
                            <input class="ponto" 
                                :value="record.entrada2 ?? '--:--'" 
                                :id="record.id3"
                                @keyup.enter="handleTimeUpdate($event, record.id3, record.originalDate)"
                                v-imask="timeMask"
                            />
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada2 || marcacaoCount > 0">
                            <input class="ponto" 
                                :value="record.saida2 ?? '--:--'" 
                                :id="record.id4"
                                @keyup.enter="handleTimeUpdate($event, record.id4, record.originalDate)"
                                v-imask="timeMask"
                            />
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada3 || marcacaoCount > 1">
                            <input class="ponto" 
                                :value="record.entrada3 ?? '--:--'" 
                                :id="record.id5"
                                @keyup.enter="handleTimeUpdate($event, record.id5, record.originalDate)"
                                v-imask="timeMask"
                            />
                        </td>
                        <td class="marcacao"  v-if="hasAnyEntrada3 || marcacaoCount > 1">
                            <input class="ponto" 
                                :value="record.saida3 ?? '--:--'" 
                                :id="record.id6"
                                @keyup.enter="handleTimeUpdate($event, record.id6, record.originalDate)"
                                v-imask="timeMask"
                            />
                        </td>
                        <td class="total-trabalhado">
                            {{ record.totalTrabalhadoDia }}
                        </td>
                        <td class="total-trabalhado">
                            {{ record.totalSalaryDay }}
                        </td>
                        <td class="registro-edicao" v-if="record.isEdited">
                            <div class="edited-indicator" @click="showCreateEmployee">
                                <span class="tooltip-text">Este registro foi editado.</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="default" v-else>
        Selecione um funcionário para visualizar os apontamentos
    </div>

 </div>

 <div v-if="isCheckingHistory" class="modal">
    <div class="modal-content">
      <EmployeeEdit :id="String(selectedEmployeeId)" @go-back="hideEditEmployee"/>
    </div>
  </div>
</template>

<script>

import ReportButton from '@/components/ui/ReportButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import EmployeeService from '@/services/EmployeeService'; 
import TimeRecordService from '@/services/TimeRecordService';
import EmployeeEdit from './TimeRecordHistory.vue';
import { IMaskDirective } from 'vue-imask';
import IMask from 'imask';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.css'; 

export default {
  name: 'TimeRecordIndex',
  directives: {
    imask: IMaskDirective
  },
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    EmployeeEdit,
  },
  data() {
    return {
      isCheckingHistory: false,
      employees: [],
      selectedEmployeeId: "",
      selectedEmployee: null,
      startDate: '', 
      endDate: '',  
      processedTimeRecords: [],
      marcacaoCount: 0,
      timeMask: {
        mask: 'HH:MM',
        lazy: false, 
        blocks: {
          HH: {
            mask: IMask.MaskedRange, 
            from: 0,
            to: 23,
            maxLength: 2,
            autofix: true, 
            placeholderChar: '-', 
          },
          MM: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 59,
            maxLength: 2,
            autofix: true,
            placeholderChar: '-',
          },
        },
      },
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
    showCreateEmployee() {
      this.isCheckingHistory = true;
    },
    hideEditEmployee() {
      this.isCheckingHistory = false;
    },

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
        this.processedTimeRecords = [];

        try {
            
            // Busca o funcionário
            this.selectedEmployee = await EmployeeService.getEmployeeById(this.selectedEmployeeId);

            // Busca os pontos dos funcionários já passando os parâmetros desejados
            const filteredRecordsFromBackend = await TimeRecordService.getTimeRecords(
                this.selectedEmployeeId,
                this.startDate,
                this.endDate
            );
            this.processedTimeRecords = this.processRecordsForTable(filteredRecordsFromBackend);

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
            this.processedTimeRecords = [];
        }
    },

    // Trata os pontos para aparecerem na tabela
    processRecordsForTable(records) {

        try {
            const groupedByDate = records.reduce((acc, record) => {
                if (!record || typeof record.dateTime !== 'string' || record.dateTime.length < 10) {
                    return acc;
                }
                const dateStr = record.dateTime.substring(0, 10);
                if (!acc[dateStr]) {
                    acc[dateStr] = [];
                }
                acc[dateStr].push(record);
                return acc;
            }, {});

            const allDatesInRange = [];
            let currentDate = new Date(this.startDate + 'T00:00:00');
            const finalDate = new Date(this.endDate + 'T00:00:00');

            if (isNaN(currentDate.getTime()) || isNaN(finalDate.getTime())) {
                 console.error("Datas de início ou fim inválidas:", this.startDate, this.endDate);
                 this.processedTimeRecords = []; 
                 return [];
            }

            while (currentDate <= finalDate) {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                allDatesInRange.push(`${year}-${month}-${day}`);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const tableRows = allDatesInRange.map(dateStr => {
                const dailyRecords = groupedByDate[dateStr] || []; 

                // Ordena os registros do dia
                if (dailyRecords.length > 0) {
                    dailyRecords.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
                }

                // Cria a linha para a tabela
                const row = {
                    originalDate: dateStr, 
                    date: this.formatDate(dateStr),
                    entrada1: dailyRecords[0] ? this.formatTime(dailyRecords[0].dateTime) : null,
                    id1: dailyRecords[0] ? dailyRecords[0].id : null,
                    saida1:   dailyRecords[1] ? this.formatTime(dailyRecords[1].dateTime) : null,
                    id2: dailyRecords[1] ? dailyRecords[1].id : null,
                    entrada2: dailyRecords[2] ? this.formatTime(dailyRecords[2].dateTime) : null,
                    id3: dailyRecords[2] ? dailyRecords[2].id : null,
                    saida2:   dailyRecords[3] ? this.formatTime(dailyRecords[3].dateTime) : null,
                    id4: dailyRecords[3] ? dailyRecords[3].id : null,
                    entrada3: dailyRecords[4] ? this.formatTime(dailyRecords[4].dateTime) : null,
                    id5: dailyRecords[4] ? dailyRecords[4].id : null,
                    saida3:   dailyRecords[5] ? this.formatTime(dailyRecords[5].dateTime) : null,
                    id6: dailyRecords[5] ? dailyRecords[5].id : null,
                    // Calcula totais (funções devem tratar array vazio)
                    totalTrabalhadoDia: this.calculateDayWorked(dailyRecords),
                    totalSalaryDay: this.calculateDaySalary(dailyRecords),

                    // Verifica se algum dos registros do dia foi editado
                    isEdited: dailyRecords.some(record => record.isEdit === true),

                };
                return row;
            });

            return tableRows;

        } catch (error) {
            console.error("Erro ao processar registros para a tabela:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao processar dados',
                text: 'Ocorreu um erro ao preparar os dados para exibição.',
                showConfirmButton: true,
            });
            this.processedTimeRecords = [];
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

    async handleTimeUpdate(event, recordId, recordDate) {

        const newTimeValue = event.target.value.trim();

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(newTimeValue)) {
            Swal.fire({
                icon: 'error',
                title: 'Formato inválido',
                text: 'Por favor, insira a hora no formato HH:MM (ex: 08:30).',
                timer: 2500,
                showConfirmButton: false
            });

            return;
        }

        const newDateTime = `${recordDate}T${newTimeValue}:00`;

        Swal.fire({
            title: 'Atualizando...',
            text: 'Aguarde enquanto o registro é atualizado.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try{
          if (recordId) {

            await TimeRecordService.updateTimeRecord(recordId, { dateTime: newDateTime });

            Swal.fire({
                icon: 'success',
                title: 'Ponto atualizado!',
                showConfirmButton: false,
                timer: 1500
            });

            }else {

                const newRecordData = {
                    employeeId: this.selectedEmployeeId, 
                    dateTime: newDateTime
                };
                await TimeRecordService.createTimeRecord(newRecordData);
                Swal.fire({
                    icon: 'success',
                    title: 'Ponto registrado!',
                    showConfirmButton: false,
                    timer: 1500
                });

            }

            await this.searchTimeRecords();

        }catch(error){
            console.error("Erro ao atualizar o registro de ponto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar',
                text: error?.response?.data?.message || 'Não foi possível atualizar o registro.',
                showConfirmButton: true 
            });
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
        width:10.6%;
        text-align: center;
        border-bottom: 1px solid #71009a;
    }
    
    .default{
        width: 100%;
        padding-top: 2%
    }

    .data{
        width:10.6%;
        text-align: center;
    }

    .Previsto{
        width:10.6%;
        text-align: center;
    }

    .marcacao{
        width:10.6%;
        text-align: center;
    }

    .total-trabalhado{
        width:10.6%;
        text-align: center;
    }

    .registro-edicao {
        width: 4%;
        text-align: center;
        vertical-align: middle; 
    }

    .registro-edicao div {
        width: 15px;
        height: 15px;
        background-color: #fff269;
        display: inline-block;
        vertical-align: middle;
        border-radius: 100%;
    }

    .edited-indicator {
        position: relative;
        display: inline-block;
        cursor: pointer; 
    }

    .tooltip-text {
        visibility: hidden; 
        width: 150px; 
        background-color: rgba(0, 0, 0, 0.7);    
        font-size: small;
        color: white;   
        text-align: center;     
        border-radius: 5px;     
        padding: 10px 15px;   
        position: absolute;     
        z-index: 1;     
        bottom: 125%;   
        left: 50%;  
        transform: translateX(-50%);        
        opacity: 0; 
        transition: opacity 0.3s ease; 
    }

    .edited-indicator:hover .tooltip-text {
        visibility: visible; 
        opacity: 1;
        
    }

    .ponto {
        border: none; 
        width: 100%;
        text-align: center;
        font-family: inherit;
        box-shadow: none;
    }

    input[type="date"]{
        height: 25px;
        border-radius: 5px;
        font-size: 16px;
        font-family: inherit;
        color: inherit;
        box-shadow: none;
        border: solid 1px;
    }

    .button-coluna{
        width: 25px;
        height: 25px;
        background-color: #5b007d;
        border-radius: 20%;
        color: white;
        cursor: pointer;
        text-align: center
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

</style>
