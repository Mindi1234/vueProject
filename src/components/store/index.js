import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [
      { id: 1, name: "Alice", password: "password1", role: "admin", project: "alpha" },
      { id: 2, name: "Eden", password: "1234@", role: "user", project: "alpha" },
      { id: 3, name: "Shira", password: "shira12$", role: "user", project: "beta" }
    ],

    tasks: JSON.parse(localStorage.getItem("tasks")) || [
      { id: 1, title: "h.w.", description: "do homework in math", status: "todo", assignedTo: "Alice", project: "alpha" },
      { id: 2, title: "clean", description: "do the dishes", status: "progress", assignedTo: "Shira", project: "beta" },
      { id: 3, title: "bake", description: "make chocolate chips cookies", status: "todo", assignedTo: "Eden", project: "alpha" }
    ],

    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null
  },

  mutations: {
    login(state, payload) {
      const user = state.users.find(
        (u) => u.name === payload.name && u.password === payload.password
      );

      if (user) {
        const safeUser = {
          id: user.id,
          name: user.name,
          role: user.role,
          project: user.project
        };

        state.currentUser = safeUser;
        localStorage.setItem("currentUser", JSON.stringify(safeUser));
      } else {
        state.currentUser = null;
        localStorage.removeItem("currentUser");
      }
    },

    logout(state) {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },

    setUsers(state, users) {
      state.users = users;
    },

    setTasks(state, tasks) {
      state.tasks = tasks;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },

    addTask(state, task) {
      const newTask = {
        id: task.id || Date.now(),
        title: task.title,
        description: task.description || "",
        status: task.status || "todo",
        assignedTo: task.assignedTo || "",
        project: task.project || state.currentUser?.project || "default",
        createdAt: task.createdAt || new Date().toISOString()
      };

      state.tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    moveTask(state, { taskId, newStatus }) {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },

    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },

    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter((t) => t.id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    }
  },

  getters: {
    isLoggedIn(state) {
      return !!state.currentUser;
    },

    currentUser(state) {
      return state.currentUser;
    },

    getUsers(state) {
      return state.users;
    },

    getTasks(state) {
      return state.tasks;
    },

    visibleTasks(state) {
      if (!state.currentUser) return [];

      if (state.currentUser.role === "admin") {
        return state.tasks;
      }

      return state.tasks.filter(
        (task) =>
          task.assignedTo === state.currentUser.name &&
          task.project === state.currentUser.project
      );
    },

    doneTasks(state, getters) {
      return getters.visibleTasks.filter((task) => task.status === "done");
    },

    inProgressTasks(state, getters) {
      return getters.visibleTasks.filter((task) => task.status === "progress");
    },

    todoTasks(state, getters) {
      return getters.visibleTasks.filter((task) => task.status === "todo");
    }
  }
});