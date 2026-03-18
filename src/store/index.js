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
        { id: 1, title: "h.w.", description: "do homework in math", status: 'todo', assignedTo: 1, projectId: 1 },
        { id: 2, title: "clean", description: "do the dishes", status: 'progress', assignedTo: 3, projectId: null },
        { id: 3, title: "bake", description: "make chocklete chips cookies", status: 'todo', assignedTo: 2, projectId: null },
        ],
        projects: [
            { id: 1, name: "Project A", description: "Description of Project A", ownerId: 1, members: [1,2] },
            { id: 2, name: "Project B", description: "Description of Project B", ownerId: 2, members: [2, 3, 1] },
            { id: 3, name: "Project C", description: "Description of Project C", ownerId: 2, members: [2, 3] },
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
    }
  }
});