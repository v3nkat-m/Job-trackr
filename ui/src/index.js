import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/auth/login',
		element: <Login />,
	},
	{ path: '/auth/signup', element: <SignUp /> },
	{
		path: '/auth/change-password',
		element: <ChangePassword />,
	},
	{
		path: '*',
		element: <Navigate replace to="/" />,
	},
]);
root.render(
	<React.StrictMode>
		<RouterProvider router={router}>
			<App />
		</RouterProvider>
	</React.StrictMode>
);
