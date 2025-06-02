import React from 'react';
// Import images with correct paths and types
// @ts-expect-error - Importing image assets
import LoginImage from '../assets/images/Login_page_1.PNG';
// @ts-expect-error - Importing image assets
import SignupImage from '../assets/images/Signup_page_1.PNG';
import MenuImage from '../assets/images/Menu_page_1.png';
// @ts-expect-error - Importing image assets
import FavImage from '../assets/images/Fav_page_1.PNG';

const HowTo: React.FC = () => {
  return (
    <main className="how-to-container">
      <div className="section">
        <div className="row">
          <div className="col s12">
            <div className="card">
              <div className="card-content">
                <span className="card-title deep-orange-text">How to Use ChefBuddy</span>
                
                <div className="section">
                  <h5>Step 1: Login to Your Account</h5>
                  <p>Login with your email and password to access all features.</p>
                  <div className="center-align">
                    <img 
                      src={LoginImage} 
                      alt="Login Page" 
                      className="responsive-img z-depth-1" 
                      style={{ maxWidth: '80%', margin: '10px auto' }}
                    />
                  </div>
                </div>
                
                <div className="section">
                  <h5>Step 2: Create an Account (if you're new)</h5>
                  <p>Sign up to create your personal recipe collection.</p>
                  <div className="center-align">
                    <img 
                      src={SignupImage} 
                      alt="Signup Page" 
                      className="responsive-img z-depth-1" 
                      style={{ maxWidth: '80%', margin: '10px auto' }}
                    />
                  </div>
                </div>
                
                <div className="section">
                  <h5>Step 3: Use the Main Menu</h5>
                  <p>Enter ingredients you have, and ChefBuddy will suggest recipes.</p>
                  <div className="center-align">
                    <img 
                      src={MenuImage} 
                      alt="Menu Page" 
                      className="responsive-img z-depth-1" 
                      style={{ maxWidth: '80%', margin: '10px auto' }}
                    />
                  </div>
                </div>
                
                <div className="section">
                  <h5>Step 4: Save Your Favorite Recipes</h5>
                  <p>Mark recipes as favorites to find them quickly later.</p>
                  <div className="center-align">
                    <img 
                      src={FavImage} 
                      alt="Favorites Page" 
                      className="responsive-img z-depth-1" 
                      style={{ maxWidth: '80%', margin: '10px auto' }}
                    />
                  </div>
                </div>
                
                <div className="center-align">
                  <a href="/faq" className="waves-effect waves-light btn deep-orange">
                    <i className="material-icons left">arrow_back</i>
                    Back to FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HowTo;
