<template>
  <div id="VideoList" class="px-2">
    <v-data-table
      :headers="headers"
      :items="videos"
      sort-by="created_at"
      sort-desc
      :single-expand="true"
      show-expand
    >
      <template #item.poster="{ item }">
        <v-img :src="item.poster" alt="Poster" max-height="48" max-width="27" />
      </template>
      <template #item.lang.title="{ item }">
        <span>
          {{
            item.lang.title
              ? item.lang.title
              : item.common_name
              ? item.common_name
              : item.id
          }}
        </span>
      </template>
      <template #item.duration="{ item }">
        {{ readableDuration(item.duration) }}
      </template>
      <template #item.created_at="{ item }">
        {{ readableDate(item.created_at) }}
      </template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length" class="pl-0">
          <v-responsive
            :aspect-ratio="16 / 9"
            class="mt-4 px-4"
            max-width="550"
          >
            <Poster :video="item" :is-stream="false" />
          </v-responsive>
          <VideoDescription
            :video="item"
            :tags-position="'top'"
            :showMeta="false"
            :long="true"
            class="pt-3 px-4"
          />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import prettyMilliseconds from "pretty-ms";

import Poster from "@/components/Poster.vue";
import VideoDescription from "@/components/VideoDescription.vue";

export default {
  name: "VideoList",
  components: {
    Poster,
    VideoDescription,
  },
  props: ["videos"],

  data() {
    return {
      headers: [
        {
          text: "Title",
          align: "start",
          value: "lang.title",
          width: "15%",
        },
        { text: "Duration", value: "duration", align: "end" },
        { text: "Views", value: "viewers", align: "end" },
        { text: "Date", value: "created_at", align: "end" },
        { text: "", value: "data-table-expand" },
      ],
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    readableDuration(duration) {
      return prettyMilliseconds(duration / 1000000, {
        colonNotation: true,
      });
    },
    readableDate(dateString) {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
};
</script>
