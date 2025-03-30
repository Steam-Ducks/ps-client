<template>

    <div class="options">
        <button> Editar </button>
        <button> Deletar </button>
    </div>

</template>

<script>

export default {
    name: "OptionsButton",
}

</script>

<style scoped>

    button {
    width:100px;
    text-align: left;
    color: #6F08AF;
    font-family: 'Nunito';
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 5px
    }
    
    button:hover {
        background-color: #f0f0f0;
    }

    .options{
        margin: 0;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
</style>