<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Stream</h3>
        <v-divider class="mt-2"></v-divider>
        <StreamCurrent />
        <StreamSettings />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StreamCurrent from "@/components/StreamCurrent";
import StreamSettings from "@/components/StreamSettings";

export default {
  name: "Stream",
  components: { StreamCurrent, StreamSettings },
  data() {
    return {};
  },
};
</script>