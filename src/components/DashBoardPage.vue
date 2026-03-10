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
      <!-- TODO -->
      <div class="column todo">
        <div class="column-header">
          <div class="column-title-wrap">
            <span class="column-title">To Do</span>
            <span class="count-badge">{{ todoTasks.length }}</span>
          </div>
          <span class="dots">•••</span>
        </div>

        <draggable
          :list="todoTasks"
          group="tasks"
          @change="event => ondragEnd(event, 'todo')"
          class="task-list"
        >
          <div
            v-for="task in todoTasks"
            :key="task.id"
            class="card"
            @click="openTaskDetails(task)"
          >
            <div class="card-top">
              <span class="status-pill todo-pill">To Do</span>
              <span class="task-date">{{ formatDate(task.createdAt) }}</span>
            </div>

            <strong class="card-title">{{ task.title }}</strong>
            <p class="card-desc">{{ shortText(task.description) }}</p>

            <div class="card-footer">
              <div class="assignee">
                <div class="avatar">{{ task.assignedTo.charAt(0) }}</div>
                <span>{{ task.assignedTo }}</span>
              </div>
            </div>
          </div>

          <div v-if="todoTasks.length === 0" class="empty-state">
            No tasks here yet
          </div>
        </draggable>

        <button class="add-task-btn" @click="openAddTaskModal('todo')">
          <span>＋</span> Add Task
        </button>
      </div>

    
      <div class="column progress">
        <div class="column-header">
          <div class="column-title-wrap">
            <span class="column-title">In Progress</span>
            <span class="count-badge">{{ inProgressTasks.length }}</span>
          </div>
          <span class="dots">•••</span>
        </div>

        <draggable
          :list="inProgressTasks"
          group="tasks"
          @change="event => ondragEnd(event, 'progress')"
          class="task-list"
        >
          <div
            v-for="task in inProgressTasks"
            :key="task.id"
            class="card"
            @click="openTaskDetails(task)"
          >
            <div class="card-top">
              <span class="status-pill progress-pill">In Progress</span>
              <span class="task-date">{{ formatDate(task.createdAt) }}</span>
            </div>

            <strong class="card-title">{{ task.title }}</strong>
            <p class="card-desc">{{ shortText(task.description) }}</p>

            <div class="card-footer">
              <div class="assignee">
                <div class="avatar">{{ getUserInitials(task.assigneeId) }}</div>
                <span>{{ getUserName(task.assigneeId) }}</span>
              </div>
            </div>
          </div>

          <div v-if="inProgressTasks.length === 0" class="empty-state">
            No tasks here yet
          </div>
        </draggable>

        <button class="add-task-btn" @click="openAddTaskModal('progress')">
          <span>＋</span> Add Task
        </button>
      </div>

      <!-- DONE -->
      <div class="column done">
        <div class="column-header">
          <div class="column-title-wrap">
            <span class="column-title">Done</span>
            <span class="count-badge">{{ doneTasks.length }}</span>
          </div>
          <span class="dots">•••</span>
        </div>

        <draggable
          :list="doneTasks"
          group="tasks"
          @change="event => ondragEnd(event, 'done')"
          class="task-list"
        >
          <div
            v-for="task in doneTasks"
            :key="task.id"
            class="card"
            @click="openTaskDetails(task)"
          >
            <div class="card-top">
              <span class="status-pill done-pill">Done</span>
              <span class="task-date">{{ formatDate(task.createdAt) }}</span>
            </div>

            <strong class="card-title">{{ task.title }}</strong>
            <p class="card-desc">{{ shortText(task.description) }}</p>

            <div class="card-footer">
              <div class="assignee">
                <div class="avatar">{{ getUserInitials(task.assigneeId) }}</div>
                <span>{{ getUserName(task.assigneeId) }}</span>
              </div>
            </div>
          </div>

          <div v-if="doneTasks.length === 0" class="empty-state">
            No tasks here yet
          </div>
        </draggable>

        <button class="add-task-btn" @click="openAddTaskModal('done')">
          <span>＋</span> Add Task
        </button>
      </div>
    </div>

    <TaskModal
      v-if="showModal"
      :task="selectedTask"
      :users="getUsers"
      @close="closeModal"
      @save="saveTask"
      @delete="deleteTask"
    />

    <AddTaskModal
      v-if="showAddModal"
      :users="getUsers"
      @close="showAddModal = false"
      @create="createTask"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import draggable from "vuedraggable";
