import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
import Video from "@/views/Live.vue"
import Player from "@/views/Player.vue"
import Recordings from "@/views/Recordings.vue"
import RecordingsGrid from "@/components/RecordingsGrid.vue"
import RecordingsList from "@/components/RecordingsList.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/live",
		name: "Live",
		component: Video,
	},
	{
		path: "/player",
		name: "Player",
		component: Player,
	},
	{
		path: "/recordings",
		name: "Recordings",
		component: Recordings,
		children: [
			// Define empty path to show list per default
			{
				path: "",
				component: RecordingsList,
			},
			{
				path: "grid",
				component: RecordingsGrid,
			},
			// {
			// 	path: "list",
			// 	component: RecordingsList,
			// }
		]
	}
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
})

export default router