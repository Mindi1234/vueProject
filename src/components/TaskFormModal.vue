<template>
  <div class="overlay" @click.self="handleClose">
    <div class="modal" role="dialog" aria-modal="true">
      <!-- HEADER -->
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">
            {{ isEditMode ? "Update Task" : "Create New" }}
          </p>
          <h2 class="title">
            {{ isEditMode ? "Edit Task" : "Add Task" }}
          </h2>
        </div>

        <div class="header-actions">
          <span
            v-if="isEditMode"
            class="status-pill"
            :class="localTask.status"
          >
            {{ statusLabel }}
          </span>

          <button
            v-if="isEditMode"
            class="icon-btn delete-btn"
            type="button"
            @click="handleDelete"
          >
            🗑
          </button>

          <button class="icon-btn" type="button" @click="handleClose">
            ✕
          </button>
        </div>
      </div>

      <div class="modal-body">
        <div class="field">
          <label class="label">Task Title</label>
          <input
            class="input"
            type="text"
            v-model.trim="localTask.title"
            placeholder="e.g. Design homepage"
          />
        </div>

        <div class="field">
          <label class="label">Description</label>
          <textarea
            class="textarea"
            v-model.trim="localTask.description"
            placeholder="Write task details"
          />
        </div>

        <div class="grid">
          <div class="field">
            <label class="label" for="assignedTo">Assigned To</label>
            <select
              id="assignedTo"
              class="select"
              v-model="localTask.assignedTo"
            >
              <option disabled value="">Select assignee</option>
              <option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="field">
            <label class="label">Status</label>
            <select class="select" v-model="localTask.status">
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div v-if="!isEditMode" class="preview-card">
          <p class="preview-label">Preview</p>
          <strong>{{ localTask.title || "Your task title" }}</strong>
          <p>
            {{ localTask.description || "Task description will appear here" }}
          </p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleClose">
          Cancel
        </button>

        <button
          class="btn btn-primary"
          :disabled="!canSubmit || isSubmitting"
          @click="submitForm"
        >
          {{ isEditMode ? "Save Task" : "Create Task" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { TASK_STATUS } from "../constants/taskStatus";

export default {
  name: "TaskFormModal",

  props: {
    mode: String,
    task: Object,
    users: Array
  },

  data() {
    return {
      localTask: this.getEmptyTask(),
      isSubmitting: false
    };
  },

  computed: {
    isEditMode() {
      return this.mode === "edit";
    },

    canSubmit() {
      return (
        this.localTask.title &&
        this.localTask.description &&
        this.localTask.assignedTo
      );
    },

    statusLabel() {
      const map = {
        todo: "To Do",
        progress: "In Progress",
        done: "Done"
      };
      return map[this.localTask.status];
    }
  },

  watch: {
    task: {
      immediate: true,
      handler(newTask) {
        if (this.isEditMode && newTask) {
          this.localTask = { ...newTask };
        } else {
          this.resetForm();
        }
      }
    }
  },

  mounted() {
    window.addEventListener("keydown", this.handleEsc);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleEsc);
  },

  methods: {
    getEmptyTask() {
      return {
        id: null,
        title: "",
        description: "",
        assignedTo: "",
        status: TASK_STATUS.TODO,
        createdAt: new Date().toISOString()
      };
    },

    resetForm() {
      this.localTask = this.getEmptyTask();

      if (this.users?.length) {
        this.localTask.assignedTo = this.users[0].name;
      }
    },

    handleClose() {
      this.$emit("close");
    },

    handleEsc(e) {
      if (e.key === "Escape") {
        this.handleClose();
      }
    },

    handleDelete() {
      if (confirm("Delete this task?")) {
        this.$emit("delete", this.localTask.id);
      }
    },

    submitForm() {
      if (!this.canSubmit) return;

      this.isSubmitting = true;

      const taskToEmit = {
        ...this.localTask,
        id: this.isEditMode ? this.localTask.id : Date.now(),
        createdAt: this.isEditMode
          ? this.localTask.createdAt
          : new Date().toISOString()
      };

      this.$emit("save", taskToEmit);

      setTimeout(() => {
        this.isSubmitting = false;
      }, 300);
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.modal {
  width: min(720px, 95vw);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.24);
  overflow: hidden;
  border: 1px solid #e7edf6;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #ebf0f6;
}

.modal-eyebrow {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
  text-align: left;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: #eff4ff;
  color: #1e3a8a;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.delete-btn {
  background: #fff1f2;
  color: #b91c1c;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.status-pill.todo {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.progress {
  background: #ffedd5;
  color: #c2410c;
}

.status-pill.done {
  background: #dcfce7;
  color: #15803d;
}

.modal-body {
  padding: 22px 24px;
}

.field {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #24324a;
  text-align: left;
}

.input,
.textarea,
.select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dce5f0;
  border-radius: 14px;
  background: #f8fbff;
  color: #0f172a;
  font-size: 14px;
  transition: 0.16s ease;
}

.input,
.select {
  height: 46px;
  padding: 0 14px;
}

.textarea {
  padding: 12px 14px;
  resize: none;
  min-height: 110px;
}

.input:focus,
.textarea:focus,
.select:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.preview-card {
  margin-top: 10px;
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border: 1px solid #dbeafe;
}

.preview-label {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.preview-card strong {
  display: block;
  margin-bottom: 8px;
  color: #172033;
  font-size: 18px;
}

.preview-card p {
  margin: 0;
  color: #5b6578;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 24px 24px;
  border-top: 1px solid #ebf0f6;
}

.btn {
  min-width: 130px;
  height: 46px;
  border-radius: 14px;
  border: none;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.16s ease;
}

.btn-secondary {
  background: #eef2f7;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: linear-gradient(180deg, #2f6fff 0%, #2458d3 100%);
  color: white;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>