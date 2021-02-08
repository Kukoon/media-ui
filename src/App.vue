<template>
  <v-app id="media-ui">
    <NavDrawer :pages="pages" />
    <NavBar :pages="pages" />
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="grey darken-4" app style="z-index: 10">
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar";
import NavDrawer from "./components/NavDrawer";

export default {
  components: { NavBar, NavDrawer },
  name: "App",

  data: () => ({
    pages: [
      {
        name: "Live",
        target: "../live",
        id: 0,
        icon: "mdi-broadcast",
      },
      {
        name: "Channels",
        target: "../channels",
        id: 1,
        icon: "mdi-television-classic",
      },
      {
        name: "Recordings",
        target: "../recordings",
        id: 2,
        icon: "mdi-video-vintage",
      },
    ],
  }),
};
</script>
