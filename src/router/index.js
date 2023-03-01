import Vue from "vue"
import VueRouter from "vue-router"

// Admin Views
import Admin from "@/views/Admin.vue"
import Login from "@/views/Admin/Login.vue"
import Stats from "@/views/Admin/Stats.vue"
import Server from "@/views/Admin/Server.vue"
import About from "@/views/Admin/About.vue"
import GlobalStreamSchedule from "@/views/Admin/GlobalStreamSchedule.vue"
// for channel
import ChannelDistribution from "@/views/Admin/ChannelDistribution.vue"
import StreamSchedule from "@/views/Admin/StreamSchedule.vue"
import AdminChannelLive from "@/views/Admin/ChannelLive.vue"
import ChannelEdit from "@/views/Admin/ChannelEdit.vue"
import StreamEdit from "@/views/Admin/StreamEdit.vue"
import ChannelRecordings from "@/views/Admin/ChannelRecordings.vue"
import RecordingEdit from "@/views/Admin/RecordingEdit.vue"
import ChannelSpeakers from "@/views/Admin/ChannelSpeakers.vue"
import ChannelEvents from "@/views/Admin/ChannelEvents.vue"

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
						props: true,
						component: VideoGrid,
					},
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
		component: Admin,
		children: [
			{
				path: "",
				name: "Admin",
				redirect: "global-stream-schedule",
			},
			{
				path: "global-stream-schedule",
				name: "Global Stream Schedule",
				component: GlobalStreamSchedule,
			},
			{
				path: "add",
				name: "ChannelAdd",
				component: ChannelEdit,
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
		path: "/admin/:channelid",
		component: Admin,
		props: true,
		children: [
			{
				path: "",
				name: "AdminChannel",
				redirect: "streams",
			},
			{
				path: "live",
				name: "AdminChannelLive",
				component: AdminChannelLive,
				props: true,
			},
			{
				path: "edit",
				name: "ChannelEdit",
				component: ChannelEdit,
				props: true,
			},
			{
				path: "distribution",
				name: "ChannelDistribution",
				component: ChannelDistribution,
				props: true,
			},
			{
				path: "streams",
				name: "StreamSchedule",
				component: StreamSchedule,
				props: true,
			},
			{
				path: "stream",
				name: "StreamAdd",
				component: StreamEdit,
				props: true,
			},
			{
				path: "stream/:streamid",
				name: "StreamEdit",
				component: StreamEdit,
				props: true,
			},
			{
				path: "recordings",
				name: "ChannelRecordings",
				component: ChannelRecordings,
				props: true,
			},
			{
				path: "recording",
				name: "RecordingAdd",
				component: RecordingEdit,
				props: true,
			},
			{
				path: "recording/:recordingid",
				name: "RecordingEdit",
				component: RecordingEdit,
				props: true,
			},
			{
				path: "speakers",
				name: "ChannelSpeakers",
				component: ChannelSpeakers,
				props: true,
			},
			{
				path: "events",
				name: "ChannelEvents",
				component: ChannelEvents,
				props: true,
			},
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
