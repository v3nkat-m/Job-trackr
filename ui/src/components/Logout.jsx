import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { UserContext } from '../Context/UserContext';

export default function Logout() {
	const { setUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		handleLogout();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			setUser(null);
			navigate('/auth/login');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<div>
			<button onClick={handleLogout}>Log out</button>
		</div>
	);
}
