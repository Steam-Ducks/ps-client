<template>
  <div v-if="companies.length > 0" class="company-list">
    <table>
      <thead>
        <tr>
          <th>Nome da empresa</th>
          <th>CNPJ</th>
          <th>Contato</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        <CompanyItem v-for="company in companies" :key="company.id" :company="company" />
      </tbody>
    </table>
  </div>
  <div v-else class="no-companies-message">
    <p>Nenhuma empresa encontrada. Tente buscar novamente.</p>
  </div>
</template>

<script>
import CompanyItem from './CompanyItem.vue';

export default {
  name: 'CompanyList',
  components: {
    CompanyItem,
  },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.company-list {
  margin-top: 25px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
.no-companies-message {
  color: #64748b;
  font-size: 1.2rem;
  margin-top: 20px;
}

th{
  padding-left: 1%;
}
</style>
