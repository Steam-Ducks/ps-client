<template>
    <router-view />
</template>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
    nav-link {
        color: #551a8b;
        font-family: Nunito;
    }
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    body {
        background-color: #e8e8e8;
        color: #6F08AF;
        font-family: 'Nunito';
    }

    td {
        padding: 10px 0 10px 0;
        width: 33%;
        color: #828282;
    }

    td:first-child {
        color: #350453;
        font-weight: 500;
    }
    th {
        text-align: left;
        color: #350453;
    }
    
</style>