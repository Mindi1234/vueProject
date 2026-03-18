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
        :isAdmin="isAdmin"
        @drag-change="ondragEnd"
        @open-task="openTaskDetails"
        @add-task="openAddTaskModal"
      />

      <TaskColumn
        title="In Progress"
        :status="TASK_STATUS.PROGRESS"
        :tasks="inProgressTasks"
        :isAdmin="isAdmin"
        @drag-change="ondragEnd"
        @open-task="openTaskDetails"
        @add-task="openAddTaskModal"
      />

      <TaskColumn
        title="Done"
        :status="TASK_STATUS.DONE"
        :tasks="doneTasks"
        :isAdmin="isAdmin"
        @drag-change="ondragEnd"
        @open-task="openTaskDetails"
        @add-task="openAddTaskModal"
      />
    </div>

    <!-- עריכת משימה -->
    <TaskFormModal
      v-if="showModal"
      mode="edit"
      :task="selectedTask"
      :users="getUsers"
      :isAdmin="isAdmin"
      @close="closeModal"
      @save="saveTask"
      @delete="deleteTask"
    />

    <!-- יצירת משימה -->
    <TaskFormModal
      v-if="showAddModal"
      mode="create"
      :users="getUsers"
      :isAdmin="isAdmin"
      @close="showAddModal = false"
      @save="createTask"
    />

    <!-- מחיקה -->
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
      "getUsers",
      "currentUser"
    ]),

    isAdmin() {
      return this.currentUser?.role === "admin";
    }
  },

  methods: {
    ...mapMutations([
      "moveTask",
      "updateTask",
      "deleteTask",
      "addTask"
    ]),

    // 🔐 רק אדמין יכול לגרור
    ondragEnd(event, newStatus) {
      if (!this.isAdmin) return;

      if (event.added) {
        const task = event.added.element;
        this.moveTask({
          taskId: task.id,
          newStatus
        });
      }
    },

    // 🔐 רק אדמין או בעל המשימה
    openTaskDetails(task) {
      if (!this.isAdmin && task.assignedTo !== this.currentUser.id) {
        return;
      }

      this.selectedTask = { ...task };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedTask = null;
    },

    saveTask(updatedTask) {
      if (!this.isAdmin && updatedTask.assignedTo !== this.currentUser.id) {
        return;
      }

      this.updateTask(updatedTask);
      this.showModal = false;
    },

    // 🔐 רק אדמין מוחק
    deleteTask(taskId) {
      if (!this.isAdmin) return;

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

    // 🔐 רק אדמין מוסיף
    openAddTaskModal(status) {
      if (!this.isAdmin) return;

      this.newTaskStatus = status;
      this.showAddModal = true;
    },

    createTask(task) {
      if (!this.isAdmin) return;

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

.page-title {
  margin: 0;
  font-size: 2.3rem;
  font-weight: 800;
}

.page-subtitle {
  margin-top: 0.5rem;
  color: #6b7280;
}

.summary-cards {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.summary-card {
  min-width: 7.5rem;
  background: white;
  border-radius: 1rem;
  padding: 0.8rem 1rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.board {
  max-width: 87.5rem;
  margin: 0 auto;
  display: flex;
  gap: 1.3rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>