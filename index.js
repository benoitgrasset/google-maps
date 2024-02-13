import fetch from "node-fetch";

const API_KEY = "AIzaSyAsXez5tBSVJi-EDCS7wqzU3glPJDKBu-8";

function convertToQueryString(paramsObject) {
  const str = [];
  const keys = Object.keys(paramsObject);
  keys.forEach((element) => {
    str.push(
      `${encodeURIComponent(element)}=${encodeURIComponent(
        paramsObject[element]
      )}`
    );
  });
  return str.join("&");
}

function removeStingChars(str) {
  return str.replace(/[^A-Za-z0-9\s,]/g, "");
}

async function searchPlaces(query) {
  const endpoint = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const params = new URLSearchParams({
    query,
    key: API_KEY,
  });
  const response = await fetch(`${endpoint}?${params}`);
  const data = await response.json();
  console.log("data", data);

  const results = data.results.map((result) => ({
    name: result.name,
    rating: result.rating,
  }));
  return results;
}

function sortPlacesByRating(places) {
  return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

async function main() {
  const city = "Paris";
  const query = "kebab";
  const places = await searchPlaces(query + " dans " + city);

  if (places.length > 0) {
    const sortedPlaces = sortPlacesByRating(places);
    sortedPlaces.forEach((place, index) => {
      console.log(
        `${index + 1}. ${place.name} - Note : ${
          place.rating || "Non disponible"
        }`
      );
    });
  } else {
    console.log("Aucun résultat trouvé.");
  }
}

main();
