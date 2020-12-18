import { omdbAPI } from "./env/api-key";

const word : string = "WORLD";

function hello(word: string): string {
  return `Hello ${word}! `;
}

const $body = document.querySelector("body");
const $p = document.createElement("p");

$p.textContent = hello(omdbAPI.key);

$body?.append($p);