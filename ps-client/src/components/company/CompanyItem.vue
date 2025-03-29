<template>
  <tr
  :key="company.id"
  :class="{ 'even-row': index % 2 === 0 }"
  >
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
  width: 32%;
  padding-left: 1%;
}

.cnpj {
  width: 32%;
  padding-left: 1%;
}

.contact {
  width: 32%;
  padding-left: 1%;
}
.actions {
  text-align: center;
  position: relative; 
  width: 10%;
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

tbody tr:nth-child(even) {
  background-color: #f9f9f9; 
}
</style>
