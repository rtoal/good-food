import { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./App.css";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState(null);
  const [term, setTerm] = useState("");
  const [mealId, setMealId] = useState(null);
  const user = useAuthentication();

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

  useEffect(() => {
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php";
    fetch(`${searchUrl}?i=${encodeURIComponent(mealId)}`).then((r) =>
      r.json().then((r) => {
        setMeal(r?.meals?.[0]);
        setPage("details");
      })
    );
  }, [mealId]);

  function clear() {
    setMeal(null);
    setMeals([]);
    setMealId(null);
  }

  return (
    <div className="App">
      <header>
        <h1>Good Food</h1>
        {user ? <SignOut clear={clear} /> : <SignIn />}
      </header>
      {user && (
        <div>
          <SearchForm action={setTerm} />
          {page === "results" ? (
            <SearchResults
              meals={meals}
              setPage={setPage}
              setMealId={setMealId}
            />
          ) : (
            <MealDetail meal={meal} />
          )}
        </div>
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

function SearchResults({ meals, setMealId }) {
  return (
    <div>
      {meals &&
        meals.map((meal) => (
          <div key={meal.idMeal}>
            <h2 onClick={(e) => setMealId(meal.idMeal)}>{meal.strMeal}</h2>
            <div>
              <img width="300" src={meal.strMealThumb} alt="yummy" />
            </div>
          </div>
        ))}
    </div>
  );
}

function MealDetail({ meal }) {
  return (
    meal && (
      <div>
        <h2>{meal.strMeal}</h2>
        <div>
          <img width="300" src={meal.strMealThumb} alt="yummy" />
        </div>
        <div>{meal.strInstructions}</div>
      </div>
    )
  );
}

function SignIn() {
  return (
    <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
      SignIn
    </button>
  );
}

function SignOut({ clear }) {
  return (
    <div>
      Hello, {auth.currentUser.displayName}
      <button
        id="signout"
        onClick={() => {
          signOut(auth);
          clear();
        }}
      >
        SignOut
      </button>
    </div>
  );
}

function useAuthentication() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });
  }, []);
  return user;
}
