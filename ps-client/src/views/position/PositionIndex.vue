<template>
  <div class="head">
    <div class="Title">
      <h1> Cargos </h1>
      <p> Veja abaixo os cargos já cadastrados. Para adicionar um novo cargo, clique no botão + Novo cargo. </p>
    </div>

    <div class="buttons">
      <ReportButton>
        <DocumentArrowDownIcon />
      </ReportButton>

      <CreateButton @click="showCreatePosition">
        + Novo Cargo
      </CreateButton>
    </div>
  </div>

  <div v-if="isCreatingPosition" class="modal">
    <div class="modal-content modal-content-position">
      <PositionCreate @go-back="hideCreatePosition" @position-created="fetchPositions" />
    </div>
  </div>

  <div v-if="isEditingPosition" class="modal">
    <div class="modal-content modal-content-position">
      <PositionEdit 
        :position-id="selectedPositionId" 
        @go-back="hideEditPosition"
        @position-edited="handlePositionEdited"
      />
    </div>
  </div>

  <PositionList :positions="positions" @edit-position="handleEditPosition" />
</template>

<script>
import ReportButton from '@/components/ui/ReportButton.vue';
import CreateButton from '@/components/ui/CreateButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import PositionCreate from '@/views/position/PositionCreate.vue';
import PositionList from '@/components/position/PositionList.vue';
import PositionService from '@/services/PositionService';
import PositionEdit from './PositionEdit.vue';

export default {
  name: 'PositionIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    CreateButton,
    PositionCreate,
    PositionList,
    PositionEdit,
  },
  data() {
    return {
      isCreatingPosition: false,
      isEditingPosition: false,
      selectedPositionId: null,  // Armazena o ID do cargo selecionado
      positions: [],  // Lista de cargos
    };
  },
  mounted() {
    this.fetchPositions();
  },
  methods: {
    showCreatePosition() {
      this.isCreatingPosition = true;
    },
    hideCreatePosition() {
      this.isCreatingPosition = false;
    },
    handleEditPosition(positionId) {
      this.selectedPositionId = positionId;  // Atualiza o ID do cargo selecionado
      this.isEditingPosition = true;  // Exibe o modal para editar
    },
    hideEditPosition() {
      this.isEditingPosition = false;  // Fecha o modal de edição
    },
    async fetchPositions() {
      try {
        const response = await PositionService.getAllPositions();
        this.positions = response;
      } catch (error) {
        console.error('Erro ao buscar cargos:', error);
      }
    },
    handlePositionEdited(updatedPosition) {
      // Atualiza a posição na lista após a edição
      const index = this.positions.findIndex(position => position.id === updatedPosition.id);
      if (index !== -1) {
        this.$set(this.positions, index, updatedPosition);  // Usando $set para garantir reatividade
      }
      this.isEditingPosition = false;  // Fecha o modal de edição
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
