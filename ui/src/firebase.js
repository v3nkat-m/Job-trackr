import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	// Your Firebase configuration
	apiKey: 'AIzaSyBK1U-YxN4WWwKFzXAMAtqMjuvtvvFgUjA',
	authDomain: 'job-trackr-e89af.firebaseapp.com',
	projectId: 'job-trackr-e89af',
	storageBucket: 'job-trackr-e89af.appspot.com',
	messagingSenderId: '809976970661',
	appId: '1:809976970661:web:782cd328c77efcea2afc4c',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
