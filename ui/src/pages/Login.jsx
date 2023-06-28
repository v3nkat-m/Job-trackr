import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	setPersistence,
	browserLocalPersistence,
} from 'firebase/auth';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const userContext = useContext(UserContext);
	const { user, setUser } = userContext;
	const navigate = useNavigate();

	useEffect(() => {
		setPersistence(auth, browserLocalPersistence)
			.then(() => {
				const unsubscribe = onAuthStateChanged(auth, (user) => {
					if (user) {
						console.log('User is signed in:', user);
						setUser(user);
					} else {
						console.log('User is signed out');
						setUser(null);
					}
				});

				return () => {
					unsubscribe();
				};
			})
			.catch((error) => {
				console.log('Error setting persistence:', error);
			});
	}, []);

	const signIn = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			console.log('User is signed in:', user);

			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="login-container">
			<form onSubmit={signIn}>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				></input>
				<input
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				></input>
				<button type="submit">Log in</button>
			</form>
		</div>
	);
};

export default Login;
