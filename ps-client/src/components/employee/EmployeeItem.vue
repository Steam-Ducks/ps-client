<template>
  <tr>
    <td class="image"><img :src="employee.photo" alt="foto de perfil" /></td>
    <td class="name">{{ employee.name }}</td>
    <td class="cpf">{{ employee.cpf }}</td>
    <td class="position">{{ employee.position.name }}</td>
    <td class="company">{{ employee.company.name }}</td>
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

img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.image {
  width: 6%;
  text-align: center;
}
.name {
  width: 27%;
}

.cpf {
  width: 15%;
}

.position {
  width: 25%;
}

.company {
  width: 27%;
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
