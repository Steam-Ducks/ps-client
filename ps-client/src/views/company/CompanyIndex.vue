<template>
  <div class="head">

    <div class="Title">
      <h1> Empresas </h1>
      <p> Veja abaixo as empresas já cadastradas. Para adicionar uma nova empresa, clique no botão + Nova Empresa. </p>
    </div>

    <div class="buttons">

      <ReportButton>
        <DocumentArrowDownIcon/>
      </ReportButton>       
      <CreateButton @click="showCreateCompany">
        + Nova Empresa
      </CreateButton>
    </div>
  </div>

  <div class="loading-overlay" v-if="isLoading">
    <img class="loading" src="../../assets/loading-icon.gif" alt="loading icon">
  </div>
  <div v-else>
<div v-if="isCreatingCompany" class="modal">
      <div class="modal-content">
        <CompanyCreate @go-back="hideCreateCompany" @company-created="fetchCompanies"/>
      </div>
    </div>

    <div v-else-if="isCreatingPosition" class="modal">
      <div class="modal-content modal-content-position">
        <PositionCreate @go-back="hideCreatePosition" />
      </div>
    </div>

    <CompanyList :companies="companies"/>
  </div>

  
  </template>

<script>
import ReportButton from '@/components/ui/ReportButton.vue';
import CreateButton from '@/components/ui/CreateButton.vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid';
import CompanyCreate from './CompanyCreate.vue';  
import CompanyList from '@/components/company/CompanyList.vue';
import CompanyService from '@/services/CompanyService';

export default {
  name: 'CompanyIndex',
  components: {
    ReportButton,
    DocumentArrowDownIcon,
    CreateButton,
    CompanyCreate,
    CompanyList,
  },
  data() {
    return {
      isLoading: true,
      isCreatingCompany: false,
      isCreatingPosition: false,
      companies: [],
    };
  },
  mounted() {
    this.fetchCompanies(); 
  },
  methods: {
    loaded() {
      this.isLoading = false;
    },
    // ::::::::::::: Company :::::::::::::
    showCreateCompany() {
      this.isCreatingCompany = true;
    },
    async hideCreateCompany() {
      this.isCreatingCompany = false;
      await this.fetchCompanies();
    },
    async fetchCompanies() {
      try {
        const data = await CompanyService.getAllCompanies(); 
        this.companies = data;
        this.loaded()
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    },

  },
};
</script>

<style scoped>
  .head {
    display: flex;
    justify-content: space-between;
    align-items:first baseline;
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