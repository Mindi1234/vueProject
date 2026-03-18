import Vue from "vue";
import Router from "vue-router";

import LogInPage from '@/mainPages/LogInPage.vue';
import DashBoardPage from '@/mainPages/DashBoardPage.vue';
import ProjectPage from '@/mainPages/ProjectPage.vue';

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
        },
        {
            path: '/project/:id',
            name: 'ProjectPage',
            component: ProjectPage,
        }
    ]
});