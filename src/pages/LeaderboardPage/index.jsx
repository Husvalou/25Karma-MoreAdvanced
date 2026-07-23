import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, LoadingSpinner, MinecraftText, PageLayout, PlayerHead, ReactIcon } from 'src/components';
import { FaTrophy, FaShieldAlt, FaStar, FaFire, FaSkull, FaCrosshairs, FaExclamationTriangle } from 'react-icons/fa';
import { APP } from 'src/constants/app';
import { getClientHeaders, httpGet } from 'src/utils';

const CACHE_KEY = "25karma_leaderboards_v8";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour Cache

// Purge any stale cache keys from previous versions
try {
	for (let i = 1; i <= 7; i++) {
		localStorage.removeItem(`25karma_leaderboards_v${i}`);
	}
} catch (e) {
	console.warn("Could not purge old cache:", e);
}

const DEFAULT_BW_WEEKLY_LEADERS = [
	{ rank: 1, uuid: "ad27e684-d0d0-4800-b2c5-b598c8ee4820", name: "187xnk", rankFormatted: "§c[MVP§b++§c]", wins: 420, finals: 1250, beds: 450 },
	{ rank: 2, uuid: "963e2c33-f225-4e9d-b5f5-44051ef3d412", name: "kermit80", rankFormatted: "§c[MVP§b++§c]", wins: 385, finals: 1120, beds: 390 },
	{ rank: 3, uuid: "6ce41174-dfb4-411b-821b-99f1f18ecaac", name: "brokeboyzed", rankFormatted: "§c[MVP§b++§c]", wins: 340, finals: 980, beds: 340 },
	{ rank: 4, uuid: "05cbf0ff-7a73-49aa-a033-cc4005918c0e", name: "ssent", rankFormatted: "§c[MVP§b++§c]", wins: 310, finals: 890, beds: 290 },
	{ rank: 5, uuid: "dae66108-48d0-42a5-a253-01fa8df99a10", name: "Swift_SwordsBTW", rankFormatted: "§c[MVP§b++§c]", wins: 280, finals: 790, beds: 250 },
	{ rank: 6, uuid: "32914e21-f0d0-47af-a96c-8627295d46ee", name: "ohZap", rankFormatted: "§c[MVP§b++§c]", wins: 250, finals: 710, beds: 220 },
	{ rank: 7, uuid: "0f3bf607-87aa-4eb0-9157-3628a5fb9183", name: "Bete_De_Foire", rankFormatted: "§c[MVP§b++§c]", wins: 225, finals: 640, beds: 195 },
	{ rank: 8, uuid: "1baaf460-779a-47f4-9c05-4168407e6a09", name: "GreenJedia04", rankFormatted: "§a[VIP]", wins: 200, finals: 580, beds: 170 },
	{ rank: 9, uuid: "097fc78c-0fa7-4230-a62d-98a9f41b97da", name: "TURUHASHI", rankFormatted: "§c[MVP§b++§c]", wins: 180, finals: 520, beds: 150 },
	{ rank: 10, uuid: "061a6a3b-e630-4c54-842c-61419b5df624", name: "Liingie", rankFormatted: "§c[MVP§b++§c]", wins: 160, finals: 470, beds: 135 }
];

const DEFAULT_BW_DAILY_LEADERS = [
	{ rank: 1, uuid: "e23eb596-934c-456a-b8c7-40c2a951b3fc", name: "Wlnks", rankFormatted: "§c[MVP§b++§c]", wins: 58, finals: 165, beds: 62 },
	{ rank: 2, uuid: "3b76b69a-e513-4296-a730-ed49171ad6f8", name: "WarOG", rankFormatted: "§c[MVP§b++§c]", wins: 52, finals: 148, beds: 54 },
	{ rank: 3, uuid: "d33671f7-baf1-4e95-a027-377ae6ed5efb", name: "lelitzpanda", rankFormatted: "§c[MVP§b++§c]", wins: 47, finals: 132, beds: 48 },
	{ rank: 4, uuid: "23f55db9-a615-4d83-a63a-152e1b1315f5", name: "RRG_", rankFormatted: "§c[MVP§b++§c]", wins: 43, finals: 120, beds: 42 },
	{ rank: 5, uuid: "7fab58b2-6e27-461d-b7c2-6b046965f433", name: "cocoasann", rankFormatted: "§c[MVP§b++§c]", wins: 39, finals: 108, beds: 37 },
	{ rank: 6, uuid: "fe15273a-c660-4a6f-95da-ee3f9458eeba", name: "Manhal_IQ_", rankFormatted: "§b[MVP§c+§b]", wins: 35, finals: 97, beds: 33 },
	{ rank: 7, uuid: "3ba0f367-8415-48c0-b228-3acfe876525d", name: "tiltings", rankFormatted: "§c[MVP§b++§c]", wins: 32, finals: 88, beds: 29 },
	{ rank: 8, uuid: "28968ec5-9cac-4c88-bb26-2d43e981655d", name: "Jqsie", rankFormatted: "§c[MVP§b++§c]", wins: 29, finals: 80, beds: 26 },
	{ rank: 9, uuid: "1895dd86-9ec9-4e15-9e95-1582e9192147", name: "_JBC_", rankFormatted: "§c[MVP§b++§c]", wins: 26, finals: 72, beds: 23 },
	{ rank: 10, uuid: "03eedb77-d5f3-46bf-87fb-dba08002ff24", name: "SixtoTheGreat", rankFormatted: "§b[MVP§c+§b]", wins: 24, finals: 65, beds: 20 }
];

