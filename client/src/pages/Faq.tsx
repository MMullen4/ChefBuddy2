// Description: A simple FAQ page for a recipe suggestion app using React and Materialize CSS.
const Faq = () => {
  return (
    <main className="faq-container">
      <div className="faq-box">
        <h4 className="center-align">Frequently Asked Questions</h4>

        <ul className="collapsible popout">
          <li>
            <div className="collapsible-header">
              <i className="material-icons">question_answer</i>
              <b>How does the app work?</b>
            </div>
            <div className="p-4">
              <span>
                You simply type in the ingredients you have in your fridge, and our AI will generate a recipe suggestion for you!
              </span>
            </div>
          </li>
          <li>
            <div className="collapsible-header">
              <i className="material-icons">restaurant</i>
              <b>What kind of recipes can I expect?</b>
            </div>
            <div className="p-4">
              <span>
                You’ll get quick, simple recipes using only the ingredients you list. The AI avoids recipes that require ingredients you don’t have.
              </span>
            </div>
          </li>
          <li>
            <div className="collapsible-header">
              <i className="material-icons">security</i>
              <b>Is my data safe?</b>
            </div>
            <div className="p-4">
              <span>
                Yes, we do not store any personal data or the ingredients you enter. It’s a simple, privacy-friendly tool.
              </span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default Faq;