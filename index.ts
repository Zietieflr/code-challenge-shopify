const word : string = "world";

function hello(word: string): string {
  return `Hello ${word}! `;
}

const $body = document.querySelector("body");
const $p = document.createElement("p");

$p.textContent = hello(word);

$body?.append($p);