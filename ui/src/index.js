import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Home from './pages/Home';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import { UserProvider } from './Context/UserContext';
import PrivateRoute from './components/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<UserProvider>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auth/login" element={<Login />} />
					<Route path="/auth/signup" element={<SignUp />} />
					<Route path="/auth/change-password" element={<ChangePassword />} />
					<Route path="*" element={<Navigate replace to="/" />} />
				</Routes>
			</Router>
		</UserProvider>
	</React.StrictMode>
);
