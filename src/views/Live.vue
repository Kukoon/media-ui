<template>
  <v-container fluid>
    <h1 class="ma-2">Live</h1>
    <v-row no-gutters>
      <v-col cols="12" md="9">
        <VideoPlayer />
      </v-col>
      <v-col cols="12" md="3"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoPlayer from "../components/VideoPlayer";
export default {
  name: "Live",
  components: { VideoPlayer },
};
</script>