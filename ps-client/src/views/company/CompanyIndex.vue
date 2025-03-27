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
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
