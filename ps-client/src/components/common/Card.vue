<template>
  <div class="card">
    <p class="card-title">{{ title }}</p>
    <p class="card-value">{{ value }}</p>
    <p class="card-subtext" :class="subtextClass">{{ subtext }}</p>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtext: {
      type: String,
      default: ''
    },
    subtextClass: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
.card {
  flex: 1 1 20%;
  background-color: #fff;
  border-radius: 12px;
  padding: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  color: #9b00ff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.card-value {
  font-size: 2rem;
  font-weight: bold;
  color: #9b00ff;
}

.card-subtext {
  font-size: 0.9rem;
}

.success {
  color: #1a7f37;
}

.failure {
  color: #ff4d4f;
}

.note {
  color: #777;
}
</style>