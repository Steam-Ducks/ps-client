<template>
    <div class="head">
      <div class="Title">
        <h1> Cargos </h1>
        <p> Veja abaixo os cargos já cadastrados. Para adicionar ou editar um cargo, clique no botão + Novo Cargo. </p>
      </div>
  
      <div class="buttons">
        <ReportButton>
          <DocumentArrowDownIcon/>
        </ReportButton> 
  
        <CreateButton @click="showCreateOrEditCargo">
          + Novo Cargo
        </CreateButton>
      </div>
    </div>
  
    <div v-if="isCreatingOrEditingCargo" class="modal">
      <div class="modal-content">
        <CargoCreateOrEdit 
          :cargo="selectedCargo" 
          @go-back="hideCreateOrEditCargo" 
          @cargo-created="fetchCargos" 
          @cargo-updated="fetchCargos"
        />
      </div>
    </div>
  
    <CargoList :cargos="cargos" @edit-cargo="editCargo" />
  </template>
  
  <script>
  import ReportButton from '@/components/ui/ReportButton.vue';
  import CreateButton from '@/components/ui/CreateButton.vue';
  import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
  import CargoCreateOrEdit from './CargoCreateOrEdit.vue';  
  import CargoList from '@/components/cargos/CargoList.vue';
  import CargoService from '@/services/CargoService';
  
  export default {
    name: 'CargoIndex',
    components: {
      ReportButton,
      DocumentArrowDownIcon,
      CreateButton,
      CargoCreateOrEdit,
      CargoList,
    },
    data() {
      return {
        isCreatingOrEditingCargo: false,
        cargos: [],
        selectedCargo: null,  // Cargo selecionado para edição
      };
    },
    mounted() {
      this.fetchCargos(); 
    },
    methods: {
      showCreateOrEditCargo() {
        this.selectedCargo = null;  // Para criação de novo cargo
        this.isCreatingOrEditingCargo = true;
      },
      hideCreateOrEditCargo() {
        this.isCreatingOrEditingCargo = false;
      },
      async fetchCargos() {
        try {
          const data = await CargoService.getAllCargos();
          this.cargos = data; 
        } catch (error) {
          console.error('Erro ao buscar cargos:', error);
        }
      },
      editCargo(cargo) {
        this.selectedCargo = cargo;  // Para edição do cargo
        this.isCreatingOrEditingCargo = true;
      }
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
  