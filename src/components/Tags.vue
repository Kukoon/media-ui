<template>
  <div class="chips d-flex-inline align-start justify-start">
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
    <v-chip label outlined small class="mr-2 my-1">
      <span style="margin-bottom: -2px">{{ length }}</span>
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "Tags",
  props: ["length", "tags"],
};
</script>