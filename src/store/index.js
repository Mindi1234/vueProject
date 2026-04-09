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
      tasks: JSON.parse(localStorage.getItem("tasks")) || [
        { id: 1, title: "Math Homework", description: "do homework in math", status: 'todo', assignedTo: 1, projectId: 1 },
        { id: 2, title: "Clean Kitchen", description: "do the dishes", status: 'progress', assignedTo: 3, projectId: null },
        { id: 3, title: "Bake Cookies", description: "make chocolate chip cookies", status: 'todo', assignedTo: 2, projectId: null },
      
        { id: 4, title: "Study Vue", description: "learn computed and props", status: 'done', assignedTo: 1, projectId: 1 },
        { id: 5, title: "Fix Bug", description: "resolve login issue", status: 'progress', assignedTo: 2, projectId: 2 },
        { id: 6, title: "Write Report", description: "project summary report", status: 'todo', assignedTo: 3, projectId: 1 },
      
        { id: 7, title: "Design UI", description: "improve dashboard design", status: 'done', assignedTo: 1, projectId: 2 },
        { id: 8, title: "Team Meeting", description: "weekly sync meeting", status: 'progress', assignedTo: 2, projectId: 1 },
        { id: 9, title: "Code Review", description: "review pull requests", status: 'todo', assignedTo: 3, projectId: null },
      
        { id: 10, title: "Write Tests", description: "unit tests for components", status: 'progress', assignedTo: 1, projectId: 2 },
        { id: 11, title: "Deploy App", description: "deploy to production", status: 'done', assignedTo: 2, projectId: 1 },
        { id: 12, title: "Fix CSS", description: "alignment issues", status: 'todo', assignedTo: 3, projectId: null },
      
        { id: 13, title: "Research Feature", description: "new dashboard ideas", status: 'progress', assignedTo: 1, projectId: 2 },
        { id: 14, title: "Update Docs", description: "write documentation", status: 'done', assignedTo: 2, projectId: null },
        { id: 15, title: "Optimize Code", description: "improve performance", status: 'todo', assignedTo: 3, projectId: 1 }
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