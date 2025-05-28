const https = require("https");

function printHeader() {
  console.log("=".repeat(30));
  console.log("        amlist CLI          ");
  console.log("      by DASKR              ");
  console.log("=".repeat(30));
  console.log();
}

https.get("https://api.jikan.moe/v4/top/anime?limit=10", (res) => {
  let data = "";

  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const animeList = JSON.parse(data).data;
      printHeader();
      animeList.forEach(anime => {
        console.log(`${anime.rank}. ${anime.title} (${anime.score})`);
      });
    } catch (err) {
      console.error("Error parsing data:", err.message);
    }
  });
}).on("error", (err) => {
  console.error("Request failed:", err.message);
});
