<template>
  <div class="search-container">
    <input
      :value="searchQuery"
      @input="$emit('update:searchQuery', $event.target.value)"
      type="text"
      class="search-input"
      placeholder="Pesquisar por nome..."
    />
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    searchQuery: {
      type: String,
      required: true,
    },
  },
  emits: ['update:searchQuery'], // Declare the event
};
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  outline: none;
}
</style>
