<template>
  <div class="chips">
    <v-chip label outlined small class="mr-2 my-1">
      {{ length }}
    </v-chip>
    <v-chip
      v-for="(tag, n) in tags"
      :key="tag + n"
      small
      class="mr-2 my-1"
      color="neutral"
      label
    >
      <v-icon small left> mdi-label </v-icon>
      {{ tag }}
    </v-chip>
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
      {{ speaker }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "RecordingsChips",
  props: ["length", "speakers", "tags"],
};
</script>