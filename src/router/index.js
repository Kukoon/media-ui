import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
import Video from "@/views/Live.vue"
import Channels from "@/views/Channels.vue"
import Recordings from "@/views/Recordings.vue"


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
		path: "/channels",
		name: "Channels",
		component: Channels,
	},
	{
		path: "/recordings",
		name: "Recordings",
		component: Recordings,
	}
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
})

export default router