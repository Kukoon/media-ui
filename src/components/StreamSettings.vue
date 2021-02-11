<template>
  <v-expansion-panels accordion tile class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span class="text-truncate">Stream Settings</span>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card tile elevation="0" class="pa-0">
          <v-card-text class="pa-0 d-flex flex-column justify-end">
            <span class="subtitle-1">Stream Key</span>
            <v-row no-gutters class="pt-2 pb-4">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                hide-details
              ></v-text-field>
            </v-row>
            <span class="subtitle-1">XMPP Token</span>
            <v-row no-gutters class="pt-2 pb-4">
              <v-text-field
                :color="darkMode ? 'grey lighten-3' : 'grey darken-2'"
                outlined
                dense
                label="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                hide-details
              ></v-text-field>
            </v-row>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StreamSettings",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
};
</script>