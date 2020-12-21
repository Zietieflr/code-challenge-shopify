import { omdbAPI } from "./env/api-key";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieAPIResponseSuccess {
  Search: Array<Movie>;
  totalResults: string;
  Response: string;
}

interface MovieAPIResponseFailure {
  Response: string;
  Error: string;
}

const $nominationsContainer = document.querySelector(".nominations ul");
const $nominationsCount = document.querySelector(".search ul");
const $moviesNav = document.querySelector(".search nav");
const $moviesContainer = document.querySelector(".search ul");
const $searchForm = document.querySelector(".search form")! as HTMLFormElement;
$searchForm.addEventListener("submit", searchMovies);

function searchMovies(event : Event) {
  event.preventDefault();
  const searchData = new FormData($searchForm);
  const searchTitle = searchData.get("search") as string;
  fetch(omdbAPI.baseURL(omdbAPI.key, searchTitle))
    .then(response => response.json())
    .then(result => handleSearchResponse(result));
}

function handleSearchResponse(
  searchResult: MovieAPIResponseSuccess | MovieAPIResponseFailure
) {
  searchResult.Response === "True"
    ? handleSuccess(searchResult as MovieAPIResponseSuccess)
    : handleFailure(searchResult as MovieAPIResponseFailure);
}

function handleSuccess(results: MovieAPIResponseSuccess) {
  results.Search.forEach((movie: Movie) => {
    $moviesContainer?.append(createMovieCard(movie))
  });
}

function createMovieCard(movie: Movie) {
  const $movieCard = document.createElement("li");
  $movieCard.className = "movie-card";
  $movieCard.append(...makeMovieCardElements(movie));
  return $movieCard;
}

const posterPlaceHolder = "https://everyfad.com/static/images/movie_poster_placeholder.29ca1c87.svg";

function makeMovieCardElements(movie: Movie) {
  const $title = document.createElement("h4");
  $title.textContent = movie.Title;
  const $year = document.createElement("p");
  $year.textContent = movie.Year
  const $poster = document.createElement("img");
  const imgSource = movie.Poster !== "N/A" ? movie.Poster : posterPlaceHolder;
  $poster.src = imgSource;
  $poster.alt = `Poster for ${movie.Title}.`
  const $toIMDb = document.createElement("a");
  $toIMDb.textContent = "IMDb";
  $toIMDb.href = `https://www.imdb.com/title/${movie.imdbID}/`;
  return [$title, $year, $poster, $toIMDb];
}

function handleFailure(results: MovieAPIResponseFailure) {
  return "FAILURE";
}
