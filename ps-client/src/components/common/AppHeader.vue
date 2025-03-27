<template>
  <header class="app-header">
    <a href="#" class="nav-link">
      <ArrowRightStartOnRectangleIcon class="icon" />
    </a>
  </header>
</template>

<script>

import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'AppHeader',

  components: {
    ArrowRightStartOnRectangleIcon,
  }
};

</script>

<style scoped>

  .app-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 50px;
    top: 0;
    left: 0;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    position: fixed;
  }

  .icon {
    width: 28px; 
    height: 28px;
    margin-top: 10px;
  }

  .nav-link:hover {
    background-color: #f0f0f0;

  }

  .nav-link{
    height: 100%;
    align-items: center;
    justify-content: center; 
    margin: 0 30px;
    text-decoration: none;
    color: #551a8b;
    font-family: Nunito;
  }
  
</style>
