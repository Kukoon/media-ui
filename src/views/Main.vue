<template>
  <div id="Main">
    <NavDrawer />
    <NavBar />
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <v-footer color="grey darken-4" app style="z-index: 10">
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import NavDrawer from "@/components/NavDrawer";

export default {
  name: "Main",
  components: { NavBar, NavDrawer },
  created() {
    // this.$store.dispatch("language");
  },
};
</script>
