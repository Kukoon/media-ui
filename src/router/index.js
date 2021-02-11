import Vue from "vue"
import VueRouter from "vue-router"

// Admin Views
import Admin from "@/views/Admin.vue"
import Stream from "@/views/Admin/Stream.vue"
import Chat from "@/views/Admin/Chat.vue"
import Videos from "@/views/Admin/Videos.vue"
import Stats from "@/views/Admin/Stats.vue"
import Server from "@/views/Admin/Server.vue"
import About from "@/views/Admin/About.vue"
import Login from "@/views/Admin/Login.vue"

// Main Views
import Main from "@/views/Main.vue"
import Video from "@/views/Main/Live.vue"
import Player from "@/views/Main/Player.vue"
import Recordings from "@/views/Main/Recordings.vue"

// Other Components
import RecordingsGrid from "@/components/RecordingsGrid.vue"
import RecordingsList from "@/components/RecordingsList.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "Main",
		component: Main,
		children: [
			{
				path: "live",
				name: "Live",
				component: Video,
			},
			{
				path: "recordings",
				// Removed name to avoid console warnings about child defaults
				component: Recordings,
				children: [
					// Define empty path to show list per default
					{
						path: "",
						name: "RecordingsList",
						component: RecordingsList,
					},
					{
						path: "grid",
						name: "RecordingsGrid",
						component: RecordingsGrid,
					}
				]
			},
			{
				path: "play",
				name: "Player",
				component: Player,
			},
		]
	},
	{
		path: "/admin",
		name: "Admin",
		component: Admin,
		children: [
			{
				path: "stream",
				name: "Stream",
				component: Stream
			},
			{
				path: "chat",
				name: "Chat",
				component: Chat
			},
			{
				path: "videos",
				name: "Videos",
				component: Videos
			},
			{
				path: "stats",
				name: "Stats",
				component: Stats
			},
			{
				path: "server",
				name: "Server",
				component: Server
			},
			{
				path: "about",
				name: "About",
				component: About
			}
		]
	},

	{
		path: "/login",
		component: Login,
		name: "Login",
	}
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
})

export default router