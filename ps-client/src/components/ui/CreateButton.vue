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
        font-family: Nunito;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border: none;
    }
    button:hover{
        background-color: #7d30ad;
    }
</style>