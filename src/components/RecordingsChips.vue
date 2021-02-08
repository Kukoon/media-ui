<template>
  <div class="chips">
    <v-chip label outlined small class="mr-2 my-1">
      <span style="margin-bottom: -2px">{{ length }}</span>
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
      <span style="margin-bottom: -2px">{{ tag }}</span>
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
      <span style="margin-bottom: -2px">{{ speaker.name }}</span>
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "RecordingsChips",
  props: ["length", "speakers", "tags"],
};
</script>