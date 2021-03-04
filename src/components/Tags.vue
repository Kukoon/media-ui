<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-chip
      v-if="readableDuration !== null"
      label
      outlined
      small
      class="mr-2 my-1"
    >
      <span style="margin-bottom: -2px">{{ readableDuration }}</span>
    </v-chip>
    <v-chip v-if="running" label small outlined color="error" class="mr-2 my-1">
      <span style="margin-bottom: -2px">Live</span>
    </v-chip>
    <v-chip
      v-for="(tag, n) in tags"
      :key="tag + n"
      small
      class="mr-2 my-1"
      label
    >
      <v-icon small left> mdi-label </v-icon>
      <span style="margin-bottom: -2px" v-if="tag.lang !== null">
        {{ tag.lang.name }}
      </span>
    </v-chip>
  </div>
</template>

<script>
import prettyMilliseconds from "pretty-ms";

export default {
  name: "Tags",
  props: ["duration", "tags", "running"],
  computed: {
    readableDuration() {
      if (this.duration) {
        return prettyMilliseconds(this.duration / 1000000, {
          colonNotation: true,
        });
      } else {
        return null;
      }
    },
  },
};
</script>
