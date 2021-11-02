<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-chip
      v-if="createdAt"
      label
      small
      color="pink"
      class="mr-2 my-1"
    >
      {{ readableDate(createdAt) }}
    </v-chip>
    <v-chip
      v-if="readableDuration !== null"
      label
      outlined
      small
      class="mr-2 my-1"
    >
      <span style="margin-bottom: -2px">{{ readableDuration }}</span>
    </v-chip>
    <v-chip
      v-if="running"
      label
      small
      color="red"
      class="mr-2 my-1"
    >
      <span style="margin-bottom: -2px">Live</span>
    </v-chip>
    <v-chip
      v-if="viewers > 0"
      label
      small
      outlined
      color="cyan"
      class="mr-2 my-1"
    >
      <v-icon
        small
        left
      >
        mdi-account
      </v-icon>
      Views
      <v-avatar
        small
        right
      >
        {{ viewers }}
      </v-avatar>
    </v-chip>
  </div>
</template>

<script>
import prettyMilliseconds from "pretty-ms";

export default {
  name: "Metadata",
  props: ["duration", "running", "viewers", "createdAt"],
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
  methods: {
    readableDate(dateString) {
      return new Date(dateString).toLocaleDateString(
        undefined,
        this.dateOptions
      );
    },
  },
};
</script>
