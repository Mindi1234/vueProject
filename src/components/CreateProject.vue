<template>
  <div class="overlay" v-if="visible" @click.self="close">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">Workspace</p>
          <h2 class="title">Create New Project</h2>
        </div>

        <div class="header-actions">
          <button class="icon-btn" type="button" @click="close" aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <div class="modal-body">
        <div class="field">
          <label class="label">Project Name</label>
          <input 
            class="input" 
            type="text" 
            v-model.trim="localProject.name" 
            placeholder="e.g. Website Redesign" 
            autofocus
          />
        </div>

        <div class="field">
          <label class="label">Description</label>
          <textarea 
            class="textarea" 
            rows="3" 
            v-model.trim="localProject.description" 
            placeholder="What is this project about?"
          ></textarea>
        </div>

        <div class="field">
          <label class="label">Invite Members</label>
          <div class="members-grid">
            <label v-for="user in users" :key="user.id" class="member-item">
              <input type="checkbox" :value="user.id" v-model="localProject.members" />
              <div class="member-chip">
                <span class="avatar-placeholder">{{ user.name.charAt(0) }}</span>
                <span class="member-name">{{ user.name }}</span>
              </div>
            </label>
          </div>
        </div>

        <div class="preview-card">
          <p class="preview-label">Preview</p>
          <strong>{{ localProject.name || "Project Title" }}</strong>
          <p>{{ localProject.description || "Description preview will appear here..." }}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" @click="close">Cancel</button>
        <button 
          class="btn btn-primary" 
          type="button" 
          :disabled="!canSubmit" 
          @click="createProject"
        >
          Create Project
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateProject",
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      localProject: {
        name: "",
        description: "",
        members: []
      }
    };
  },
  computed: {
    users() {
      return this.$store.getters.getUsers || [];
    },
    currentUser() {
      try {
        return JSON.parse(localStorage.getItem("currentUser"));
      } catch (e) {
        return null;
      }
    },
    canSubmit() {
      return this.localProject.name.trim().length >= 3;
    }
  },
  methods: {
    close() {
      this.$emit("close");
      this.resetForm();
    },
    resetForm() {
      this.localProject = { name: "", description: "", members: [] };
    },
    createProject() {
      const newProject = {
        id: Date.now(),
        name: this.localProject.name,
        description: this.localProject.description,
        ownerId: this.currentUser?.id || null,
        members: [...this.localProject.members],
        createdAt: new Date().toISOString()
      };

      const projects = [...this.$store.state.projects, newProject];
      this.$store.commit("setProjects", projects);
      
      localStorage.setItem("projects", JSON.stringify(projects));

      this.close();
      this.$router.push("/project/" + newProject.id);
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
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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
  margin: 0 0 4px;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: 0.2s;
  display: grid;
  place-items: center;
}

.icon-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body {
  padding: 24px;
}

.field {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.input, .textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fcfdfe;
  color: #0f172a;
  font-size: 15px;
  padding: 12px 16px;
  transition: all 0.2s;
}

.input:focus, .textarea:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.members-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.member-item input {
  display: none;
}

.member-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 100px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.2s;
}

.member-item input:checked + .member-chip {
  background: #dbeafe;
  border-color: #2563eb;
  color: #1e40af;
}

.avatar-placeholder {
  width: 20px;
  height: 20px;
  background: #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.preview-card {
  margin-top: 24px;
  border-radius: 16px;
  padding: 16px;
  background: #f8faff;
  border: 1px dashed #cbd5e1;
}

.preview-label {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  border: none;
}

.btn-secondary { background: #f1f5f9; color: #475569; }
.btn-primary { 
  background: #2563eb; 
  color: white; 
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>