<template>
  <li class="company-item">
    <div class="company-info">
      <span class="company-label">Nome:</span> <span class="company-name">{{ company.Name }}</span>
    </div>
    <div class="company-info">
      <span class="company-label">CNPJ:</span> <span class="company-CNPJ">{{ uscompanyer.CNPJ }}</span>
    </div>
    <div class="company-info">
      <span class="company-label">Telefone:</span> <span class="company-telefone">{{ company.Telefone }}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'CompanyItem',
  props: {
    Company: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.user-item {
  padding: 20px;
  background-color: #ffffff;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.user-info {
  margin-bottom: 12px;
}

.user-label {
  font-weight: bold;
  color: #1e293b;
}

.user-id,
.user-name,
.user-email,
.user-password {
  color: #64748b;
}
</style>
