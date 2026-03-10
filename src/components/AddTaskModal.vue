<template>
  <div class="overlay" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true" aria-label="Add Task">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">Create New</p>
          <h2 class="title">Add Task</h2>
        </div>

        <button class="icon-btn" type="button" @click="onClose" aria-label="Close">
          ✕
        </button>
      </div>

      <div class="modal-body">
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
            rows="4"
            placeholder="Write short task details"
            v-model.trim="form.description"
          />
        </div>

        <div class="grid">
          <div class="field">
            <label class="label" for="assignedTo">Assigned To</label>
            <div class="select-wrap">
              <select id="assignedTo" v-model="form.assignedTo" class="select">
                <option disabled value="">Select assignee</option>
                <option v-for="u in users" :key="u.id" :value="u.id">
                  {{ u.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="label" for="status">Status</label>
            <div class="select-wrap">
              <select id="status" v-model="form.status" class="select">
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>

        <div class="preview-card">
          <p class="preview-label">Preview</p>
          <strong>{{ form.title || "Your task title" }}</strong>
          <p>{{ form.description || "Task description will appear here" }}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" @click="onClose">
          Cancel
        </button>
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
    users: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        assignedTo: "",
        status: "todo"
      }
    };
  },
  mounted() {
    if (this.users.length > 0) {
      this.form.assigneeId = this.users[0].id;
    }
  },
  computed: {
    canSubmit() {
      return (
        this.form.title.length > 0 &&
        this.form.description.length > 0 &&
        this.form.assigneeId !== "" &&
        this.form.status !== ""
      );
    }
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    onSubmit() {
      const newTask = {
        id: Date.now(),
        title: this.form.title,
        description: this.form.description,
        assignedTo: this.form.assignedTo,
        status: this.form.status,
        createdAt: new Date().toISOString()
      };

      this.$emit("create", newTask);

      this.form.title = "";
      this.form.description = "";
      this.form.assignedTo = this.users.length ? this.users[0].id : "";
      this.form.status = "todo";
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
  align-items: center;
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