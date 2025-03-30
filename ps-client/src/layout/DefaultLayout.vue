<template>

  <div id="app">
    <PageContainer>
      <router-view />
    </PageContainer>
    <AppFooter />
  </div>
  
</template>

<script>
import AppFooter from '@/components/common/AppFooter.vue';
import PageContainer from '@/components/layout/PageContainer.vue';

export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    PageContainer,
  },
};
</script>
