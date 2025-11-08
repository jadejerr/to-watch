// netlify/functions/tmdb.js

exports.handler = async (event) => {
  // Get the key from the environment variables
  const API_KEY = process.env.TMDB_API_KEY;
  
  // Get the query parameters from the client
  const clientParams = new URLSearchParams(event.queryStringParameters).toString();
  
  // This is the base URL for the TMDB API
  const API_ENDPOINT = `https://api.themoviedb.org/3/search/tv?${clientParams}`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`, // TMDB uses Bearer token
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    const data = await response.json();

    return { // Send data back to the client
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Access-Control-Allow-Origin": "*" },
    };

  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};