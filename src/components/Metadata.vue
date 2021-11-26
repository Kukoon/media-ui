<template>
  <div class="chips d-flex-inline align-start justify-start">
    <v-chip v-if="createdAt" label small color="pink" class="mr-2 my-1 px-2">
      {{ readableDate(createdAt) }}
    </v-chip>
    <v-chip v-if="running" label small color="red" class="mr-2 my-1">
      <span style="margin-bottom: -2px">Live</span>
    </v-chip>
    <v-chip
      v-if="viewers > 0"
      label
      small
      outlined
      color="cyan"
      class="mr-2 my-1 pr-2"
    >
      <v-icon small left> mdi-account </v-icon>
      Views
      <v-avatar small right>
        {{ viewers }}
      </v-avatar>
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "Metadata",
  props: ["running", "viewers", "createdAt"],
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
