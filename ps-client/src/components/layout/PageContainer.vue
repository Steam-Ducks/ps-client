<template>
  <div class="page-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
};
</script>

<style scoped>
.page-container {
  padding: 30px;
  background-color: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
