import React from 'react';
import { MdPushPin, MdSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { APP, COOKIES } from 'src/constants/app';
import { Collapsible, MinecraftText, ReactIcon, Searchbar, Settings } from 'src/components';

/**
 * Navbar that appears at the top of the page
 *
 * @param {boolean} props.searchbar    Whether or not to display the Searchbar component
 */
export function Navbar(props) {

	/**
	 * Returns a clickable pin icon if the 'pinnedPlayer' cookie exists
	 */
	function renderPinnedPlayerButton() {
		const p = Cookies.get(COOKIES.pinnedPlayer);
		if (p) {
			return (
				<Link className="font-md" to={`/search/${p}`} title={`Pinned player: ${p}`}>
					<ReactIcon icon={MdPushPin} clickable />
				</Link>
			);
		}
		return null;
	}

	return (
		<Collapsible>
			{(provided) => (
				<React.Fragment>
					<div className="h-flex align-items-center justify-content-between p-2">
						<div className="flex-1 h-flex align-items-center">
							<Link className="nowrap p-2" to="/frontpage" style={{ textDecoration: 'none' }}>
								<MinecraftText font="md">
									{"§d" + APP.appNickname}
								</MinecraftText>
							</Link>
						</div>

						<div className={`flex-1 py-1 flex-3 ${props.searchbar || 'hidden'}`}>
							<Searchbar />
						</div>

						<div className="flex-1 h-flex justify-content-end align-items-center">
							<p className="p-2 m-0">
								{renderPinnedPlayerButton()}
								<button className="ml-2 btn p-1" {...provided.collapseButtonProps} title="Settings">
									<ReactIcon icon={MdSettings} clickable />
								</button>
							</p>
						</div>
					</div>

					<div {...provided.collapsibleProps}>
						<Settings toggle={provided.collapseButtonProps.onClick} />
					</div>
				</React.Fragment>
			)}
		</Collapsible>
	);
}