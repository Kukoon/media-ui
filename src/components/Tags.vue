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
    <v-chip v-if="running" label small color="red" text-color="white" class="mr-2 my-1">
      <span style="margin-bottom: -2px">Live</span>
    </v-chip>
    <v-chip v-if="event" label small color="orange" class="mr-2 my-1" :to="{ name: filterView, query: { event: event.id } }">
      <v-icon small left>mdi-calendar</v-icon>
      {{ event.name }}
    </v-chip>
    <v-chip v-if="viewers > 0" label small outlined color="cyan" class="mr-2 my-1">
      <v-icon small left>mdi-account</v-icon>
	Viewers
      <v-avatar small right>{{ viewers }}</v-avatar>
    </v-chip>
    <v-chip
      v-for="(tag, n) in tags"
      :key="tag + n"
      small
      class="mr-2 my-1"
      label
      :to="{ name: filterView, query: { tag: tag.id } }"
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
  props: ["duration", "event", "tags", "running", "viewers"],
  computed: {
    filterView() {return this.$router.history.current.name == 'VideoGrid'?'VideoGrid':'VideoList';},
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
