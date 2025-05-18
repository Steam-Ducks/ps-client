<template>
  <div class="employee-edit-view">

    <div class="button-container">
      <button @click="goBack" class="transparent-button">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <h2>Histórico de Alterações</h2>

    <h3> {{ name }} | ID: {{ id }}</h3>
    <p>Exibindo histórico de alterações no dia {{ recordDateInfo }} :</p>

    <div class="history-container" v-if="historyArray.length > 0">
      <div class="timeline-vertical"></div> 
      <div class="history-items"> 
        <div class="history-item" v-for="(item, index) in historyArray" :key="index">
          <div class="timeline-line1" v-if="index == 0"></div>
          <div class="timeline-line0" v-if="index == historyArray.length - 1"></div>
          <div class="timeline-dot"></div>
          <div class="content">
            <h4>{{ formatDateFromISO(item.updated) }}</h4>
            <p>O registro {{ item.type }} foi alterado para: {{ item.time || '—' }}</p>
          </div>
        </div>
      </div>
    </div>
    
  </div>

</template>

<script>
import { XMarkIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'EmployeeEdit',
  components: {
    XMarkIcon, 
  },
  props: {
    recordDateInfo: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name:{
      type: String,
      required: true
    },
    historyData: { 
      type: Object, 
      default: () => ({}) 
    }
  },
  computed: {
    historyArray() {
      const data = this.historyData;

      return [
        { type: 'Entrada 1', time: data.entrada1, updated: data.entrada1Update },
        { type: 'Saída 1',   time: data.saida1,   updated: data.saida1Update },
        { type: 'Entrada 2', time: data.entrada2, updated: data.entrada2Update },
        { type: 'Saída 2',   time: data.saida2,   updated: data.saida2Update },
        { type: 'Entrada 3', time: data.entrada3, updated: data.entrada3Update },
        { type: 'Saída 3',   time: data.saida3,   updated: data.saida3Update }
      ].filter(item => item.updated)
      .sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
  },
  methods: {
    goBack() {
      this.$emit('go-back');
      this.$emit('employee-updated');
    },
    formatDateFromISO(dateString) {
      if (!dateString) return '—';

      const date = new Date(dateString);

      if (isNaN(date.getTime())) return '—';

      const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit' };

      const formattedDate = date.toLocaleDateString('pt-BR', optionsDate);
      const formattedTime = date.toLocaleTimeString('pt-BR', optionsTime);

      return `${formattedDate} às ${formattedTime}`;
    }
  },
};
</script>

<style scoped>

.employee-edit-view {
  width: 100%;
  position: relative;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.icon {
    margin: 0;
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

.history-container {
  position: relative; 
  margin-top: 15px;
}

.history-items {
  position: relative;
}

.timeline-vertical {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0; 
  width: 4px;
  background-image: linear-gradient(to bottom, #868686 3px, transparent 3px);
  background-size: 2px 9px;
  background-repeat: repeat-y;
}

.timeline-line0 {
  content: '';
  position: absolute;
  left: 6px;
  bottom: 0;
  height: 50%;
  width: 4px;
  background-color: #ffffff;
}

.timeline-line1 {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  height: 50%;
  width: 4px;
  background-color: #ffffff;
}

.history-item {
  position: relative;
  padding-left: 25px; 
  margin-bottom: 20px; 
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border-radius: 50%;
  border: #868686 3px solid;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.content {
  margin-left: 25px;
}
</style>
