import React from 'react';

/**
 * Minecraft player head avatar component
 * Supports both UUID and player username
 *
 * @param {string} props.uuid       The UUID of the player
 * @param {string} props.name       The username of the player
 * @param {string} props.size       Height of the face ('sm', 'md', 'lg', 'xl') - default 'md'
 */
export function PlayerHead(props) {
	const heights = {
		sm: '1.5rem',
		md: '2rem',
		lg: '2.5rem',
		xl: '3.5rem',
	};

	const identifier = props.uuid || props.name || 'steve';
	const heightStyle = heights[props.size] || heights.md;

	return (
		<img 
			src={`https://crafthead.net/helm/${identifier}/64`} 
			alt="Player avatar"
			style={{
				height: heightStyle,
				width: heightStyle,
				borderRadius: '4px',
				imageRendering: 'pixelated',
				objectFit: 'contain',
				flexShrink: 0
			}}
			onError={(e) => {
				e.target.src = `https://mc-heads.net/avatar/${identifier}/64`;
			}}
		/>
	);
}