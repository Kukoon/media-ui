<template>
  <v-navigation-drawer :value="showDrawer" @input="toggleDrawer" i app right>
    <v-list dense>
      <v-list-item v-for="page in pages" :key="page.id" link>
        <v-list-item-action>
          <v-icon>{{ page.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ page.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["drawer", "pages"],
  computed: {
    ...mapGetters(["showDrawer"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
  },
};
</script>