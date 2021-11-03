<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3 class="pb-2">About</h3>
        <span>
          This Software <code>media-ui</code> is part of a Mediathek Software,
          developed at
          <a target="_blank" href="https://github.com/Kukoon"
            >github.com/Kukoon</a
          >. Issues can be reported at
          <a target="_blank" href="https://github.com/Kukoon/media-ui/issues"
            >github.com/Kukoon/media-ui/issues</a
          >.
          <br />
          The backend <code>media-server</code> manages channels, streams and
          recordings.
          <br />
          For Live Streaming we use
          <a target="_blank" href="https://www.ovenmediaengine.com/"
            >OvenMediaEngine</a
          >.
        </span>

        <h4 class="mt-2 pb-2">Contributors</h4>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Contact</th>
                <th class="text-left">Contributions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in contributors" :key="item.name">
                <td>
                  <v-avatar size="32px" class="mr-2">
                    <v-img :src="item.avatar_url" alt="Avatar" /> </v-avatar
                  >{{ item.login }}
                </td>
                <td>
                  <a
                    v-if="item.html_url"
                    :href="item.html_url"
                    target="_blank"
                    >{{ link(item.html_url) }}</a
                  >
                </td>
                <td>{{ item.contributions }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "About",
  data() {
    return {
      loaded: false,
      contributors: [],
    };
  },
  methods: {
    link(url) {
      return url.replace(/https?:\/\//i, "");
    },
    getContributors() {
      axios
        .get("https://api.github.com/repos/Kukoon/media-ui/contributors")
        .then((resp) => {
          console.log(resp.data);
          this.contributors = resp.data;
        });
    },
  },
  created() {
    this.getContributors();
  },
};
</script>