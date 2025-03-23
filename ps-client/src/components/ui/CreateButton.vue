<template>

    <button> 
        <slot></slot>
     </button>

</template>

<script>
    export default {
        name: 'CreateButton'
    }
</script>

<style scoped>
    button{
        background-color: #6F08AF;
        color: white;
        height: 35px;
        width: 155px;
        border-radius: 8px;
        cursor: pointer; 
    }
</style>