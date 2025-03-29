<template>
  <tr>
    <td class="name" >{{ company.name }}</td>
    <td class="cnpj" >{{ company.cnpj }}</td>
    <td class="contact" >{{ company.contact }}</td>
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
  name: 'CompanyItem',
  components: {
    EllipsisHorizontalIcon,
    OptionsButton,
  },
  props: {
    company: {
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

.name {
  width: 35%;
}

.cnpj {
  width: 35%;
}

.contact {
  width: 35%;
}
.actions {
  text-align: center;
  position: relative; /* Adicionado para posicionar o .modal corretamente */
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
