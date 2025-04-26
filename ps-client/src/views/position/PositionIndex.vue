<template>
  <div class="head">

    <div class="Title">
      <h1> Cargos </h1>
      <p> Veja abaixo os cargos já cadastrados. Para adicionar um novo cargo, clique no botão + Novo cargo. </p>
    </div>

    <div class="buttons">

      <ReportButton>
        <DocumentArrowDownIcon/>
      </ReportButton> 

      <CreateButton @click="showCreatePosition">
        + Novo Cargo
      </CreateButton> 
    </div>
  </div>
  

  <div v-if="isCreatingPosition" class="modal">
    <div class="modal-content modal-content-position">
      <PositionCreate @go-back="hideCreatePosition" />
    </div>
  </div>

<!--<PositionList :position="positions"/>-->

  
  </template>

<script>
import ReportButton from '@/components/ui/ReportButton.vue';
import CreateButton from '@/components/ui/CreateButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import PositionCreate from '@/views/position/PositionCreate.vue';  
//import PositionList from '@/components/position/PositionList.vue';
import PositionService from '@/services/PositionService';

export default {
  name: 'PositionIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    CreateButton,
    PositionCreate,
    //PositionList,
  },
  data() {
    return {
      isCreatingPosition: false,
      positions: [],
    };
    
  },
 
  methods: {
      // ::::::::::::: Position :::::::::::::

    showCreatePosition() {
      this.isCreatingPosition = true;
    },
    hideCreatePosition() {
      this.isCreatingPosition = false;
    },
    
    async getAllPositions() {
      this.positions = await PositionService.getAllPositions();
      this.errorLoading = null;
      this.positions = [];

      try{
        const response = await PositionService.getAllPositions();
        this.positions = response.data;
      }catch (error){
        console.error("Erro ao buscar cargos:",error);
        this.errorLoading = "Erro ao buscar cargos. Tente novamente mais tarde.";
      }
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
    font-family: Nunito;
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
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: 700px;
    font-size: 20px;
  }
</style>