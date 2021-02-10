import Vue from "vue"
import VueRouter from "vue-router"

import Admin from "@/views/Admin.vue"
import Stream from "@/components/Admin/Stream.vue"
import Chat from "@/components/Admin/Chat.vue"
import Videos from "@/components/Admin/Videos.vue"
import Server from "@/components/Admin/Server.vue"
import About from "@/components/Admin/About.vue"


import Main from "@/views/Main.vue"
import Login from "@/views/Login.vue"
import Video from "@/views/Live.vue"
import Player from "@/views/Player.vue"
import Recordings from "@/views/Recordings.vue"
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