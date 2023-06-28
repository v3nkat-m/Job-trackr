import React from 'react';
import Logo from './Logo';
import '../css/Header.css';

export default function Header() {
	return (
		<div className="header-color-wrapper">
			<div className="header-wrapper">
				<Logo />
				<a href="/" className="header-anchor">
					Logout
				</a>
			</div>
		</div>
	);
}
