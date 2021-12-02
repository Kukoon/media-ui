<template>
  <div class="chips d-flex-inline align-start justify-start">
    <span v-if="createdAt" class="text-caption text--text text--darken-3">
      {{ readableDate(createdAt) }}
    </span>
    <span v-if="viewers" class="text-caption text--text text--darken-3 px-1">{{
      "&bull;"
    }}</span>
    <span v-if="viewers > 0" class="text-caption text--text text--darken-3">
      {{ viewers }} views
    </span>
  </div>
</template>

<script>
export default {
  name: "Metadata",
  props: ["running", "viewers", "createdAt"],
  data() {
    return {
      dateOptions: {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    };
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
