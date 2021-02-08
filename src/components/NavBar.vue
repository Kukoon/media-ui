<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title link to="/">media.kukoon.de</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <v-text-field
      solo
      dense
      label="Search..."
      prepend-inner-icon="mdi-magnify"
      hide-details
      class="shrink"
      light
    ></v-text-field> -->
    <v-btn
      v-for="page in pages"
      :key="page.id"
      text
      class="mx-2 mr-1 d-none d-sm-flex"
      :to="page.target"
    >
      {{ page.name }}
    </v-btn>
    <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NavBar",
  props: ["pages"],
  computed: {},
  methods: {
    ...mapActions(["toggleDrawer"]),
  },
};
</script>