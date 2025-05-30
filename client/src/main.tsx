import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Import Materialize CSS (from node_modules)
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
// Import our custom Materialize theme
import './assets/materialize-custom.css';

import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Faq from './pages/Faq';
import Recognition from './pages/Recognition';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    
    children: [
      {
        index: true,
        element: <Home />
      },   {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/faq',
        element: <Faq />
      },
      {
        path: '/recognition',
        element: <Recognition />
      }
      
    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
