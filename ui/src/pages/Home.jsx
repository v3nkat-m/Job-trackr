import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import JobTracker from '../components/JobTracker';

export default function Home() {
	const userContext = useContext(UserContext);
	const { user } = userContext;
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		console.log('Inside useEffect - user:', user);

		if (!user) {
			console.log('User is null. Redirecting to login...');
			navigate('/auth/login');
		} else {
			console.log('User is not null. Setting loading state to false...');
			setIsLoading(false);
		}
	}, [user, navigate]);

	console.log('Outside useEffect - user:', user);
	console.log('isLoading:', isLoading);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Header />
			<JobTracker />
		</div>
	);
}
