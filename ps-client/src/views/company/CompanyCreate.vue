<template>
  <div class="company-create-view">
    <div class="button-container">
      <button @click="goBack" class="transparent-button">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <h2> Nova Empresa </h2>
    <p> Preencha os campos abaixo para cadastrar a empresa </p>

    <CompanyForm @company-created="goBack" />
  </div>
</template>

<script>
import CompanyForm from '@/components/company/CompanyForm';
import { XMarkIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'CompanyCreate',
  components: {
    CompanyForm,
    XMarkIcon,
  },
  methods: {
    goBack() {
      this.$emit('go-back');
    },
  },
};
</script>

<style scoped>
.company-create-view {
  width: 100%;
  position: relative;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  position: absolute;  
  top: 0;  
  right: 0;  
  z-index: 10; 
  padding: 10px;
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
</style>
