<template>
    <div class="position-edit-view">
        <div class="button-container">
            <button @click="goBack" class="transparent-button">
              <XMarkIcon class="icon" />
            </button>
        </div>
        <div class="contents">
          <h2> Editar Cargo </h2>
          <PositionEditForm 
            :position="position" 
            @position-edited="goBack" 
            @save-position="savePosition"/>
        </div>
    </div>
</template>

<script>
import PositionEditForm from '@/components/position/PositionEditForm.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import PositionService from '@/services/PositionService';

export default {
  name: 'PositionEdit',
  components: {
    PositionEditForm,
    XMarkIcon
  },
  props: {
    positionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      position: {
        id: null,
        name: '',
      }, // Dados do cargo
    };
  },
  mounted() {
    this.fetchPosition();
  },
  methods: {
    async fetchPosition() {
      try {
        const data = await PositionService.getPositionById(this.positionId);
        this.position = data; // Preenche o cargo com os dados da API
      } catch (error) {
        console.error('Erro ao buscar cargo:', error);
      }
    },
    goBack() {
      this.$emit('go-back'); // Emite evento para voltar
    },
    async savePosition(positionData) {
      try {
        await PositionService.updatePosition(positionData.id, positionData);
        this.goBack(); // Volta para a tela anterior após salvar
      } catch (error) {
        console.error('Erro ao salvar cargo:', error);
      }
    },
  }
};
</script>

<style scoped>
.position-edit-view {
  width: 100%;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.contents {
  padding: 0 24px 8px;
}

.transparent-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon {
  width: 28px;
  height: 28px;
}

h2 {
  margin-top: -10px;
}
</style>
