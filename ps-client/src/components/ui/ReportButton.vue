<template>

    <button> 
        <slot></slot>
     </button>

</template>

<script>
    export default {
        name: 'ReportButton'
    }
</script>

<style scoped>
    button{
        background-color: #6F08AF;
        color: white;
        height: 35px;
        width: 35px;
        border-radius: 8px;
        cursor: pointer; 
    }
</style>