import TaskModal from "./TaskModeal.vue";
import AddTaskModal from "./AddTaskModal.vue";

export default {
  name: "DashBoardPage",
  components: {
    draggable,
    TaskModal,
    AddTaskModal
  },

  data() {
    return {
      selectedTask: null,
      showModal: false,
      showAddModal: false,
      newTaskStatus: "todo"
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
      if (confirm("Are you sure you want to delete this task?")) {
        this.$store.commit("deleteTask", taskId);
        this.showModal = false;
      }
    },

    openAddTaskModal(status) {
      this.newTaskStatus = status;
      this.showAddModal = true;
    },

    createTask(task) {
      task.status = this.newTaskStatus;
      this.addTask(task);
      this.showAddModal = false;
    },

    getUserName(assigneeId) {
      const user = this.getUsers.find(u => String(u.id) === String(assigneeId));
      return user ? user.name : "Unassigned";
    },

    getUserInitials(assigneeId) {
      const name = this.getUserName(assigneeId);
      if (!name || name === "Unassigned") return "?";
      return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },

    shortText(text) {
      if (!text) return "No description";
      return text.length > 60 ? text.slice(0, 60) + "..." : text;
    },

    formatDate(date) {
      if (!date) return "Today";
      const d = new Date(date);
      return d.toLocaleDateString("en-GB");
    }
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, #eef4ff 0%, transparent 30%),
    radial-gradient(circle at top right, #fff1dd 0%, transparent 26%),
    linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;
}

.page-header {
  max-width: 1400px;
  margin: 0 auto 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 6px;
  color: #5b6b82;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-title {
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  color: #1f2a44;
}

.page-subtitle {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
}

.summary-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.summary-card {
  min-width: 120px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid #e6ebf2;
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(8px);
}

.summary-label {
  display: block;
  font-size: 12px;
  color: #7b8794;
  margin-bottom: 8px;
  font-weight: 700;
}

.summary-card strong {
  font-size: 26px;
  color: #172033;
}

.board {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}

.column {
  width: 360px;
  min-height: 640px;
  padding: 18px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.7);
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
  margin-bottom: 16px;
}

.column-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.column-title {
  font-size: 18px;
  font-weight: 800;
  color: #22304a;
}

.count-badge {
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
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
  font-size: 18px;
  cursor: pointer;
}

.task-list {
  flex-grow: 1;
  min-height: 120px;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: 0.18s ease;
  border: 1px solid rgba(233, 238, 245, 0.95);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
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
  font-size: 12px;
  color: #7b8794;
}

.card-title {
  display: block;
  font-size: 18px;
  color: #182338;
  margin-bottom: 8px;
  line-height: 1.3;
}

.card-desc {
  margin: 0 0 16px;
  color: #667085;
  font-size: 14px;
  line-height: 1.5;
  min-height: 42px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(180deg, #2563eb 0%, #1e40af 100%);
  color: white;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.24);
}

.empty-state {
  margin-top: 12px;
  padding: 22px 16px;
  border: 2px dashed rgba(100, 116, 139, 0.28);
  border-radius: 16px;
  text-align: center;
  color: #64748b;
  background: rgba(255, 255, 255, 0.35);
  font-size: 14px;
}

.add-task-btn {
  width: 100%;
  margin-top: 14px;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.78);
  color: #1e293b;
  padding: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.18s ease;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.add-task-btn:hover {
  transform: translateY(-2px);
  background: white;
}

.add-task-btn span {
  font-size: 18px;
  margin-right: 6px;
}
</style>