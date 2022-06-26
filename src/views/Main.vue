<template>
  <div id="Main">
    <NavDrawer :is-live="isLive" />
    <NavBar :is-live="isLive" />
    <v-main>
      <router-view />
    </v-main>
    <v-footer padless>
      <v-card tile flat width="100%" class="py-4" color="accent">
        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <v-card-text class="white--text px-4">
              <h4 class="pb-2">Kontakt</h4>
              <span>Kulturzentrum Kukoon</span><br />
              <span>Verein für Bunte Kombinationen e.V.</span><br />
              <span>Buntentorsteinweg 29</span><br />
              <span>28201 Bremen</span><br />
              <span>
                <a href="maitlo:verein@kukoon.de">verein@kukoon.de</a>
              </span>
            </v-card-text>
          </v-col>
          <v-col cols="12" lg="6" sm="4" class="ml-auto">
            <v-card-text class="h4 white--text">
              <h4 class="pb-2">Gefördert durch:</h4>
              <v-row no-gutters>
                <v-img
                  v-for="(logoURL, index) in footerLogos"
                  :key="index"
                  :src="logoURL"
                  contain
                  max-width="300"
                  max-height="80"
                  class="mr-auto"
                ></v-img>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import NavDrawer from "@/components/NavDrawer";

import { config } from "../../config.js";
import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";
import { mapGetters } from "vuex";

export default {
  name: "Main",
  components: { NavBar, NavDrawer },
  data() {
    return {
      isLive: true,
      footerLogos: config.sponsorLogos,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  created() {
    if (config.defaultChannel) {
      api.Channels.GetStream(config.defaultChannel).then(
        (resp) => {
          this.isLive = resp.data.running;
          this.connect(resp.data.channel.id);
        },
        () => {
          this.isLive = false;
          api.Channels.Get(config.defaultChannel).then((resp) => {
            this.connect(resp.data.id);
          });
        }
      );
    } else {
      this.isLive = false;
    }
    // this.$store.dispatch("language");
  },
  methods: {
    connect(channelID) {
      websocket.joinHandler(channelID, "status", "main for menu", (ev) => {
        if (this.isLive != ev.running) {
          this.isLive = ev.running;
        }
      });
    },
  },
};
</script>
