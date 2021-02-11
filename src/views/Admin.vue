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
import Drawer from "@/components/AdminDrawer";
import AdminBar from "@/components/AdminBar";

export default {
  name: "Admin",
  components: { Drawer, AdminBar },
  created() {
    this.$store.commit("toggleDarkMode", true);
    this.$vuetify.theme.dark = this.$store.getters.darkMode;
  },
};
</script>