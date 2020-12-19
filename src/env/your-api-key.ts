export { omdbAPI };
// Change the name of this file to "api-key.ts"
// Your assigned key in the quotes below.
const omdbAPI : {key : string; baseURL : typeof omdbAPIurl} = {
  key: "YOUR API KEY HERE",
  baseURL: omdbAPIurl
};

function omdbAPIurl(key : string, title : string) {
  return `http://www.omdbapi.com/?s=${title}&apikey=${key}`
}