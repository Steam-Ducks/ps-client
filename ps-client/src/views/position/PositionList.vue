<template>
    <div>
      <h2>Lista de Cargos</h2>
      <ul>
        <li v-for="cargo in cargos" :key="cargo.id">
          <span>{{ cargo.name }} - {{ cargo.description }}</span>
          <button @click="$emit('edit-cargo', cargo)">Editar</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      cargos: Array,
    },
  };
  </script>
  