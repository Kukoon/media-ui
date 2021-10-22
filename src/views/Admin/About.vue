<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">About</h3>
        <span>
          This Software "media-ui" is part of a Mediathek Software, developed at
          <a target="_blank" href="https://github.com/Kukoon"
            >github.com/Kukoon</a
          >.
          <br />
          Another Part is "media-server" the Backend with an API, how manage
          e.g. Channels, Streams and Recordings. For Live Streaming it use
          <a target="_blank" href="https://www.ovenmediaengine.com/"
            >OvenMediaEngine</a
          >
          and his API.
        </span>

        <h4 class="mt-2 pb-2">Contributors</h4>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Contact</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in contributes" :key="item.name">
                <td>{{ item.name }}</td>
                <td>
                  <a v-if="item.www" :href="item.www" target="_blank">{{
                    link(item.www)
                  }}</a>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      contributes: [
        {
          name: "janebuoy",
          www: "https://github.com/janebuoy",
        },
        {
          name: "genofire",
          www: "https://fireorbit.de",
        },
      ],
    };
  },
  methods: {
    link(url) {
      return url.replace(/https?:\/\//i, "");
    },
  },
};
</script>
