import RecipeGenerator from "../components/generateRecipes";
import { useState, useEffect } from 'react';
import "../assets/styles/home.css";

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showPantryCard, setShowPantryCard] = useState(false); // NEW

  useEffect(() => {
    // Hide welcome message after 4s and 5s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4000);

    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    // Show pantry card after 5s
    const pantryTimer = setTimeout(() => {
      setShowPantryCard(true);
    }, 5000);

    // Animate food emojis
    const emojis = document.querySelectorAll('.food-emoji');
    emojis.forEach(emoji => {
      const randomX = Math.floor(Math.random() * 200 - 100);
      const randomY = Math.floor(Math.random() * 200 - 100);
      const randomRotate = Math.floor(Math.random() * 720 - 360);

      (emoji as HTMLElement).style.setProperty('--random-x', `${randomX}px`);
      (emoji as HTMLElement).style.setProperty('--random-y', `${randomY}px`);
      (emoji as HTMLElement).style.setProperty('--random-rotate', `${randomRotate}deg`);
    });

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      clearTimeout(pantryTimer);
    };
  }, []);

  return (
    <main className="home-container">
      {showWelcome && (
        <div className="row">
          <div className="col s12">
            <div className={`card welcome-card ${isExiting ? 'exit' : ''}`}>
              <div className="card-content">
                <span className="card-title deep-orange-text">Welcome to Chef&nbsp;Buddy</span>
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

      {/* 👇 Show this card only after 5 seconds */}
      {showPantryCard && (
        <div className="row">
          <div className="col s12">
            <div className="card">
              <div className="card-content">
                <span className="card-title deep-orange-text">
                  What's in your pantry?<RecipeGenerator />
                </span>
                <p>Discover new recipes based on ingredients you have at home.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;