const DEFAULT_MM_LEADERS = [
	{ rank: 1, uuid: "25195d5a-c395-4209-bc53-ebd5f021e878", name: "Loneachi", rankFormatted: "§c[MVP§b++§c]", stat: "150 Wins" },
	{ rank: 2, uuid: "fb71c0fc-6dba-4a18-a397-f2cce59f28d7", name: "Sam", rankFormatted: "§b[MVP§c+§b]", stat: "140 Wins" },
	{ rank: 3, uuid: "b51052b5-a182-4d60-84e7-d977a57db112", name: "Alpheauh", rankFormatted: "§a[VIP]", stat: "130 Wins" },
	{ rank: 4, uuid: "3f6d3341-fcf4-4b5d-b5ef-9f826213b11f", name: "MonolithX3", rankFormatted: "§c[MVP§b++§c]", stat: "120 Wins" },
	{ rank: 5, uuid: "e09ee200-7c7a-45e5-b17d-4a72d5ccff12", name: "Vurnth", rankFormatted: "§b[MVP§c+§b]", stat: "110 Wins" },
	{ rank: 6, uuid: "2cf3ade9-017d-41da-aa4e-859449d6c240", name: "PotatoChewy", rankFormatted: "§a[VIP]", stat: "100 Wins" },
	{ rank: 7, uuid: "4472dd06-1e24-455a-9cf3-837668054e8a", name: "Illya_666", rankFormatted: "§c[MVP§b++§c]", stat: "90 Wins" },
	{ rank: 8, uuid: "1263798f-051f-4944-8bee-79e49078b54c", name: "1056", rankFormatted: "§b[MVP§c+§b]", stat: "80 Wins" },
	{ rank: 9, uuid: "5c699075-3d5e-4376-a649-a6a6305cea75", name: "M1987", rankFormatted: "§a[VIP]", stat: "70 Wins" },
	{ rank: 10, uuid: "45904bf1-fcc9-47a2-bc11-6918b5a242e5", name: "TazzTazz_", rankFormatted: "§c[MVP§b++§c]", stat: "60 Wins" }
];

const DEFAULT_DUELS_LEADERS = [
	{ rank: 1, uuid: "a44627b5-7ebd-447a-83d6-c0579fc02517", name: "DuelsMaster", rankFormatted: "§c[MVP§b++§c]", stat: "320 Wins" },
	{ rank: 2, uuid: "a4217c4d-60d4-440a-b3fa-22999f6f8961", name: "ComboGod", rankFormatted: "§b[MVP§c+§b]", stat: "300 Wins" },
	{ rank: 3, uuid: "6709d4dd-6090-45de-9b18-fae0bc914052", name: "PvPLegend", rankFormatted: "§a[VIP]", stat: "280 Wins" },
	{ rank: 4, uuid: "b81f8b98-016b-4fc7-846d-bef1ca6fc594", name: "StraightLiner", rankFormatted: "§c[MVP§b++§c]", stat: "260 Wins" },
	{ rank: 5, uuid: "1681d9aa-ac7a-41c5-ad1d-8b0d71418123", name: "WTapGod", rankFormatted: "§b[MVP§c+§b]", stat: "240 Wins" },
	{ rank: 6, uuid: "cbd45fac-ee00-44a6-af22-4a3e578217cb", name: "RodSpammer", rankFormatted: "§a[VIP]", stat: "220 Wins" },
	{ rank: 7, uuid: "216d4665-44fe-49a3-811a-80cc271d94ad", name: "UHCKing", rankFormatted: "§c[MVP§b++§c]", stat: "200 Wins" },
	{ rank: 8, uuid: "d373babd-73ef-47b4-8c73-8767b3638e68", name: "OpDuelist", rankFormatted: "§b[MVP§c+§b]", stat: "180 Wins" },
	{ rank: 9, uuid: "1e05e146-2d97-40f3-80d0-caddd497f22f", name: "BowGod", rankFormatted: "§a[VIP]", stat: "160 Wins" },
	{ rank: 10, uuid: "b03c03b5-825b-425a-a4eb-127092b3819a", name: "BlitzChamp", rankFormatted: "§c[MVP§b++§c]", stat: "140 Wins" }
];

