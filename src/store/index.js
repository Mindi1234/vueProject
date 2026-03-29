import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
      users: [
        { id: 1, name: "Alice", password: "password1", role: "admin" },
        { id: 2, name: "Eden", password: "1234@", role: "user" },
        { id: 3, name: "Shira", password: "shira12$", role: "user" }
      ],
        tasks: JSON.parse(localStorage.getItem("tasks")) ||[
        { id: 1, title: "h.w.", description: "do homework in math", status: 'todo', assignedTo: 1, projectId: 1, createdAt: new Date().toISOString(), dueDate: "2026-03-31" },
        { id: 2, title: "clean", description: "do the dishes", status: 'progress', assignedTo: 3, projectId: 2, createdAt: new Date().toISOString(), dueDate: "2026-03-30" },
        { id: 3, title: "bake", description: "make chocklete chips cookies", status: 'todo', assignedTo: 2, projectId: 2, createdAt: new Date().toISOString(), dueDate: "2026-03-29" },
        ],
        projects: [
            { id: 1, name: "Project A", description: "Description of Project A", ownerId: 1, members: [1,2] },
            { id: 2, name: "Project B", description: "Description of Project B", ownerId: 1, members: [2, 3, 1] },
        ]
    },

    mutations: {
        setUsers(state, users) {
            state.users = users;
        },
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        setProjects(state, projects) {
            state.projects = projects;
        },
        updateTaskStatus(state, { taskId, status }) {
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                task.status = status;
                localStorage.setItem("tasks", JSON.stringify(state.tasks));
            }
        },
        updateTask(state, updatedTask) {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                Vue.set(state.tasks, index, updatedTask);
                localStorage.setItem("tasks", JSON.stringify(state.tasks));
            }
        },
        addTask(state, newTask) {
          state.tasks.push({
            ...newTask,
            createdAt: new Date().toISOString()
          });            localStorage.setItem("tasks", JSON.stringify(state.tasks));
        },
        deleteTask(state, taskId) {
            state.tasks = state.tasks.filter(task => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(state.tasks));
        }
  },

  getters: {

    getUsers(state) {
      return state.users;
    },

    getTasks(state) {
      return state.tasks;
    },

    getProjects(state) {
      return state.projects;
    },

    managedProjects(state) {
      return state.projects.filter((project) => 
      project.ownerId === JSON.parse(localStorage.getItem("currentUser")).id);
    },

    memberProjects(state) {
      const currentUserId = JSON.parse(localStorage.getItem("currentUser")).id;
      return state.projects.filter((project) => 
      project.members.includes(currentUserId) &&
      project.ownerId !== currentUserId);
    },

    doneTasks(state) {
      return state.tasks.filter((task) => task.status === "done");
    },

    inProgressTasks(state) {
      return state.tasks.filter((task) => task.status === "progress");
    },

    todoTasks(state) {
      return state.tasks.filter((task) => task.status === "todo");
    },

    taskWithPriority: () => (task) => {
      if(task.status === "done") return null;
      if(!task.dueDate || !task.createdAt) return 'low';

      const now = new Date();
      const createdAt = new Date(task.createdAt);
      const due = new Date(task.dueDate);
      due.setHours(23, 59, 59, 999);

      const totalTime = due - createdAt;
      const passed = now - createdAt;

      const ratio = passed / totalTime;

      if (ratio < 0.33) return 'low';
      if (ratio < 0.66) return 'medium';
      return 'high';
    }
  }
});