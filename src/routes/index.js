import Vue from "vue";
import Router from "vue-router";

import LogInPage from '@/components/LogInPage.vue';
import DashBoardPage from '@/components/DashBoardPage.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'LogInPage',
            component: LogInPage
        },
        {
            path: '/dashboard',
            name: 'DashBoardPage',
            component: DashBoardPage,
        }
    ]
});