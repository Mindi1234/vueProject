<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="delete-icon" @click="$emit('delete', task.id)">🗑</button>

      <div class="modal-header">
        <div>
          <p class="eyebrow">{{ isEditing ? "Update Task" : "Task Overview" }}</p>
          <h2>{{ isEditing ? "Edit Task" : task.title }}</h2>
        </div>

        <div class="top-right">
          <span class="status-pill" :class="task.status">
            {{ prettyStatus(isEditing ? editableTask.status : task.status) }}
          </span>
        </div>
      </div>

      <div v-if="!isEditing" class="details">
        <div class="info-card">
          <p class="label">Title</p>
          <p class="value strong">{{ task.title }}</p>
        </div>

        <div class="info-card">
          <p class="label">Description</p>
          <p class="value">{{ task.description || "No description" }}</p>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <p class="label">Status</p>
            <p class="value">{{ prettyStatus(task.status) }}</p>
          </div>

          <div class="info-card">
            <p class="label">Assigned To</p>
            <p class="value">{{ getUserName(task.assigneeId) }}</p>
          </div>
        </div>

        <div class="buttons">
          <button class="btn ghost" @click="$emit('close')">Close</button>
          <button class="btn primary" @click="startEdit">Edit Task</button>
        </div>
      </div>

      <div v-else class="edit-form">
        <label>Title</label>
        <input v-model="editableTask.title" />

        <label>Description</label>
        <textarea v-model="editableTask.description"></textarea>

            <div class="row">

                <div class="field">
                <label>Assigned To</label>

                <select v-model="editableTask.assignedTo">

                    <option 
                        v-for="user in getUsers"
                        :key="user.id"
                        :value="user.name"
                    >
                        {{ user.name }}
                    </option>
                </select>
                </div>

          <div class="field">
            <label>Status</label>
            <select v-model="editableTask.status">
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div class="buttons">
          <button class="btn ghost" @click="cancelEdit">Cancel</button>
          <button class="btn primary" @click="save">Save Task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskModal",
  props: {
    task: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      isEditing: false,
      editableTask: {}
    };
  },

  watch: {
    task: {
      immediate: true,
      handler(newTask) {
        this.editableTask = { ...newTask };
        this.isEditing = false;
      }
    }
  },

  methods: {
    startEdit() {
      this.isEditing = true;
      this.editableTask = { ...this.task };
    },

    cancelEdit() {
      this.isEditing = false;
      this.editableTask = { ...this.task };
    },

    save() {
      this.$emit("save", this.editableTask);
      this.isEditing = false;
    },

    getUserName(assigneeId) {
      const user = this.users.find(u => String(u.id) === String(assigneeId));
      return user ? user.name : "Unassigned";
    },

    prettyStatus(status) {
      if (status === "todo") return "To Do";
      if (status === "progress") return "In Progress";
      if (status === "done") return "Done";
      return status;
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.52);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.modal {
  position: relative;
  width: 640px;
  max-width: 95%;
  border-radius: 24px;
  padding: 26px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.22);
  border: 1px solid #e8edf5;
}

.delete-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  background: #fff1f2;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.16s ease;
}

.delete-icon:hover {
  transform: scale(1.05);
  background: #ffe4e6;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #172033;
  font-size: 28px;
  line-height: 1.2;
  text-align: left;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
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

.details,
.edit-form {
  margin-top: 8px;
}

.info-card {
  background: #f8fbff;
  border: 1px solid #e7edf6;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.label {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.value {
  margin: 0;
  color: #334155;
  line-height: 1.6;
  text-align: left;
}

.strong {
  font-size: 18px;
  font-weight: 800;
  color: #172033;
}

label {
  display: block;
  margin-top: 14px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #334155;
  text-align: left;
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  background: #f8fbff;
  padding: 12px 14px;
  font-size: 14px;
  color: #172033;
  transition: 0.15s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

textarea {
  min-height: 100px;
  resize: none;
}

.row {
  display: flex;
  gap: 14px;
  margin-top: 4px;
}

.field {
  flex: 1;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn {
  min-width: 130px;
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.16s ease;
}

.btn.ghost {
  background: #eef2f7;
  color: #1f2937;
}

.btn.ghost:hover {
  background: #e2e8f0;
}

.btn.primary {
  background: linear-gradient(180deg, #2f6fff 0%, #2458d3 100%);
  color: white;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.24);
}

.btn.primary:hover {
  transform: translateY(-1px);
}
</style>