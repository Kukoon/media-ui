<template>
  <div id="Admin">
    <AdminBar />
    <Drawer />

    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import Drawer from "../components/Admin/Drawer";
import AdminBar from "../components/Admin/AdminBar";

export default {
  name: "Main",
  components: { Drawer, AdminBar },
  created() {
    this.$store.commit("toggleDarkMode", true);
    this.$vuetify.theme.dark = this.$store.getters.darkMode;
  },
};
</script>