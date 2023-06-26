import React from 'react';
import logo from '../assets/logo.png';
import '../css/Logo.css';

export default function Logo() {
	return (
		<a href="/">
			<img className="logo" src={logo} alt="logo"></img>
		</a>
	);
}
