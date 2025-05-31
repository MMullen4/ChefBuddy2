import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import M from 'materialize-css';
import { useEffect } from 'react';
import { setContext } from '@apollo/client/link/context';
import { Outlet, Link } from 'react-router-dom';
import Auth from './utils/auth';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  useEffect(() => {
    const elems = document.querySelectorAll<HTMLElement>('.sidenav');
    M.Sidenav.init(elems, {});
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="gradient-background min-100-vh">
        <nav>
          <div className="nav-wrapper nav-gradient">
            <div className="container">
              <Link to="/" className="brand-logo">Chef Buddy</Link>
              {/* Desktop-only "My Favorites" button */}
{Auth.loggedIn() && (
  <Link
    to="/favorites"
    className="right hide-on-med-and-down"
    style={{ marginRight: '60px' }}
  >
    My ❤️ Recipes
  </Link>
)}
              {/* Always-visible burger icon */}
              <a href="#!" data-target="mobile-demo" className="sidenav-trigger right">
                
                <i className="material-icons">menu</i>
              </a>

              {/* Optional: remove desktop nav */}
              {/* 
              <ul className="right hide-on-med-and-down">
                <li><Link to="/">Home</Link></li>
                ...
              </ul>
              */}
            </div>
          </div>
        </nav>

        {/* Sidenav menu */}
        <ul className="sidenav" id="mobile-demo">
          <li><Link to="/">Home</Link></li>
          {Auth.loggedIn() ? (
            <>
      
              <li><a href="/" onClick={() => Auth.logout()}>Logout</a></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/recognition">Recognition</Link></li>
            </>
          )}
        </ul>

        <main className="container">
          <Outlet />
        </main>

        <footer className="page-footer footer-gradient compact-footer">
          <div className="container">
            <div className="row footer-row">
              <div className="col l6 s12">
                <h6 className="white-text">Chef Buddy</h6>
                <p className="grey-text text-lighten-4 footer-text">Your personal recipe assistant</p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h6 className="white-text">© 2025 Chef Buddy</h6>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">© 2025 Chef Buddy</div>
          </div>
        </footer>

        {/* Inline style to always show the burger */}
        <style>
          {`
            .sidenav-trigger {
              display: block !important;
            }
          `}
        </style>
      </div>
    </ApolloProvider>
  );
}

export default App;