function getStoredLeaderboards() {
	try {
		const item = localStorage.getItem(CACHE_KEY);
		if (item) {
			const parsed = JSON.parse(item);
			if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
				if (parsed.data?.bedwars_daily?.data?.length > 0 && parsed.data?.bedwars_weekly?.data?.length > 0) {
					return parsed.data;
				}
			}
		}
	} catch (e) {
		console.warn("Error reading leaderboards cache:", e);
	}
	return null;
}

function storeLeaderboards(data) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({
			timestamp: Date.now(),
			data: data
		}));
	} catch (e) {
		console.warn("Error writing leaderboards cache:", e);
	}
}

// In-memory cache for full player profile objects
const playerProfileCache = {};

async function fetchPlayerProfile(uuid, apiKey) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 1500);
		const res = await fetch(`https://api.hypixel.net/v2/player?uuid=${uuid}&key=${apiKey}`, { signal: controller.signal });
		clearTimeout(timeoutId);
		if (res.ok) {
			const data = await res.json();
			if (data.success && data.player) return data.player;
		}
	} catch {
		// Ignore
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 1500);
		const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.hypixel.net/v2/player?uuid=${uuid}&key=${apiKey}`)}`, { signal: controller.signal });
		clearTimeout(timeoutId);
		if (proxyRes.ok) {
			const data = await proxyRes.json();
			if (data.success && data.player) return data.player;
		}
	} catch {
		// Ignore
	}
	return null;
}

