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
    },

    mutations: {
        setUsers(state, users) {
            state.users = users;
        },
        setTasks(state, tasks) {
            state.tasks = tasks;
        }
  },

  getters: {

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