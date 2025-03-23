<template>
  <div>
    <FormButton v-if="!isCreatingCompany" @click="showCreateCompany">
      Cadastrar
    </FormButton>

    <CompanyCreate v-if="isCreatingCompany" @go-back="hideCreateCompany" />

  </div>

  <div>
    
  </div>
  
  </template>

<script>
import CompanyCreate from '@/views/company/CompanyCreate.vue';
//import CompanyList from '@/views/company/CompanyList.vue';
import FormButton from '@/components/ui/FormButton.vue';

export default {

  name: 'UserIndex',

  components: {
    CompanyCreate,
    FormButton,
  },

  data() {
    return {
      isCreatingUser: false,
    };
  },

  methods: {
    showCreateUser() {
      this.isCreatingCompany = true;
    },
    hideCreateUser() {
      this.isCreatingCompany = false;
    },
  },

};
</script>
