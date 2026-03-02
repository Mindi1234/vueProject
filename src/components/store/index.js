import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        users: [],
        taska: []
    },

    mutations: {
        setUsers(state, users) {
            state.users = users;
        },
        setTaska(state, taska) {
            state.taska = taska;
        }

    },

   getters: {
        getUsers(state) {
            return state.users;
        },
        getTaska(state) {
            return state.taska;
        }
    },

});

