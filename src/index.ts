import { omdbAPI } from "./env/api-key";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

interface MovieAPIResponseSuccess {
  Search: Array<Movie>;
  totalResults: string;
  Response: string;
};

interface MovieAPIResponseFailure {
  Response: string;
  Error: string;
};

const $body = document.querySelector("body");
const $nominationsContainer = document.querySelector(".nominations ul");
const $nominationsCount = document.querySelector(".nominations p");
const $moviesNav = document.querySelector(".search nav");
const $moviesContainer = document.querySelector(".search ul");
const $searchForm = document.querySelector(".search form")! as HTMLFormElement;
const $toast = document.querySelector("h4");
$searchForm.addEventListener("submit", searchMovies);

let page = 1;
function searchMovies(event : Event) {
  event.preventDefault();
  page = 1;
  const searchData = new FormData($searchForm);
  const searchTitle = searchData.get("search") as string;
  fetch(omdbAPI.baseURL(omdbAPI.key, searchTitle))
    .then(response => response.json())
    .then(result => handleSearchResponse(result, searchTitle));
};

function handleSearchResponse(
  searchResult: MovieAPIResponseSuccess | MovieAPIResponseFailure, 
  searchTitle: string
) {
  searchResult.Response === "True"
    ? handleSuccess(searchResult as MovieAPIResponseSuccess, searchTitle)
    : handleFailure(searchResult as MovieAPIResponseFailure);
};

function handleSuccess(results: MovieAPIResponseSuccess, searchTitle: string) {
  searchNavigation(results.totalResults, searchTitle);
  $moviesContainer!.innerHTML = "";
  results.Search.forEach((movie: Movie) => {
    $moviesContainer?.append(createMovieCard(movie))
  });
};

function createMovieCard(movie: Movie) {
  const $movieCard = document.createElement("li");
  $movieCard.className = "movie-card";
  const $title = document.createElement("h4");
  $title.textContent = movie.Title;
  const $year = document.createElement("p");
  $year.textContent = `Released: ${movie.Year}`
  const $poster = document.createElement("img");
  const imgSource = movie.Poster !== "N/A" 
    ? movie.Poster
    : posterPlaceHolder;
  $poster.src = imgSource;
  $poster.alt = `Poster for ${movie.Title}.`
  const $toIMDb = document.createElement("a");
  $toIMDb.textContent = "IMDb";
  $toIMDb.href = `https://www.imdb.com/title/${movie.imdbID}/`;
  const $nominate = document.createElement("button");
  $nominate.textContent = "Nominate!";
  $nominate.addEventListener("click", () => handleNomination($movieCard, $nominate));
  $movieCard.append($title, $poster, $year, $toIMDb, $nominate);
  return $movieCard;
};

const posterPlaceHolder = "https://everyfad.com/static/images/movie_poster_placeholder.29ca1c87.svg";

function handleNomination($movieCard: Element, $nominate: Element) {
  const text = "Remove a nomination to add another!";
  $nominationsContainer!.childElementCount < 5
    ? nominationSuccess($movieCard, $nominate)
    : toast(text, 100000, "nominations-full"); // 3000
};

function nominationSuccess($movieCard: Element, $nominate: Element) {
  const $movieNominationCard = $movieCard.cloneNode(true);
  $movieCard.removeChild($nominate);
  const $nominated = document.createElement("p");
    $nominated.textContent = "Nominated!";
  $movieCard.append($nominated);
  const $remove = $movieNominationCard.lastChild!;
  $remove.textContent = "Remove";
  $remove.addEventListener(
    "click", 
    () => handleNominationRemoval($movieCard, $movieNominationCard, $nominate)
  );
  $nominationsContainer!.append($movieNominationCard);
  nominationCountDisplay();
  if ($nominationsContainer!.childElementCount === 5) fiveNominations();
}

function nominationCountDisplay() {
  const text = `${$nominationsContainer!.childElementCount} of 5 nominations made!`;
  $nominationsCount!.textContent = text;
}

function handleNominationRemoval(
  $movieCard: Element, 
  $movieNominationCard: Node, 
  $nominate: Element
) {
  $movieNominationCard.parentNode!.removeChild($movieNominationCard);
  $movieCard.removeChild($movieCard.lastChild!);
  $movieCard.append($nominate);
  nominationCountDisplay();
};

function handleFailure(results: MovieAPIResponseFailure) {
  const $errorMessage = document.createElement("p");
  $errorMessage.textContent = results.Error; 
  $moviesContainer?.append($errorMessage);
};

function searchNavigation(count: string, searchTitle: string) {
  $moviesNav!.innerHTML = "";
  const $previous = previousElement(searchTitle);
  const $movieCount = document.createElement("p");
    $movieCount.textContent = movieNavCount(count);
  const $next = nextElement(count, searchTitle)
  $moviesNav?.append($previous, $movieCount, $next);
}

function movieNavCount(count: string): string {
  let countMax = page*10;
  const countMin = (page-1)*10+1;
  countMax = countMax > +count ? +count : countMax;
  return `Displaying movies ${countMin}-${countMax} of ${count}.`
}

function previousElement(searchTitle: string): Element {
  let $previous: Element;
  if (page - 1){
    $previous = document.createElement("button");
      $previous.addEventListener("click", () => changePage(searchTitle, -1));
  } else {
    $previous = document.createElement("p");
  }
  $previous.textContent = "<<"
  return $previous;
}

function nextElement(
  count: string, searchTitle: string
): Element {
  let $next: Element;
  if (page*10 <= +count){
    $next = document.createElement("button");
      $next.addEventListener("click", () => changePage(searchTitle, 1));
  } else {
    $next = document.createElement("p");
  }
  $next.textContent = ">>"
  return $next;
} 

function changePage(searchTitle: string, increment: number) {
  page += increment;
  $moviesNav!.innerHTML = "";
  fetch(omdbAPI.baseURL(omdbAPI.key, searchTitle, page))
    .then(response => response.json())
    .then(result => handleSearchResponse(result, searchTitle));
}

function fiveNominations() {
  const text = "You've selected your five nominations!";
  toast(text, 100000, "nominations-complete"); // 5000
}

function toast(text: string, duration: number, className: string) {
  $toast!.className = className;
  $toast!.textContent = text;
  setInterval(removeToast, duration, $toast!, className);
}

function removeToast($toast: Element, className: string) {
  $toast.textContent = "";
  $toast.classList.remove(className);
}
