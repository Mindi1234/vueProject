<template>
  <div class="column" :class="status">
    <div class="column-header">
      <div class="column-title-wrap">
        <span class="column-title">{{ title }}</span>
        <span class="count-badge">{{ tasks.length }}</span>
      </div>
      <span class="dots">•••</span>
    </div>

    <draggable
      :list="tasks"
      group="tasks"
      @change="event => $emit('drag-change', event, status)"
      class="task-list"
    >
      <div
        v-for="task in tasks"
        :key="task.id"
        class="card"
        @click="$emit('open-task', task)"
      >
        <div class="card-top">
          <span class="status-pill" :class="pillClass">{{ title }}</span>
          <span class="task-date">{{ formatDate(task.createdAt) }}</span>
        </div>

        <strong class="card-title">{{ task.title }}</strong>
        <p class="card-desc">{{ shortText(task.description) }}</p>

        <div class="card-footer">
          <div class="assignee">
            <div class="avatar">{{ getInitial(task.assignedTo) }}</div>
            <span>{{ task.assignedTo || "Unknown" }}</span>
          </div>
        </div>
      </div>

      <div v-if="tasks.length === 0" class="empty-state">
        No tasks here yet
      </div>
    </draggable>

    <button class="add-task-btn" @click="$emit('add-task', status)">
      <span>＋</span> Add Task
    </button>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { shortText, formatDate, getInitial } from "../utils/helpers";

export default {
  name: "TaskColumn",
  components: {
    draggable
  },
  props: {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    pillClass() {
      if (this.status === "todo") return "todo-pill";
      if (this.status === "progress") return "progress-pill";
      if (this.status === "done") return "done-pill";
      return "";
    }
  },
  methods: {
    shortText,
    formatDate,
    getInitial
  }
};
</script>

<style scoped>
.column {
  width: 24%;
  height: 32rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.todo {
  background: linear-gradient(180deg, #ecf3ff 0%, #dce9ff 100%);
}

.progress {
  background: linear-gradient(180deg, #fff2df 0%, #ffe5bd 100%);
}

.done {
  background: linear-gradient(180deg, #e7f7eb 0%, #d4f0dc 100%);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.column-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.column-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #22304a;
}

.count-badge {
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #3f4d67;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.dots {
  color: #6b7280;
  font-size: 1.125rem;
  cursor: pointer;
}

.task-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 0.75rem;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 1.125rem;
  padding: 0.8rem;
  margin-bottom: 0.6rem;
  box-shadow: 0 0.625rem 1.5rem rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: 0.18s ease;
  border: 1px solid rgba(233, 238, 245, 0.95);
}

.card:hover {
  transform: translateY(-0.1875rem);
  box-shadow: 0 1.125rem 2rem rgba(15, 23, 42, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.625rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.todo-pill {
  background: #dbeafe;
  color: #1d4ed8;
}

.progress-pill {
  background: #ffedd5;
  color: #c2410c;
}

.done-pill {
  background: #dcfce7;
  color: #15803d;
}

.task-date {
  font-size: 0.75rem;
  color: #7b8794;
}

.card-title {
  display: block;
  font-size: 1rem;
  color: #182338;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-desc {
  margin: 0 0 1rem;
  color: #667085;
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 2.625rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: #334155;
  font-size: 0.8125rem;
  font-weight: 600;
}

.avatar {
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  background: linear-gradient(180deg, #2563eb 0%, #1e40af 100%);
  color: white;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 0 0.5rem 1.125rem rgba(37, 99, 235, 0.24);
}

.empty-state {
  margin-top: 0.75rem;
  padding: 1.375rem 1rem;
  border: 2px dashed rgba(100, 116, 139, 0.28);
  border-radius: 1rem;
  text-align: center;
  color: #64748b;
  background: rgba(255, 255, 255, 0.35);
  font-size: 0.875rem;
}

.add-task-btn {
  width: 100%;
  margin-top: 0.875rem;
  border: none;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.78);
  color: #1e293b;
  padding: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.18s ease;
  box-shadow: 0 0.625rem 1.25rem rgba(15, 23, 42, 0.06);
}

.add-task-btn:hover {
  transform: translateY(-0.125rem);
  background: white;
}

.add-task-btn span {
  font-size: 1.125rem;
  margin-right: 0.375rem;
}

.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
</style>