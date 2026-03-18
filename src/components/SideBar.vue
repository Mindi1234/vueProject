<template>
    <div>
        <button class="menu-toggle" @click="isOpen = !isOpen">
            ☰
        </button>
        <div :class="['sidebar', { open: isOpen }]">
            <h3 class="sidebar-title">Projects</h3>
        <div
        v-for="project in userProjects"
        :key="project.id"
        class="project-item"
        :class="{ active: project.id === currentProjectId }"
        @click="selectProject(project.id)"
        >
            <span class="dot"></span>
        {{ project.name }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name:"SideBar",

    data(){
        return {
            isOpen: false,
            currentProjectId: Number(localStorage.getItem("currentProjectId")) || null
        }
    },
    computed:{
        
        userProjects(){
            const userId = JSON.parse(localStorage.getItem("currentUser")).id;
            return this.$store.state.projects.filter(
                p=> p.members.includes(userId)
            );
        }

    },

    methods:{

        selectProject(id){
            this.currentProjectId = id;
            localStorage.setItem("currentProjectId", id);
            this.$emit("project-selected", id);
            this.isOpen = false;
        }

    }

}
</script>

<style scoped>
.sidebar {
  width: 7rem;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.75);
  border-right: 1px solid #e6ebf2;
  padding: 1.5rem 0.75rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  position: sticky;
  top: 0;
}

.sidebar-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #7b8794;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
  font-weight: 700;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #1f2a44;
  transition: all 0.2s ease;
}

.project-item:hover {
  background: #eef4ff;
}

.project-item.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.project-item .dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #2563eb;
  border-radius: 50%;
}

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 75%;
    max-width: 20rem;
    height: 100%;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .menu-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    background: #2563eb;
    color: white;
    border: none;
    padding: 0.6rem 0.8rem;
    border-radius: 0.5rem;
    z-index: 1100;
    cursor: pointer;
  }
}
</style>