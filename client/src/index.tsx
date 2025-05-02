import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router';
import SignIn from './pages/SignIn';
import Layout from './layouts/Layout';
import Characters from './pages/Characters';
import Places from './pages/Places';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './hooks/useAuth';
import Events from './pages/Events';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: Dashboard,
          },
          {
            path: '/characters',
            Component: Characters,
          },
          {
            path: '/places',
            Component: Places,
          },
          {
            path: '/events',
            Component: Events,
          },
        ],
      },
      {
        path: '/sign-in',
        Component: SignIn,
      },
    ],
  },
]);


root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
