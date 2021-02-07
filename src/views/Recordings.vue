<template>
  <div>
    <h1 class="ma-2">Recordings</h1>
    <v-tabs class="ma-2">
      <v-tab to="../recordings/grid">Grid</v-tab>
      <v-tab to="../recordings/list">List</v-tab>
    </v-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Recordings",
};
</script>