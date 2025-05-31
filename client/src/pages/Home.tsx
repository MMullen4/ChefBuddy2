import RecipeGenerator from "../components/generateRecipes";
import { useState, useEffect } from 'react';
import "../assets/styles/home.css";

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Set a timeout to trigger exit animation after 4 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4000);

    // Set a timeout to hide the welcome message after exactly 5 seconds
    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    // Add random movement to food emojis
    const emojis = document.querySelectorAll('.food-emoji');
    emojis.forEach(emoji => {
      // Generate random values for each emoji
      const randomX = Math.floor(Math.random() * 200 - 100); // range: -100 to 100
      const randomY = Math.floor(Math.random() * 200 - 100); // range: -100 to 100
      const randomRotate = Math.floor(Math.random() * 720 - 360); // range: -360 to 360

      // Set CSS variables for the random values
      (emoji as HTMLElement).style.setProperty('--random-x', `${randomX}px`);
      (emoji as HTMLElement).style.setProperty('--random-y', `${randomY}px`);
      (emoji as HTMLElement).style.setProperty('--random-rotate', `${randomRotate}deg`);
    });

    // Clean up the timeouts when the component unmounts
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <main className="home-container">
      {showWelcome && (
        <div className="row">
          <div className="col s12">
            <div className={`card welcome-card ${isExiting ? 'exit' : ''}`}>
              <div className="card-content">
                <span className="card-title deep-orange-text">Welcome to Chef Buddy</span>
                <p>Your personal recipe assistant to help you discover and create delicious meals.</p>
                <div className="food-emoji-container">
                  <span className="food-emoji">🍔</span>
                  <span className="food-emoji">🍕</span>
                  <span className="food-emoji">🍗</span>
                  <span className="food-emoji">🥗</span>
                  <span className="food-emoji">🍲</span>
                  <span className="food-emoji">🍝</span>
                  <span className="food-emoji">🍣</span>
                  <span className="food-emoji">🍦</span>
                  <span className="food-emoji">🍰</span>
                  <span className="food-emoji">🥑</span>
                  <span className="food-emoji">🥩</span>
                  <span className="food-emoji">🌮</span>
                  <span className="food-emoji">🍇</span>
                  <span className="food-emoji">🥐</span>
                  <span className="food-emoji">🥞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
              <span className="card-title deep-orange-text">What's in your pantry?<RecipeGenerator/></span>
              <p>Discover new recipes based on ingredients you have at home.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
