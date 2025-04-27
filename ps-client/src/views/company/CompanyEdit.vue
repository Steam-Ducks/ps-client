<template>
  <div class="company-edit-view">

    <div class="button-container">
      <button @click="goBack" class="transparent-button">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <h2>Editar Empresa</h2>
    <p>Atualize os campos abaixo para editar a Empresa</p>

    <CompanyEditForm :company-id="id" @company-updated="goBack" />
  </div>

</template>

<script>
import CompanyEditForm from '@/components/company/CompanyEditForm.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'CompanyEdit',
  components: {
    CompanyEditForm,
    XMarkIcon,
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack() {
      this.$emit('go-back');
      this.$emit('company-updated');
    },
  },
};
</script>

<style scoped>

.company-edit-view {
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
