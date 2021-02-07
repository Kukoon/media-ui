<template>
  <v-app id="media-ui">
    <NavDrawer :pages="pages" />
    <NavBar :pages="pages" />
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <VideoPlayer />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar";
import NavDrawer from "./components/NavDrawer";

import VideoPlayer from "./components/VideoPlayer";

export default {
  components: { NavBar, NavDrawer, VideoPlayer },
  name: "App",

  data: () => ({
    pages: [
      {
        name: "Channels",
        id: 0,
        icon: "mdi-numeric-1-circle",
      },
    ],
  }),
};
</script>
