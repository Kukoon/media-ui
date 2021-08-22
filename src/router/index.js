import Vue from "vue"
import VueRouter from "vue-router"

// Admin Views
import Admin from "@/views/Admin.vue"
import Channels from "@/views/Admin/Channels.vue"
import Stream from "@/views/Admin/Stream.vue"
import Chat from "@/views/Admin/Chat.vue"
import Videos from "@/views/Admin/Videos.vue"
import Stats from "@/views/Admin/Stats.vue"
import Server from "@/views/Admin/Server.vue"
import About from "@/views/Admin/About.vue"
import Login from "@/views/Admin/Login.vue"

// Main Views
import Main from "@/views/Main.vue"
import Home from "@/views/Main/Home.vue"
import Live from "@/views/Main/Live.vue"
import Player from "@/views/Main/Player.vue"
import Recordings from "@/views/Main/Recordings.vue"

import Single from "@/views/Single.vue"

// Other Components
import VideoGrid from "@/components/VideoGrid.vue"
import VideoList from "@/components/VideoList.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		component: Main,
		children: [
			{
				path: "",
				name: "Home",
				component: Home,
			},
			{
				path: "live/:id",
				name: "Live",
				component: Live,
				props: true
			},
			{
				path: "recordings",
				// Removed name to avoid console warnings about child defaults
				component: Recordings,
				children: [
					// Define empty path to show list per default
					{
						path: "",
						name: "VideoList",
						component: VideoList,
					},
					{
						path: "grid",
						name: "VideoGrid",
						component: VideoGrid,
					}
				]
			},
			{
				path: "play/:id",
				name: "Player",
				component: Player,
				props: true
			},
		]
	},
	{
		path: "/admin",
		name: "Admin",
		component: Admin,
		children: [
			{
				path: "",
				name: "Channels",
				component: Channels
			},
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
	},
	{
		path: "/single/:id",
		component: Single,
		name: "Single",
		props: true
	}
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
})

export default router
