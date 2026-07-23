import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, MinecraftText, ReactIcon, Searchbar } from 'src/components';
import { PAGES } from 'src/constants/app';

/**
 * Searchbar with buttons to select a specific search type
 *
 * @param {string} props.defaultValue    The initial value to put inside of the searchbar
 */
export function Search(props) {
	const [searchType, setSearchType] = useState(PAGES[0]);
	const navigate = useNavigate();

	return (
		<React.Fragment>
			<div className="py-1">
				<div className="pb-1 pl-2">
					<h1><MinecraftText size="md">{searchType.about}</MinecraftText></h1>
				</div>
				{searchType.isDirectLink ? (
					<div className="p-3 text-center my-2" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
						<button 
							className="btn btn-active font-bold px-4 py-2"
							onClick={() => navigate('/leaderboard')}
							style={{ cursor: 'pointer', background: 'rgba(168,85,247,0.3)', color: '#fff', fontSize: '1.1rem' }}
						>
							🏆 View Hypixel Leaderboards
						</button>
					</div>
				) : (
					<Searchbar defaultValue={props.defaultValue || ''} tag={searchType.tags[0]} />
				)}
			</div>
			<div className="py-2 h-flex overflow-x justify-content-center">
				{PAGES.map((type) =>
					<div key={type.path} className="px-1"> 
						<Button 
							active={searchType.path === type.path}
							onClick={() => {
								if (type.isDirectLink) {
									navigate('/leaderboard');
								} else {
									setSearchType(type);
								}
							}}
						>
							<div className="overflow-hidden p-1" style={{ width: "7.2rem" }}>
								<ReactIcon icon={type.icon} size="lg" />
								<div className="pt-1">{type.name}</div>
							</div>
						</Button>
					</div>
				)}
			</div>
		</React.Fragment>
	);
}