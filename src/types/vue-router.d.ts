import Vue from "vue";
import VueRouter from "vue-router";

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;
  }
}