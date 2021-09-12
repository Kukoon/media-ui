<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Videos</h3>
        <v-divider class="mt-2"></v-divider>
        <VideoManager :channelid="channelid" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoManager from "@/components/VideoManager.vue";

export default {
  name: "ChannelRecordings",
  components: { VideoManager },
  props: ["channelid"],
};
</script>
