<template>
  <form @submit.prevent="updateCompany">
    <h2>Editar empresa</h2>
    <p>Atualize os campos abaixo para editar a empresa</p>

    <div class="form-group">
      <label for="name">Nome da empresa</label>
      <input
          type="text"
          id="name"
          v-model="company.name"
          class="form-control"
          required
      />
    </div>

    <div class="form-group">
      <label for="cnpj">CNPJ</label>
      <input
          type="text"
          id="cnpj"
          v-model="company.cnpj"
          class="form-control"
          disabled
      />
    </div>

    <div class="form-group">
      <label for="contact">Contato</label>
      <input
          type="text"
          id="contact"
          v-model="company.contact"
          class="form-control"
          required
      />
    </div>

    <div class="button-container">
      <button type="submit" class="save-button">Salvar</button>
    </div>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import CompanyService from '@/services/CompanyService';
import Swal from 'sweetalert2';

export default {
  name: 'CompanyEditForm',
  props: {
    companyId: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['company-updated'],
  setup(props, { emit }) {
    const company = ref({
      id: '',
      name: '',
      cnpj: '',
      contact: ''
    });

    const fetchCompany = async () => {
      try {
        console.log('Buscando empresa com ID:', props.companyId);
        const response = await CompanyService.getCompanyById(props.companyId);
        company.value = response.data;
        console.log('Dados da empresa carregados:', company.value);
      } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os dados da empresa.'
        });
      }
    };

    const updateCompany = async () => {
      try {
        console.log('Atualizando empresa:', company.value);
        // Incluir o CNPJ no objeto de atualização mesmo que não seja alterável na interface
        await CompanyService.updateCompany(company.value.id, {
          name: company.value.name,
          contact: company.value.contact,
          cnpj: company.value.cnpj // Incluir o CNPJ que pode ser necessário para a API
        });

        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Empresa atualizada com sucesso!'
        });

        emit('company-updated');
      } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível atualizar a empresa.'
        });
      }
    };

    onMounted(() => {
      fetchCompany();
    });

    return {
      company,
      updateCompany
    };
  }
};
</script>

<style scoped>
h2 {
  color: #6F08AF;
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  color: #6F08AF;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #6F08AF;
  font-weight: 500;
  font-size: 18px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  height: 48px;
  box-sizing: border-box;
}

.form-control:disabled {
  background-color: #f2f2f2;
  cursor: not-allowed;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.save-button {
  background-color: #6F08AF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 150px;
}

.save-button:hover {
  background-color: #5a0690;
}
</style>
