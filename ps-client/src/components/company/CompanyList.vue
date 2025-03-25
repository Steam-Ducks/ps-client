<template>
  <div v-if="companies.length > 0" class="company-list">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
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
    companies: { // Changed from 'users' to 'companies'
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.company-list { /* Changed from 'user-list' to 'company-list' */
  margin-top: 25px;
}

.no-companies-message { /* Changed from 'no-users-message' to 'no-companies-message' */
  text-align: center;
  color: #64748b;
  font-size: 1.2rem;
  margin-top: 20px;
}

th {
  text-align: left;
  color: #350453;
}

</style>
