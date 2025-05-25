
const Faq = () => {
  return (
      <div className="container" style={{ padding: '2rem', backgroundColor: '#f9f9f9'  }}>
      <h4 className="center-align">Frequently Asked Questions</h4>

      <ul className="collapsible popout">
        <li>
          <div className="collapsible-header">
            <i className="material-icons">question_answer</i>
            How does the app work? Simple, all you need to do is enter the ingredients you have!
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
            What kind of recipes can I expect?
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
            Is my data safe?
          </div>
          <div className="p-4">
            <span>
              Yes, we do not store any personal data or the ingredients you enter. It’s a simple, privacy-friendly tool.
            </span>
          </div>
        </li>
        </ul>
    </div>
  );
};
export default Faq;