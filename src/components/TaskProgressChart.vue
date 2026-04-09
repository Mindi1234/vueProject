<template>
  <div class="task-progress-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Chart } from "chart.js/auto";

export default Vue.extend({
  name: "TaskProgressChart",
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null as any 
    };
  },
  watch: {
    tasks: {
      handler() {
        this.updateChart();
      },
      deep: true
    }
  },
  mounted() {
    this.renderChart();
  },
methods: {
  renderChart() {
    const canvas = this.$refs.chartCanvas;
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const todoCount = this.tasks.filter((t: any) => t.status === "TODO").length;
    const inProgressCount = this.tasks.filter((t: any) => t.status === "PROGRESS").length;
    const doneCount = this.tasks.filter((t: any) => t.status === "DONE").length;

    this.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["To Do", "In Progress", "Done"],
        datasets: [
          {
            data: [todoCount, inProgressCount, doneCount],
            backgroundColor: ["#2563eb", "#f59e0b", "#10b981"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  },

  updateChart() {
    if (!this.chart) return;

    const todoCount = this.tasks.filter((t: any) => t.status === "TODO").length;
    const inProgressCount = this.tasks.filter((t: any) => t.status === "PROGRESS").length;
    const doneCount = this.tasks.filter((t: any) => t.status === "DONE").length;

    this.chart.data.datasets[0].data = [todoCount, inProgressCount, doneCount];
    this.chart.update();
  }
}
});
</script>

<style scoped>
.task-progress-chart {
  width: 100%;
  max-width: 500px;
  margin: 1rem auto;
  height: 250px;
}
</style>