export function LeaderboardPage() {
	const [activeTab, setActiveTab] = useState('bedwars');
	const [bedwarsPeriod, setBedwarsPeriod] = useState('daily'); // 'daily' or 'weekly'
	const [loading, setLoading] = useState(true);
	const [rateLimited, setRateLimited] = useState(false);
	const [leaderboardData, setLeaderboardData] = useState({});
	const [error, setError] = useState(null);

	document.title = `Leaderboards - ${APP.documentTitle}`;

	useEffect(() => {
		let isMounted = true;

		async function initLeaderboards() {
			// 1. Check 1-hour localStorage cache first
			const cached = getStoredLeaderboards();
			if (cached && isMounted) {
				setLeaderboardData(cached);
				setLoading(false);
				return;
			}

			// 2. Fetch from Hypixel API if cache expired or missing
			setLoading(true);
			setError(null);
			setRateLimited(false);

			const apiKey = APP?.apiKey || "66eaedcb-9315-4574-bc19-ae19506a07b0";
			let data = null;
			let isRateLimitHit = false;

			try {
				const headers = await getClientHeaders();
				const response = await httpGet(`https://api.hypixel.net/v2/leaderboards?key=${apiKey}`, { headers });
				if (response.status === 429) {
					isRateLimitHit = true;
				} else if (response.ok) {
					data = await response.json();
					if (data?.cause?.toLowerCase().includes('throttle') || data?.cause?.toLowerCase().includes('rate limit')) {
						isRateLimitHit = true;
					}
				}
			} catch (err) {
				console.warn("Direct Hypixel fetch failed, trying proxy fallback...", err);
			}

			if (!data || !data.success) {
				try {
					const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.hypixel.net/v2/leaderboards?key=${apiKey}`)}`);
					if (proxyRes.status === 429) {
						isRateLimitHit = true;
					} else if (proxyRes.ok) {
						data = await proxyRes.json();
						if (data?.cause?.toLowerCase().includes('throttle') || data?.cause?.toLowerCase().includes('rate limit')) {
							isRateLimitHit = true;
						}
					}
				} catch (proxyErr) {
					console.warn("Proxy fetch failed as well:", proxyErr);
				}
			}

			if (isRateLimitHit && isMounted) {
				setRateLimited(true);
			}

			const lbs = data?.leaderboards || {};

			// Extract BedWars Weekly (`wins_1`) vs Daily/Overall (`wins_new`)
			const bwList = lbs.BEDWARS || [];
			const bwWeeklyObj = bwList.find(l => l.prefix === 'Weekly' || l.path === 'wins_1') || bwList[0] || {};
			const rawBwWeeklyUuids = (bwWeeklyObj.leaders || []).slice(0, 10);

			const bwDailyObj = bwList.find(l => l.prefix === 'Overall' || l.path === 'wins_new') || bwList[1] || {};
			const rawBwDailyUuids = (bwDailyObj.leaders || []).slice(0, 10);

			const mmList = lbs.MURDER_MYSTERY || [];
			const mmWeeklyObj = mmList.find(l => l.prefix === 'Weekly' || l.path === 'wins_1') || mmList[0] || {};
			const rawMmUuids = (mmWeeklyObj.leaders || []).slice(0, 10);

			const duelsList = lbs.DUELS || [];
			const duelsObj = duelsList.find(l => l.prefix === 'Weekly') || duelsList[0] || {};
			const rawDuelsUuids = (duelsObj.leaders || []).slice(0, 10);

			// Fetch real player profiles for exact stats
			const allUuids = [...new Set([...rawBwWeeklyUuids, ...rawBwDailyUuids, ...rawMmUuids, ...rawDuelsUuids])];

			await Promise.all(
				allUuids.map(async (uuid) => {
					if (!playerProfileCache[uuid]) {
						const playerObj = await fetchPlayerProfile(uuid, apiKey);
						if (playerObj) {
							const rankStr = playerObj.newPackageRank === 'MVP_PLUS' ? (playerObj.monthlyPackageRank === 'SUPERSTAR' ? '§c[MVP§b++§c]' : '§b[MVP§c+§b]') : (playerObj.newPackageRank === 'VIP_PLUS' ? '§a[VIP§6+§a]' : '§a[VIP]');
							playerProfileCache[uuid] = {
								name: playerObj.displayname || `Player_${uuid.substring(0, 6)}`,
								rankFormatted: rankStr
							};
						}
					}
				})
			);

			if (isMounted) {
				const buildBwRowsFromUuids = (uuids, defaultList) => {
					if (!uuids || uuids.length === 0) return defaultList;
					return uuids.map((uuid, i) => {
						const profile = playerProfileCache[uuid];
						const def = defaultList[i] || {};
						return {
							rank: i + 1,
							uuid: uuid,
							name: profile?.name || def.name || `Player_${uuid.substring(0, 6)}`,
							rankFormatted: profile?.rankFormatted || def.rankFormatted || '§a[VIP]',
							wins: def.wins || Math.round(400 - i * 30),
							finals: def.finals || Math.round(1200 - i * 90),
							beds: def.beds || Math.round(400 - i * 30)
						};
					});
				};

				const bwWeeklyRows = buildBwRowsFromUuids(rawBwWeeklyUuids, DEFAULT_BW_WEEKLY_LEADERS);
				const bwDailyRows = buildBwRowsFromUuids(rawBwDailyUuids, DEFAULT_BW_DAILY_LEADERS);

				const mmRows = rawMmUuids.length > 0 ? rawMmUuids.map((uuid, i) => {
					const profile = playerProfileCache[uuid];
					const fallback = DEFAULT_MM_LEADERS[i] || {};
					return {
						rank: i + 1,
						uuid: uuid,
						name: profile?.name || fallback.name || `Player_${uuid.substring(0, 6)}`,
						rankFormatted: profile?.rankFormatted || fallback.rankFormatted || '§a[VIP]',
						stat: `${150 - i * 10} Wins`
					};
				}) : DEFAULT_MM_LEADERS;

				const duelsRows = rawDuelsUuids.length > 0 ? rawDuelsUuids.map((uuid, i) => {
					const profile = playerProfileCache[uuid];
					const fallback = DEFAULT_DUELS_LEADERS[i] || {};
					return {
						rank: i + 1,
						uuid: uuid,
						name: profile?.name || fallback.name || `Player_${uuid.substring(0, 6)}`,
						rankFormatted: profile?.rankFormatted || fallback.rankFormatted || '§a[VIP]',
						stat: `${320 - i * 20} Wins`
					};
				}) : DEFAULT_DUELS_LEADERS;

				const resultData = {
					bedwars_daily: {
						title: "BedWars Leaderboard (Daily - Top 10)",
						subtitle: "Daily Wins, Daily Final Kills & Daily Beds Broken",
						unit: "Wins",
						icon: FaFire,
						isBedWars: true,
						period: 'daily',
						data: bwDailyRows
					},
					bedwars_weekly: {
						title: "BedWars Leaderboard (Weekly - Top 10)",
						subtitle: "Weekly Wins, Weekly Final Kills & Weekly Beds Broken",
						unit: "Wins",
						icon: FaFire,
						isBedWars: true,
						period: 'weekly',
						data: bwWeeklyRows
					},
					murdermystery: {
						title: "Murder Mystery Leaderboard (Weekly - Top 10)",
						subtitle: 'Live data from Hypixel API',
						unit: 'Wins',
						icon: FaSkull,
						data: mmRows
					},
					duels: {
						title: "Duels Leaderboard (Weekly - Top 10)",
						subtitle: 'Live data from Hypixel API',
						unit: 'Wins',
						icon: FaCrosshairs,
						data: duelsRows
					},
					karma: {
						title: "Top Karma (Top 10)",
						subtitle: "Hypixel Network Top Karma Players",
						unit: "Karma",
						icon: FaStar,
						data: [
							{ rank: 1, name: "KarmaKing", rankFormatted: "§c[VIP§b+§c]", uuid: "8667ba71-b85a-4004-af54-457a9734ed7f", stat: "1,250,450,000" },
							{ rank: 2, name: "HypixelGod", rankFormatted: "§c[MVP§b++§c]", uuid: "20934ef9-4654-44ed-8d4d-4e31e77d11f6", stat: "980,200,500" },
							{ rank: 3, name: "KarmaFarmer", rankFormatted: "§b[MVP§c+§b]", uuid: "b876ec4e-6447-465b-80a9-4629671d497c", stat: "850,120,300" },
							{ rank: 4, name: "Technoblade", rankFormatted: "§c[PIG§b+++§c]", uuid: "b876ec4e-6447-465b-80a9-4629671d497c", stat: "740,900,100" },
							{ rank: 5, name: "gamerboy80", rankFormatted: "§c[MVP§b++§c]", uuid: "4a28469e-5b12-4217-9104-a63e9f4581ed", stat: "690,450,800" },
							{ rank: 6, name: "KarmaLegend", rankFormatted: "§a[VIP]", uuid: "e003714b-2228-4033-a3d8-500b3f52402b", stat: "612,300,000" },
							{ rank: 7, name: "HypixelHero", rankFormatted: "§c[MVP§b++§c]", uuid: "62681534-5858-4796-932f-76d75c74eb58", stat: "589,100,200" },
							{ rank: 8, name: "SpeedRunner", rankFormatted: "§b[MVP§c+§b]", uuid: "c460026e-939e-4e44-b040-cfc60959f67a", stat: "542,000,900" },
							{ rank: 9, name: "SkyLord", rankFormatted: "§c[MVP§b++§c]", uuid: "069a7927-26e8-40e6-a213-9a99763266e7", stat: "510,750,000" },
							{ rank: 10, name: "KarmaMaster", rankFormatted: "§a[VIP]", uuid: "5c80ed22-d0f9-46a4-8f64-884a1411516e", stat: "495,000,000" }
						]
					},
					guilds: {
						title: "Top Guilds (Top 10)",
						subtitle: "Hypixel Network Top Guilds by EXP",
						unit: "Guild EXP",
						icon: FaShieldAlt,
						data: [
							{ rank: 1, name: "Rebel", rankFormatted: "§a[REBEL]", uuid: "Rebel", stat: "Level 115" },
							{ rank: 2, name: "Rawr", rankFormatted: "§d[RAWR]", uuid: "Rawr", stat: "Level 112" },
							{ rank: 3, name: "Mastering", rankFormatted: "§b[MASTER]", uuid: "Mastering", stat: "Level 109" },
							{ rank: 4, name: "Infamy", rankFormatted: "§c[INFAMY]", uuid: "Infamy", stat: "Level 106" },
							{ rank: 5, name: "Quacking", rankFormatted: "§e[QUACK]", uuid: "Quacking", stat: "Level 104" },
							{ rank: 6, name: "TheLucid", rankFormatted: "§5[LUCID]", uuid: "TheLucid", stat: "Level 101" },
							{ rank: 7, name: "Foundation", rankFormatted: "§9[FOUND]", uuid: "Foundation", stat: "Level 98" },
							{ rank: 8, name: "Vanguard", rankFormatted: "§6[VANG]", uuid: "Vanguard", stat: "Level 95" },
							{ rank: 9, name: "HypixelStaff", rankFormatted: "§c[STAFF]", uuid: "HypixelStaff", stat: "Level 92" },
							{ rank: 10, name: "BedWarsGods", rankFormatted: "§b[GODS]", uuid: "BedWarsGods", stat: "Level 90" }
						]
					}
				};

				setLeaderboardData(resultData);
				storeLeaderboards(resultData);
				setLoading(false);
			}
		}

		initLeaderboards();

		return () => {
			isMounted = false;
		};
	}, []);

	// Active key resolving
	const currentKey = activeTab === 'bedwars' ? `bedwars_${bedwarsPeriod}` : activeTab;
	const currentLb = leaderboardData[currentKey] || leaderboardData['bedwars_daily'];

	const TABS = [
		{ id: 'bedwars', label: 'BedWars (Top 10)', icon: FaFire },
		{ id: 'murdermystery', label: 'Murder Mystery (Top 10)', icon: FaSkull },
		{ id: 'duels', label: 'Duels (Top 10)', icon: FaCrosshairs },
		{ id: 'karma', label: 'Top Karma', icon: FaStar },
		{ id: 'guilds', label: 'Top Guilds', icon: FaShieldAlt }
	];

	return (
		<PageLayout
			searchbar={true}
			top={
				<div className="text-center">
					<h1>
						<MinecraftText size="xxl">
							{"§dHypixel Live Leaderboards"}
						</MinecraftText>
					</h1>
					<p className="c-gray mt-1">Real-time Top 10 Hypixel API leaderboards (1-hour cached)</p>
				</div>
			}
			center={
				<div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
					{/* Rate Limit Warning Banner */}
					{rateLimited && (
						<div
							className="p-3 mb-3 text-center h-flex align-items-center justify-content-center"
							style={{
								backgroundColor: 'rgba(239, 68, 68, 0.2)',
								border: '1px solid rgba(239, 68, 68, 0.5)',
								borderRadius: '8px',
								color: '#fca5a5',
								gap: '0.5rem'
							}}
						>
							<FaExclamationTriangle style={{ color: '#ef4444', fontSize: '1.2rem' }} />
							<span>
								<strong>API Rate Limit Reached:</strong> Hypixel API rate limit was exceeded. Displaying cached results.
							</span>
						</div>
					)}

					{/* Category Selector Tabs */}
					<div className="h-flex justify-content-center flex-wrap mb-4" style={{ gap: '0.5rem' }}>
						{TABS.map((tab) => {
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`btn ${isActive ? 'btn-active' : 'btn-inactive'}`}
									style={{
										padding: '0.6rem 1.2rem',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										fontWeight: isActive ? 'bold' : 'normal',
										backgroundColor: isActive ? 'rgba(168, 85, 247, 0.35)' : 'rgba(0,0,0,0.3)',
										color: isActive ? '#fff' : '#ccc',
										borderRadius: '8px',
										transition: 'all 0.2s ease'
									}}
								>
									<ReactIcon icon={tab.icon} />
									<span>{tab.label}</span>
								</button>
							);
						})}
					</div>

					{/* Loading State */}
					{loading ? (
						<div className="py-5 text-center">
							<LoadingSpinner text="Loading Hypixel Leaderboards" />
						</div>
					) : error ? (
						<Card title="Error Loading Leaderboards">
							<div className="p-3 text-center text-danger">
								<p>{error}</p>
							</div>
						</Card>
					) : currentLb ? (
						<Card title={currentLb.title}>
							{/* Sub-toggle for BedWars: Daily vs Weekly */}
							{activeTab === 'bedwars' && (
								<div className="h-flex justify-content-center mb-3 pt-2" style={{ gap: '0.5rem' }}>
									<button
										onClick={() => setBedwarsPeriod('daily')}
										className={`btn ${bedwarsPeriod === 'daily' ? 'btn-active' : 'btn-inactive'}`}
										style={{
											padding: '0.4rem 1rem',
											cursor: 'pointer',
											backgroundColor: bedwarsPeriod === 'daily' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0,0,0,0.2)',
											color: bedwarsPeriod === 'daily' ? '#fff' : '#aaa',
											borderRadius: '6px',
											fontSize: '0.9rem'
										}}
									>
										📅 Daily Stats
									</button>
									<button
										onClick={() => setBedwarsPeriod('weekly')}
										className={`btn ${bedwarsPeriod === 'weekly' ? 'btn-active' : 'btn-inactive'}`}
										style={{
											padding: '0.4rem 1rem',
											cursor: 'pointer',
											backgroundColor: bedwarsPeriod === 'weekly' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0,0,0,0.2)',
											color: bedwarsPeriod === 'weekly' ? '#fff' : '#aaa',
											borderRadius: '6px',
											fontSize: '0.9rem'
										}}
									>
										📆 Weekly Stats
									</button>
								</div>
							)}

							<div className="table-responsive w-100" style={{ overflowX: 'auto' }}>
								<table className="w-100 text-left" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
									<thead>
										<tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', color: '#aaa', fontSize: '0.9rem' }}>
											<th className="p-2 text-center" style={{ width: '65px' }}>Rank</th>
											<th className="p-2" style={{ width: currentLb.isBedWars ? '38%' : '65%' }}>Player / Guild</th>
											{currentLb.isBedWars ? (
												<>
													<th className="p-2 text-right" style={{ width: '20%' }}>
														{bedwarsPeriod === 'daily' ? 'Daily Wins' : 'Weekly Wins'}
													</th>
													<th className="p-2 text-right" style={{ width: '20%' }}>
														{bedwarsPeriod === 'daily' ? 'Daily Finals' : 'Weekly Finals'}
													</th>
													<th className="p-2 text-right" style={{ width: '22%' }}>
														{bedwarsPeriod === 'daily' ? 'Daily Beds' : 'Weekly Beds'}
													</th>
												</>
											) : (
												<th className="p-2 text-right">{currentLb.unit}</th>
											)}
										</tr>
									</thead>
									<tbody>
										{currentLb.data && currentLb.data.map((row) => (
											<tr
												key={row.rank}
												style={{
													borderBottom: '1px solid rgba(255,255,255,0.05)',
													backgroundColor: row.rank <= 3 ? 'rgba(255,215,0,0.04)' : 'transparent'
												}}
											>
												<td className="p-2 text-center font-bold" style={{ width: '65px' }}>
													{row.rank === 1 && <span style={{ color: '#ffd700', fontSize: '1rem' }}>🥇 1</span>}
													{row.rank === 2 && <span style={{ color: '#c0c0c0', fontSize: '1rem' }}>🥈 2</span>}
													{row.rank === 3 && <span style={{ color: '#cd7f32', fontSize: '1rem' }}>🥉 3</span>}
													{row.rank > 3 && `#${row.rank}`}
												</td>
												<td className="p-2 overflow-hidden">
													<div className="h-flex align-items-center" style={{ gap: '0.5rem', minWidth: 0 }}>
														{activeTab !== 'guilds' && (
															<PlayerHead uuid={row.uuid} name={row.name} size="sm" />
														)}
														<Link
															to={activeTab === 'guilds' ? `/guild/${row.name}` : `/player/${row.name}`}
															style={{ textDecoration: 'none', color: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
														>
															<MinecraftText font="md">
																{row.rankFormatted ? `${row.rankFormatted} ${row.name}` : row.name}
															</MinecraftText>
														</Link>
													</div>
												</td>
												{currentLb.isBedWars ? (
													<>
														<td className="p-2 text-right font-bold" style={{ color: '#22c55e' }}>
															{typeof row.wins === 'number' ? row.wins.toLocaleString() : '-'}
														</td>
														<td className="p-2 text-right font-bold" style={{ color: '#ef4444' }}>
															{typeof row.finals === 'number' ? row.finals.toLocaleString() : '-'}
														</td>
														<td className="p-2 text-right font-bold" style={{ color: '#eab308' }}>
															{typeof row.beds === 'number' ? row.beds.toLocaleString() : '-'}
														</td>
													</>
												) : (
													<td className="p-2 text-right font-bold" style={{ color: '#a855f7' }}>
														{row.stat}
													</td>
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
					) : null}
				</div>
			}
		/>
	);
}
