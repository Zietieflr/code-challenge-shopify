var word = "world";
function hello(word) {
    return "Hello " + word + "! ";
}
var $body = document.querySelector("body");
var $p = document.createElement("p");
$p.textContent = hello(word);
$body === null || $body === void 0 ? void 0 : $body.append($p);
