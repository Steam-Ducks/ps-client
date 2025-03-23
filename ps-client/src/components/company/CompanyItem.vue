<template>
  <tr>
    <td>{{ company.name }}</td>
    <td>{{ company.cnpj }}</td>
    <td>{{ company.contact }}</td>
    <td class="actions">
      <EllipsisHorizontalIcon class="icon"/> 
    </td>
  </tr>
</template>

<script>

import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'CompanyItem',
  components: {
    EllipsisHorizontalIcon,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  width: 33%;
}

.actions {
  text-align: center;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>