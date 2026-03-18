<template>
<div class="projects-page">

<h1 class="title">My Projects</h1>

<h2>Projects I Manage</h2>

<div class="projects-grid">
  <ProjectCard
    v-for="project in managedProjects"
    :key="project.id"
    :project="project"
  />
</div>

<h2>Projects I'm In</h2>

<div class="projects-grid">
  <ProjectCard
    v-for="project in memberProjects"
    :key="project.id"
    :project="project"
  />
</div>

</div>
</template>

<script>

import { mapGetters } from "vuex"
import ProjectCard from "../components/ProjectCard.vue"

export default {

components:{ProjectCard},

computed:{
...mapGetters([
"managedProjects",
"memberProjects"
])
}

}
</script>