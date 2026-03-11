import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        users: [
            { id: 1, name: "Alice", password: "password1" },
            { id: 2, name: "Eden", password: "1234@" },
            { id: 3, name: "Shira", password: "shira12$" },
        ],
        tasks: JSON.parse(localStorage.getItem("tasks")) ||[
        { id: 1, title: "h.w.", description: "do homework in math", status: 'todo', assignedTo: "Alice" },
        { id: 2, title: "clean", description: "do the dishes", status: 'progress', assignedTo: "Shira"},
        { id: 3, title: "bake", description: "make chocklete chips cookies", status: 'todo', assignedTo: "Eden" }
        ],
        currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    },

    mutations: {
        login(state, user) {
          state.currentUser = user;
        },
        setUsers(state, users) {
            state.users = users;
        },
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        
        addTask(state, task) {
            const newTask = {
              id: task.id || Date.now(),
              title: task.title,
              description: task.description || "",
              status: task.status || "todo",
              assignedTo: task.assignedTo || "",
              createdAt: task.createdAt || new Date().toISOString()
            };
          
            state.tasks.push(newTask);
          },

    moveTask(state, { taskId, newStatus }) {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }
    },

    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },

    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter((t) => t.id !== taskId);
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

    doneTasks(state) {
      return state.tasks.filter((task) => task.status === "done");
    },

    inProgressTasks(state) {
      return state.tasks.filter((task) => task.status === "progress");
    },

    todoTasks(state) {
      return state.tasks.filter((task) => task.status === "todo");
    }
  }
});