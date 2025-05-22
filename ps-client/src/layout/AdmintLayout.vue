<template>
  <AppHeader @open-modal="showModal = true" />
  <SideBar />
  <div class="content">
    <router-view />
  </div>
  <ExportReportModal
      v-if="showModal"
      :showModal="showModal"
      @close="showModal = false"
      @export-success="handleExportSuccess"
  />
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue';
import SideBar from '@/components/common/SideBar.vue';
import ExportReportModal from '@/views/report/ExportReportModal.vue';
import { ref } from 'vue';

export default {
  name: 'AdmintLayout',
  components: {
    SideBar,
    AppHeader,
    ExportReportModal,
  },
  setup() {
    const showModal = ref(false);

    const handleExportSuccess = () => {
      console.log('Report exported successfully!');
    };

    return {
      showModal,
      handleExportSuccess,
    };
  },
};
</script>

<style scoped>
.content {
  margin-left: 300px;
  margin-right: 20px;
  margin-top: 65px;
  padding: 0 40px 40px 40px;
  flex-grow: 1;
  background-color: #fff;
  border-radius: 20px;
}
</style>

<style scoped>
  .content {
    margin-left: 300px;
    margin-right: 20px;
    margin-top:65px;
    padding: 0 40px 40px 40px;
    flex-grow: 1;
    background-color: #fff;
    border-radius: 20px;
  }
</style>