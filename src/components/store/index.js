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
        tasks: [
        { id: 1, title: "h.w.", description: "do homework in math", status: false },
        { id: 2, title: "clean", description: "do the dishes", status: false },
        { id: 3, title: "bake", description: "make chocklete chips cookies", status: false }
        ],
        currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    },

    mutations: {
        login(state, payload) {
            const user = state.users.find(
                (u) => u.name === payload.name &&
                u.password === payload.password
            );
            if (user) {
                state.currentUser = user;
                localStorage.setItem("currentUser", JSON.stringify(user));
            } else {
                alert("Invalid username or password");
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
        }
    },

});

