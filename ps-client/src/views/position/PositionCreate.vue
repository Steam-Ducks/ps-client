<template>
    <div class="position-create-view">
        <div class="button-container">
            <button @click="goBack" class="transparent-button">
            <XMarkIcon class="icon" />
        </button>
    </div>

    <h2> Novo Cargo </h2>
        <PositionForm @position-created="goBack"/>
    </div>
</template>

<script>
    import PositionForm from '@/components/position/PositionForm.vue';
    import { XMarkIcon } from '@heroicons/vue/24/solid';

    export default {
        name: 'PositionCreate',

        components: {
        PositionForm,
        XMarkIcon
    },
    methods: {
        goBack() {
            this.$emit('go-back');
        }
    }
}
</script>

<style scoped>
.position-create-view {
  width: 100%;
  padding: 0px 10px 0px 10px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.transparent-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon {
  width: 28px;
  height: 28px;
}
</style>