<template>
  <div class="chips d-flex-inline align-start">
    <v-chip
      v-for="(speaker, n) in speakers"
      :key="speaker + n"
      small
      class="mr-2 my-1"
      dark
      color="accent"
      label
    >
      <v-icon small left> mdi-account </v-icon>
      <span style="margin-bottom: -2px">{{ speaker.name }}</span>
    </v-chip>
  </div>
</template>
<script>
export default {
  name: "Speakers",
  props: ["speakers"],
};
</script>