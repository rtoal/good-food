import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [term, setTerm] = useState("");
  const [mealId, setMealId] = useState(null);

  // page can be "results", "details"
  const [page, setPage] = useState("results");

  useEffect(() => {
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/filter.php";
    fetch(`${searchUrl}?c=${encodeURIComponent(term)}`).then((r) =>
      r.json().then((r) => {
        setMeals(r?.meals);
        setPage("results");
      })
    );
  }, [term]);

  return (
    <div className="App">
      <h1>Good Food</h1>
      <SearchForm action={setTerm} />
      {page === "results" ? (
        <SearchResults meals={meals} setPage={setPage} setMealId={setMealId} />
      ) : (
        <MealDetail id={mealId} />
      )}
    </div>
  );
}

function SearchForm({ action }) {
  const [content, setContent] = useState("");
  function submit(e) {
    e.preventDefault();
    action(content);
    setContent("");
  }
  return (
    <form onSubmit={submit}>
      Search by category{" "}
      <input value={content} onChange={(e) => setContent(e.target.value)} />
    </form>
  );
}

function SearchResults({ meals, setPage, setMealId }) {
  function details(mealId) {
    setPage("details");
    setMealId(mealId);
  }
  return (
    <div>
      {meals &&
        meals.map((meal) => (
          <div key={meal.idMeal}>
            <h2 onClick={(e) => details(meal.idMeal)}>{meal.strMeal}</h2>
            <div>
              <img width="300" src={meal.strMealThumb} alt="yummy" />
            </div>
          </div>
        ))}
    </div>
  );
}

function MealDetail({ id }) {
  return <div>Showing details for id={id}</div>;
}
