<template>
  <div>
    <h1 class="ma-2">Live</h1>
    <VideoPlayer />
  </div>
</template>

<script>
import VideoPlayer from "../components/VideoPlayer";
export default {
  name: "Live",
  components: { VideoPlayer },
};
</script>