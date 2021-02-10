<template>
  <v-container fluid id="Recordings">
    <v-row no-gutters>
      <!-- <v-tabs fixed-tabs accent class="ma-2">
        <v-tab to="../recordings/grid">Grid</v-tab>
        <v-tab to="../recordings">List</v-tab>
      </v-tabs> -->
      <v-spacer />
      <v-btn-toggle
        mandatory
        dense
        class="ma-1 align-self-center d-none d-sm-flex"
        borderless
        tile
        group
        color="accent"
      >
        <v-btn to="../recordings" exact>
          <span>List</span>
          <v-icon right class="pr-2">mdi-view-list</v-icon>
        </v-btn>
        <v-btn to="../recordings/grid" exact>
          <span>Grid</span>
          <v-icon right small class="pr-2">mdi-view-grid</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <router-view></router-view>
  </v-container>
</template>

<script>
export default {
  name: "Recordings",
};
</script>