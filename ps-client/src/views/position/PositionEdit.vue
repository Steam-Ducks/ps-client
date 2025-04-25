<template>
    <div>
      <h2 v-if="cargo">Editar Cargo</h2>
      <h2 v-else>Criar Cargo</h2>
  
      <form @submit.prevent="saveCargo">
        <div>
          <label for="name">Nome do Cargo:</label>
          <input v-model="cargo.name" id="name" type="text" required />
        </div>
        <div>
          <label for="description">Descrição:</label>
          <input v-model="cargo.description" id="description" type="text" />
        </div>
        
        <button type="submit">{{ cargo ? 'Salvar' : 'Criar' }}</button>
      </form>
  
      <button @click="$emit('go-back')">Voltar</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      cargo: {
        type: Object,
        default: () => ({
          name: '',
          description: ''
        }),
      },
    },
    methods: {
      async saveCargo() {
        try {
          if (this.cargo.id) {
            await CargoService.updateCargo(this.cargo.id, this.cargo);
            this.$emit('cargo-updated');
          } else {
            await CargoService.createCargo(this.cargo);
            this.$emit('cargo-created');
          }
          this.$emit('go-back');
        } catch (error) {
          console.error('Erro ao salvar cargo:', error);
        }
      }
    },
  };
  </script>
  