<template>
  <tr>
    <td>{{ employee.name }}</td>
    <td>{{ employee.cpf }}</td>
    <td>{{ employee.cargo }}</td>
    <td class="actions">
      <EllipsisHorizontalIcon class="icon" @click="toggleOptionsButton"/>
      <div v-if="isOptionsButton" class="modal">
        <OptionsButton/>
      </div>
    </td>
  </tr>
</template>

<script>
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid';
import OptionsButton from '@/components/ui/OptionsButton.vue';

export default {
  name: 'EmployeeItem',
  components: {
    EllipsisHorizontalIcon,
    OptionsButton,
  },
  props: {
    employee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOptionsButton: false,
    };
  },
  methods: {
    toggleOptionsButton() {
      this.isOptionsButton = !this.isOptionsButton;
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  width: 33%;
}

.actions {
  text-align: center;
  position: relative; 
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.modal {
  position: absolute;
  background-color: white;
  z-index: 10;
  right: 0; 
}

</style>
