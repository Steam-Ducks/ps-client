<template>
  <div class="company-create-view">
    <div class="button-container">
      <FormButton @click="goBack">Voltar</FormButton>
    </div>
      <CompanyForm @user-created="handleUserCreated" />
  </div>
</template>

<script>
import CompanyForm from '@/components/company/CompanyForm.vue';
import FormButton from '@/components/ui/FormButton.vue';

export default {
  name: 'CompanyCreate',
  components: {
    CompanyForm,
    FormButton,
  },
  methods: {
    goBack() {
      this.$emit('go-back');
    },
    handleUserCreated() {
      this.$emit('go-back');
    },
  },
};
</script>

<style scoped>

.button-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
