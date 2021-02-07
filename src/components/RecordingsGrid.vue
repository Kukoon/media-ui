<template>
  <v-container fluid>
    <v-row dense class="mx-n2">
      <v-col v-for="(recording, n) in recordings" cols="12" md="6" :key="n">
        <v-card class="pa-2 ma-2" outlined tile>
          <v-responsive :aspect-ratio="16 / 9">
            <v-img
              :src="recording.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="100%"
              width="100%"
            >
              <v-card-title @click="toggle" class="transparent">
                {{ recording.name }}
              </v-card-title>
            </v-img>
          </v-responsive>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "RecordingsGrid",
  data: () => ({
    selected: [],
    recordings: [
      {
        name: "Polizeigewalt - ein deutsches Problem",
        thumbnail:
          "https://media.kukoon.de/videos/df1555f5-7046-4f7a-adcc-195b73949723/542685cb-3693-e720-a957-f008f5dae3ee_20201211_165251mp4",
        id: 0,
      },
      {
        name:
          "Pushbacks, Internierung, Zugangshürden – Zum Stand des europäischen Migrations- und Grenzregimes",
        thumbnail:
          "https://media.kukoon.de/videos/df1555f5-7046-4f7a-adcc-195b73949723/edb1cfbb-3476-d639-b3f5-795fabf4ef4d_20210207_111945mp4",
        id: 1,
      },
      {
        name: "Das Faschistische Jahrhundert",
        thumbnail:
          "https://media.kukoon.de/videos/df1555f5-7046-4f7a-adcc-195b73949723/45da89a7-e5e0-5104-b937-6d4c2d4b6d00_20210201_111916mp4",
        id: 1,
      },
    ],
  }),
};
</script>

<style scoped>
.transparent {
  background-color: rgba(56, 56, 56, 0.7) !important;
}
</style>