<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Videos</h3>
        <v-divider class="mt-2"></v-divider>
        <VideoUpload />
        <VideoManager />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoManager from "@/components/VideoManager.vue";
import VideoUpload from "@/components/VideoUpload.vue";

export default {
  name: "Videos",
  components: { VideoManager, VideoUpload },
};
</script>