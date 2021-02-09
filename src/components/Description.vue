<template>
  <div>
    <v-card-title>
      {{ meta.name }}
    </v-card-title>
    <v-card-subtitle v-if="meta.subtitle !== undefined">
      {{ meta.subtitle }}
    </v-card-subtitle>
    <!-- Show Tags -->
    <div class="px-4">
      <MetaChips
        v-if="chipsPosition === 'top'"
        :speakers="meta.speakers"
        :tags="meta.tags"
        :length="meta.length"
      />
    </div>
    <v-card-text>
      {{ meta.short }}
    </v-card-text>
    <div class="px-4">
      <MetaChips
        v-if="chipsPosition === 'bottom'"
        :speakers="meta.speakers"
        :tags="meta.tags"
        :length="meta.length"
      />
    </div>
  </div>
</template>

<script>
import MetaChips from "./MetaChips.vue";

export default {
  name: "VideoText",
  components: { MetaChips },
  props: ["meta", "chipsPosition"],
};
</script>