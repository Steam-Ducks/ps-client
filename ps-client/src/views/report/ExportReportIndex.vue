<template>
  <div class="export-report-page">
    <ExportReportModal
        :showModal="showModal"
        @close="closeModal"
        @export="handleExport"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ExportReportModal from './ExportReportModal.vue';

export default {
  name: 'ExportReportIndex',

  components: {
    ExportReportModal
  },

  setup() {
    const showModal = ref(true);

    // Fechar o modal e voltar para a página anterior
    const closeModal = () => {
      showModal.value = false;
      // Voltar para a página anterior após fechar o modal
      window.history.back();
    };

    // Lidar com a exportação do relatório
    const handleExport = (params) => {
      console.log('Exportando relatório com parâmetros:', params);
      // Aqui seria a chamada para o serviço de exportação
    };

    // Garantir que o modal seja exibido ao montar o componente
    onMounted(() => {
      showModal.value = true;
    });

    return {
      showModal,
      closeModal,
      handleExport
    };
  }
};
</script>

<style scoped>
.export-report-page {
  /* Estilos adicionais para a página, se necessário */
}
</style>