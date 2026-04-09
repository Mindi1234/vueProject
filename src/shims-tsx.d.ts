import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: any;
    $store: Vuex.Store<any>;
  }
}