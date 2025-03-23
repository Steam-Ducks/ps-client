<style scoped>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .buttons {
    display: flex;
    gap: 10px; 
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center; 
    align-items: center; 
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

<template>
  <div class="head">

    <div class="Title">
      <h1> Empresas </h1>
      <p> Veja abaixo as empresas já cadastradas. Para adicionar uma nova empresa, clique no botão abaixo. </p>
    </div>

    <div class="buttons">
      <ReportButton>
        <BriefcaseIcon class="icon"/>
      </ReportButton> 
      
      <ReportButton>
        <DocumentArrowDownIcon/>
      </ReportButton> 
       
      <CreateButton @click="showCreateCompany">
        + Nova Empresa
      </CreateButton>
    </div>
  </div>
  
  <div v-if="isCreatingCompany" class="modal">
    <div class="modal-content">
      <CompanyCreate @go-back="hideCreateCompany" />
    </div>
  </div>

  <CompanyList :companies="companies"/>
    
  
  </template>

<script>
import ReportButton from '@/components/ui/ReportButton.vue';
import CreateButton from '@/components/ui/CreateButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import { BriefcaseIcon } from '@heroicons/vue/24/solid';
import CompanyCreate from './CompanyCreate.vue';  
import CompanyList from '@/components/company/CompanyList.vue';
import CompanyService from '@/services/CompanyService';

export default {
  name: 'CompanyIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    BriefcaseIcon,
    CreateButton,
    CompanyCreate,
    CompanyList,
  },
  data() {
    return {
      isCreatingCompany: false,
      companies: [],
    };
  },
  mounted() {
    this.fetchCompanies(); 
  },
  methods: {
    showCreateCompany() {
      this.isCreatingCompany = true;
    },
    hideCreateCompany() {
      this.isCreatingCompany = false;
    },
    async fetchCompanies() {
      try {
        const data = await CompanyService.getAllCompanies(); 
        this.companies = data;
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    },
  },
};
</script>
