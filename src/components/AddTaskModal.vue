<template>
  <div class="overlay" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true" aria-label="Add Task">
      <!-- Header -->
      <div class="modal-header">
        <button class="icon-btn" type="button" @click="onClose" aria-label="Back">
          <svg viewBox="0 0 24 24" class="icon">
            <path
              d="M15.5 19.5 8 12l7.5-7.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="title">Add Task</div>

        <button class="icon-btn" type="button" @click="onClose" aria-label="Close">
          <svg viewBox="0 0 24 24" class="icon">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div class="form-card">
          <div class="field">
            <label class="label" for="taskTitle">Task Title</label>
            <input
              id="taskTitle"
              class="input"
              type="text"
              placeholder="e.g. Design homepage"
              v-model.trim="form.title"
            />
          </div>

          <div class="field">
            <label class="label" for="taskDesc">Description</label>
            <textarea
              id="taskDesc"
              class="textarea"
              rows="3"
              placeholder="Short description"
              v-model.trim="form.description"
            />
          </div>

          <div class="row">
            <div class="field">
              <label class="label" for="assignedTo">Assigned To</label>
              <div class="select">
                <select id="assignedTo" v-model="form.assigneeId">
                  <option disabled value="">Select assignee</option>
                  <option v-for="u in users" :key="u.id" :value="u.id">
                    {{ u.name }}
                  </option>
                </select>
                <span class="chev">▾</span>
              </div>
            </div>

            <div class="field">
              <label class="label" for="status">Status</label>
              <div class="select">
                <select id="status" v-model="form.status">
                  <option value="todo">To Do</option>
                  <option value="progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <span class="chev">▾</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-ghost" type="button" @click="onClose">Cancel</button>
        <button class="btn btn-primary" type="button" :disabled="!canSubmit" @click="onSubmit">
          Create Task
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTaskModal",
  props: {
    value: { type: Boolean, default: false },
    users: {
      type: Array,
      default: () => [
        { id: "mimia", name: "Mimi" },
        { id: "michal", name: "Michal" }
      ]
    }
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        assigneeId: "mimi",
        status: "todo"
      }
    };
  },
  computed: {
    canSubmit() {
      return (
        this.form.title.length > 0 &&
        this.form.description.length > 0 &&
        this.form.assigneeId &&
        this.form.status
      );
    }
  },
  methods: {
    onClose() {
      this.$emit("input", false);
      this.$emit("close");
    },
    onSubmit() {
      const newTask = {
        id: String(Date.now()),
        title: this.form.title,
        description: this.form.description,
        assigneeId: this.form.assigneeId,
        status: this.form.status,
        createdAt: new Date().toISOString()
      };

      this.$emit("create", newTask);

      this.form.title = "";
      this.form.description = "";
      this.form.assigneeId = this.users?.[0]?.id || "";
      this.form.status = "todo";

      this.onClose();
    }
  }
};
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.5);
  display: grid;
  place-items: center;
  padding: 28px;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

/* Modal */
.modal {
  width: min(760px, 94vw);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  border: 1px solid #e8ecf5;
}

/* Header */
.modal-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f6f8ff 100%);
  border-bottom: 1px solid #e8ecf5;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: 0.2px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: rgba(37, 99, 235, 0.06);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #1e3a8a;
  transition: 0.15s ease;
}
.icon-btn:hover {
  background: rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.18);
}

.icon {
  width: 20px;
  height: 20px;
}

/* Body */
.modal-body {
  padding: 18px 20px 10px;
}

/* Inner card */
.form-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  border: 1px solid #eef2ff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

/* Fields */
.field {
  margin-bottom: 14px;
}

.label {
  display: block;
  font-size: 12px;
  font-weight: 900;
  color: #1f2a44;
  margin-bottom: 6px;
  text-align: left;
  letter-spacing: 0.2px;
}

.input {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #dfe6f5;
  background: #f9fbff;
  padding: 0 11px;
  font-size: 14px;
  outline: none;
  color: #0f172a;
  transition: 0.15s ease;
}
.input::placeholder {
  color: #94a3b8;
}
.input:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #dfe6f5;
  background: #f9fbff;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  color: #0f172a;
  resize: none;
  transition: 0.15s ease;
}
.textarea::placeholder {
  color: #94a3b8;
}
.textarea:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

/* Row */
.row {
  display: flex;
  gap: 12px;
}
.row .field {
  flex: 1;
  margin-bottom: 0;
}

/* Select */
.select {
  position: relative;
}
.select select {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #dfe6f5;
  background: #f9fbff;
  padding: 0 40px 0 12px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  appearance: none;
  transition: 0.15s ease;
}
.select select:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
.chev {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 16px;
}

/* Footer */
.modal-footer {
  padding: 14px 20px 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e8ecf5;
  background: #ffffff;
}

.btn {
  height: 42px;
  min-width: 140px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.15s ease;
}

.btn-ghost {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #e2e8f0;
}
.btn-ghost:hover {
  background: #eaf0f8;
}

.btn-primary {
  background: linear-gradient(180deg, #2b6bff 0%, #1f5fe6 100%);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.32);
}
.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>