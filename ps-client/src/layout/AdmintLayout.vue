<template>
    <AppHeader />
    <div class="content">  
      <router-view />
    </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue';

export default {
  name: 'AdmintLayout',
  components: {
    AppHeader,
  },
};
</script>

<style scoped>
.content {
  margin-left: 300px;
  margin-right: 20px;
  margin-top:65px;
  padding: 20px;
  flex-grow: 1;
  background-color: #fff;
  border-radius: 20px;
}
</style>