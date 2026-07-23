import { FaAward, FaUser, FaShieldAlt, FaScroll, FaPaw, FaTrophy } from 'react-icons/fa';
import * as Page from 'src/pages';

export const PAGES = [
	{
		name: 'Player',
		about: 'Search for the stats of a Hypixel player',
		path: 'player',
		tags: ['player'],
		component: Page.PlayerPage,
		icon: FaUser
	},
	{
		name: 'Guild',
		about: 'Search for the guild of a Hypixel player',
		path: 'guild',
		tags: ['guild', 'g'],
		component: Page.GuildPage,
		icon: FaShieldAlt
	},
	{
		name: 'Leaderboard',
		about: 'Explore top Hypixel player and guild leaderboards',
		path: 'leaderboard',
		tags: ['leaderboard', 'lb'],
		component: Page.LeaderboardPage,
		isDirectLink: true,
		icon: FaTrophy
	},
	{
		name: 'Achievements',
		about: 'Search for the achievements of a Hypixel player',
		path: 'achievements',
		tags: ['achievements', 'a'],
		component: Page.AchievementsPage,
		icon: FaAward
	},
	{
		name: 'Quests',
		about: 'Search for the quests of a Hypixel player',
		path: 'quests',
		tags: ['quests', 'q'],
		component: Page.QuestsPage,
		icon: FaScroll
	},
	{
		name: 'Pets',
		about: 'Search for the pets of a Hypixel player',
		path: 'pets',
		tags: ['pets', 'p'],
		component: Page.PetsPage,
		icon: FaPaw
	},
];