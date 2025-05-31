import RecipeGenerator from "../components/generateRecipes";

const Home = () => {

  return (
    <main className="home-container">
    <div className="section">
      <div className="row">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
              <span className="card-title deep-orange-text">Welcome to Chef Buddy</span>
              <p>Your personal recipe assistant to help you discover and create delicious meals.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
              <span className="card-title deep-orange-text">Find Recipes<RecipeGenerator/></span>
              <p>Discover new recipes based on ingredients you have at home.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Home;
