import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_PROFILE } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [addProfile, { error, data }] = useMutation(ADD_PROFILE);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const { data } = await addProfile({
        variables: { 
          input: { 
            ...formState 
          } 
        },
      });

      Auth.login(data.addProfile.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="signup-container">
    <div className="row">
      <div className="col s12 m6 offset-m3">
        <div className="card">
          <div className="card-content">
            <span className="card-title deep-orange-text">Sign Up</span>
            {data ? (
              <p>
                Success! You may now proceed to{' '}
                <Link to="/">the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="input-field">
                  <input
                    className="validate"
                    placeholder="Your username"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name" className="active">Username</label>
                </div>
                <div className="input-field">
                  <input
                    className="validate"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email" className="active">Email</label>
                </div>
                <div className="input-field">
                  <input
                    className="validate"
                    placeholder="******"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="password" className="active">Password</label>
                </div>
                <button
                  className="btn waves-effect waves-light deep-orange"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="card-panel red lighten-4 red-text text-darken-4 my-3">
                {error.message}
              </div>
            )}
          </div>
          <div className="card-action">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Signup;
