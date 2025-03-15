<template>
  <button :class="buttonClasses" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'FormButton', 
    props: {
      type: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary'].includes(value),
      },
    },
    computed: {
      buttonClasses() {
        return [
          'button',
          this.type === 'primary' ? 'primary-button' : 'secondary-button',
        ];
      },
    },
  };
</script>

<style scoped>
  .button {
    display: block;
    width: 200px;
    margin: 20px auto;
    padding: 12px;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .primary-button {
    background-color: #3b82f6;
  }

  .primary-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
  }

  .primary-button:active {
    transform: translateY(0);
  }

  .primary-button::after {
    content: '→';
    margin-left: 10px;
    transition: margin-left 0.3s ease;
  }

  .primary-button:hover::after {
    margin-left: 15px;
  }

  .secondary-button {
    background-color: #64748b;
  }

  .secondary-button:hover {
    background-color: #4a5568;
    transform: translateY(-2px);
  }

  .secondary-button:active {
    transform: translateY(0);
  }

  .secondary-button::after {
    content: '🔎';
    margin-left: 10px;
    transition: margin-left 0.3s ease;
  }

  .secondary-button:hover::after {
    margin-left: 15px;
  }

</style>
