import { omdbAPI } from "./env/api-key";

// search feature of the api
  // Defaults: first page, 10 per request 
    // {"Search": [{}*10], "totalResults": "int", "Response": "True"}
      // search structure: 
        // {"Title": "str", "Year": "int", "imdbID": "str", "Type": "string", "Poster": "https" or "N/A"}

const $search = document.querySelector(".search form")! as HTMLFormElement;
$search.addEventListener("submit", searchMovies);

function searchMovies(event : Event) {
  event.preventDefault();
  const searchData = new FormData($search);
  const title = searchData.get("search") as string;
  fetch(omdbAPI.baseURL(omdbAPI.key, title))
    .then(response => response.json())
    .then(result => console.log(result));
}
