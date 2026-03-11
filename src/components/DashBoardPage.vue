<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Project Board</p>
        <h1 class="page-title">Task Dashboard</h1>
        <p class="page-subtitle">Manage your work in a clean and visual way</p>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <span class="summary-label">To Do</span>
          <strong>{{ todoTasks.length }}</strong>
        </div>
        <div class="summary-card">
          <span class="summary-label">In Progress</span>
          <strong>{{ inProgressTasks.length }}</strong>
        </div>
        <div class="summary-card">
          <span class="summary-label">Done</span>
          <strong>{{ doneTasks.length }}</strong>
        </div>
      </div>
    </div>

    <div class="board">
      <TaskColumn
        title="To Do"
        :status="TASK_STATUS.TODO"
        :tasks="todoTasks"
        @drag-change="ondragEnd"
        @open-task="openTaskDetails"
        @add-task="openAddTaskModal"
      />

      <TaskColumn
        title="In Progress"
        :status="TASK_STATUS.PROGRESS"
        :tasks="inProgressTasks"
        @drag-change="ondragEnd"
        @open-task="openTaskDetails"
        @add-task="openAddTaskModal"
      />

      <TaskColumn
        title="Done"
        :status="TASK_STATUS.DONE"
        :tasks="doneTasks"
        @drag-change="ondragEnd"
        @open-task="openTaskDetails"
        @add-task="openAddTaskModal"
      />
    </div>

    <TaskFormModal
      v-if="showModal"
      mode="edit"
      :task="selectedTask"
      :users="getUsers"
      @close="closeModal"
      @save="saveTask"
      @delete="deleteTask"
    />

    <TaskFormModal
      v-if="showAddModal"
      mode="create"
      :users="getUsers"
      @close="showAddModal = false"
      @save="createTask"
    />

    <BaseConfirmModal
      v-if="showDeleteConfirm"
      title="Delete Task"
      message="Are you sure you want to delete this task?"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="confirmDeleteTask"
      @close="closeDeleteConfirm"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TaskColumn from "./TaskColumn.vue";
import BaseConfirmModal from "./BaseConfirmModal.vue";
import TaskFormModal from "./TaskFormModal.vue";
import { TASK_STATUS } from "../constants/taskStatus";

export default {
  name: "DashBoardPage",
  components: {
    TaskColumn,
    BaseConfirmModal,
    TaskFormModal
  },

  data() {
    return {
      TASK_STATUS,
      selectedTask: null,
      showModal: false,
      showAddModal: false,
      showDeleteConfirm: false,
      taskToDeleteId: null,
      newTaskStatus: TASK_STATUS.TODO
    };
  },

  computed: {
    ...mapGetters([
      "todoTasks",
      "inProgressTasks",
      "doneTasks",
      "getUsers"
    ])
  },

  methods: {
    ...mapMutations([
      "moveTask",
      "updateTask",
      "deleteTask",
      "addTask"
    ]),

    ondragEnd(event, newStatus) {
      if (event.added) {
        const task = event.added.element;
        this.moveTask({
          taskId: task.id,
          newStatus: newStatus
        });
      }
    },

    openTaskDetails(task) {
      this.selectedTask = { ...task };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedTask = null;
    },

    saveTask(updatedTask) {
      this.updateTask(updatedTask);
      this.showModal = false;
    },

    deleteTask(taskId) {
      this.taskToDeleteId = taskId;
      this.showDeleteConfirm = true;
    },

    confirmDeleteTask() {
      this.$store.commit("deleteTask", this.taskToDeleteId);
      this.showDeleteConfirm = false;
      this.showModal = false;
      this.taskToDeleteId = null;
      this.selectedTask = null;
    },

    closeDeleteConfirm() {
      this.showDeleteConfirm = false;
      this.taskToDeleteId = null;
    },

    openAddTaskModal(status) {
      this.newTaskStatus = status;
      this.showAddModal = true;
    },

    createTask(task) {
      task.status = this.newTaskStatus;
      this.addTask(task);
      this.showAddModal = false;
    }
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, #eef4ff 0%, transparent 30%),
    radial-gradient(circle at top right, #fff1dd 0%, transparent 26%),
    linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;
}

.page-header {
  max-width: 87.5rem;
  margin: 0 auto 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 0.375rem;
  color: #5b6b82;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-title {
  margin: 0;
  font-size: 2.375rem;
  font-weight: 800;
  color: #1f2a44;
}

.page-subtitle {
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 0.9375rem;
}

.summary-cards {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.summary-card {
  min-width: 7.5rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid #e6ebf2;
  border-radius: 1.125rem;
  padding: 0.875rem 1.125rem;
  box-shadow: 0 0.625rem 1.625rem rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(8px);
}

.summary-label {
  display: block;
  font-size: 0.75rem;
  color: #7b8794;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.summary-card strong {
  font-size: 1.625rem;
  color: #172033;
}

.board {
  max-width: 87.5rem;
  margin: 0 auto;
  display: flex;
  gap: 1.3rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}
</style>