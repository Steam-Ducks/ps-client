<template>
  <div class="home-index">
    <h1>Home</h1>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

export default {
  name: 'HomeIndex',
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const ctx = document.getElementById('myChart');
      if (!ctx) {
        console.error('Canvas element not found!');
        return;
      }
      const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          onClick: (e) => {
            const canvasPosition = getRelativePosition(e, chart);

            // Substitute the appropriate scale IDs
            const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
            const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
            console.log(`Clicked at X: ${dataX}, Y: ${dataY}`);
          }
        }
      });
    },
  },
};
</script>