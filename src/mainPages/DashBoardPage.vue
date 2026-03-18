<template>
  <div class="layout">
    <SideBar @project-selected="updateProjectId"/>

    <div v-if="currentProjectId && projectMembers.length" class="members">
    <h4 class="members-title">Team</h4>

    <div
      v-for="member in projectMembers"
      :key="member.id"
      class="member"
    >
      <div class="avatar" :title="member.name">
        {{ member.name.charAt(0).toUpperCase() }}
      </div>
      <span class="name">{{ member.name }}</span>
    </div>
  </div>

    <div class="main-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Project Board</p>
        <h1 class="page-title">Task Dashboard</h1>
        <p class="page-subtitle">Manage your work in a clean and visual way</p>
      </div>

      <div class="header-actions">
        <button class="btn-primary-action" @click="showProjectModal = true">
          <span class="plus-icon">+</span> New Project
        </button>
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

      <CreateProject
        v-if="showProjectModal"
        :visible="showProjectModal"
        @close="showProjectModal = false"
        />

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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CreateProject from "../components/CreateProject.vue";
import TaskColumn from "../components/TaskColumn.vue";
import BaseConfirmModal from "../components/BaseConfirmModal.vue";
import TaskFormModal from "../components/TaskFormModal.vue";
import SideBar from "../components/SideBar.vue";
import { TASK_STATUS } from "../constants/taskStatus";

export default {
  name: "DashBoardPage",
  components: {
    TaskColumn,
    BaseConfirmModal,
    TaskFormModal,
    CreateProject,
    SideBar
  },

  data() {
    return {
      TASK_STATUS,
      selectedTask: null,
      showModal: false,
      showAddModal: false,
      showProjectModal: false,
      showDeleteConfirm: false,
      taskToDeleteId: null,
      newTaskStatus: TASK_STATUS.TODO,
      currentProjectId: Number(localStorage.getItem("currentProjectId")) || null
    };
  },

  computed: {
    ...mapGetters([
      "getUsers"
    ]),

    projectMembers(){
      if(!this.currentProjectId) return [];
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

      const project = this.$store.state.projects.find(
        p => p.id === this.currentProjectId
      );

      if (!project) return [];

      return project.members
      .filter(id => id !== currentUser.id)
      .map(id => this.$store.state.users.find(u => u.id === id))
      .filter(Boolean);
    },

    filteredTasks() {
      if(!this.currentProjectId){
        return this.$store.state.tasks.filter(
        task => task.projectId === null
      );
      }
      console.log("currentProjectId:", this.currentProjectId);
      return this.$store.state.tasks.filter(
        task => task.projectId === this.currentProjectId
      );
    },

    todoTasks() {
      console.log("Filtering tasks for project ID:", this.currentProjectId);
      return this.filteredTasks.filter(
        task => task.status === this.TASK_STATUS.TODO
      );
    },

    inProgressTasks() {
      return this.filteredTasks.filter(
        task => task.status === this.TASK_STATUS.PROGRESS
      );
    },

    doneTasks() {
      return this.filteredTasks.filter(
        task => task.status === this.TASK_STATUS.DONE
      );
    },

    
  },

  methods: {

    updateProjectId(id) {
      this.currentProjectId = id;
      localStorage.setItem("currentProjectId", id);
    },

    ondragEnd(event, newStatus) {
      if (event.added) {
        const task = event.added.element;

      const tasks = [...this.$store.state.tasks];
      const taskForMove = tasks.find((t) => t.id === task.id);
      if (taskForMove) {
        taskForMove.status = newStatus;
      }
      this.$store.commit("setTasks", tasks);

          localStorage.setItem(
            "tasks",
            JSON.stringify(this.$store.state.tasks));
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
        const tasks = [...this.$store.state.tasks];

          const index = tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            tasks.splice(index, 1, updatedTask);
          }
          this.$store.commit("setTasks", tasks);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          this.showModal = false;
    },

    deleteTask(taskId) {
       const tasks = this.$store.state.tasks.filter(
          task => task.id !== taskId);
       this.$store.commit("setTasks", tasks);
       localStorage.setItem(
        "tasks",
        JSON.stringify(tasks));

      this.showDeleteConfirm = true;
    },

    confirmDeleteTask() {
      this.deleteTask(this.taskToDeleteId);
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

        const newTask = {
          id: Date.now(),
          title: task.title,
          description: task.description || "",
          status: task.status,
          assignedTo: task.assignedTo || "",
          createdAt: new Date().toISOString(),
          projectId: this.currentProjectId || null
        };

        const tasks = [...this.$store.state.tasks, newTask];
        this.$store.commit("setTasks", tasks);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        this.showAddModal = false;
    }
  }
};
</script>

<style scoped>

.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, #eef4ff 0%, transparent 30%),
    radial-gradient(circle at top right, #fff1dd 0%, transparent 26%),
    linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.members {
  width: 7rem;
  padding: 1rem;
  margin: 1rem;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid #e6ebf2;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  height: fit-content;
}

.members-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #7b8794;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.member {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.member:hover {
  background: #eef4ff;
}

.avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: bold;
}

.name {
  font-size: 0.85rem;
  color: #1f2a44;
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

.header-actions {
  display: flex;
  align-items: left;
  gap: 1.5rem;
}

.btn-primary-action {
  position: fixed;
  bottom: 2rem;
  right: 2rem; 
  z-index: 999;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.plus-icon {
  font-size: 1.2rem;
  line-height: 1;
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

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .main-content {
    padding: 1rem;
  }

  .header-actions {
    flex-direction: column-reverse;
    align-items: stretch;
    width: 100%;
  }

   .members {
    display: none;
  }
}
</style>