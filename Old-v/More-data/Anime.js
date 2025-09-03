const readline = require("readline");
const { ANIME } = require("@consumet/extensions");

const animeProviders = [
  new ANIME.Zoro(),
  new ANIME.Anify(),
  new ANIME.AnimeFox(),
  new ANIME.AnimePahe(),
  new ANIME.AnimeSaturn(),
  new ANIME.AnimeUnity(),
  new ANIME.MonosChinos(),
  new ANIME.NineAnime()
];

let rl;
let currentResults = [];
let currentIndex = 0;
let currentProvider = null;

function createReadline() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function printHeader() {
  console.clear();
  console.log("=====================================");
  console.log("            amlist-owm");
  console.log("        by DASKR coding no database ");
  console.log("=====================================");
  console.log(" *.Anime.*\n");
  console.log("1 = search name anime");
  console.log("2 = list top 10");
  console.log("3 = Choose a letter from a to z\n");
}

async function searchAnime(query) {
  for (const provider of animeProviders) {
    try {
      const result = await provider.search(query);
      if (result.results.length > 0) {
        currentProvider = provider;
        return result.results;
      }
    } catch (e) {}
  }
  return [];
}

async function showMoreResults() {
  const slice = currentResults.slice(currentIndex, currentIndex + 10);
  if (slice.length === 0) {
    console.log("No more results.");
    rl.close();
    return;
  }
  slice.forEach((anime, i) => {
    console.log(`${currentIndex + i + 1}. ${anime.title}`);
  });
  currentIndex += 10;

  rl.question("====(NUMBER = n OR MORE = m) $: ", async (answer) => {
    if (answer === "m") {
      await showMoreResults();
    } else if (!isNaN(answer) && currentResults[parseInt(answer) - 1]) {
      const selected = currentResults[parseInt(answer) - 1];
      const info = await currentProvider.fetchAnimeInfo(selected.id);
      console.log(`\nTitle: ${info.title}`);
      console.log(`Status: ${info.status}`);
      console.log(`Release Date: ${info.releaseDate || "?"}`);
      console.log(`Episodes: ${info.totalEpisodes || "?"}`);
      console.log(`Type: ${info.type}`);
      console.log(`Description: ${info.description || info.synopsis || "N/A"}`);
      rl.close();
    } else {
      console.log("Invalid input.");
      rl.close();
    }
  });
}

async function animeMenu() {
  createReadline();
  printHeader();
  rl.question("=======(1 to 3) $: ", async (choice) => {
    switch (choice) {
      case "1":
        rl.question("Search Anime Name: ", async (query) => {
          currentResults = await searchAnime(query);
          currentIndex = 0;
          if (currentResults.length === 0) {
            console.log("No results found.");
            rl.close();
          } else {
            await showMoreResults();
          }
        });
        break;

      case "2":
        for (const provider of animeProviders) {
          if (typeof provider.fetchTopAiring === "function") {
            try {
              const top = await provider.fetchTopAiring();
              console.log("\nTop 10 Popular Anime:\n");
              top.results.slice(0, 10).forEach((anime, index) => {
                console.log(`${index + 1}. ${anime.title}`);
              });
              break;
            } catch {}
          }
        }
        rl.close();
        break;

      case "3":
        rl.question("(a to z) $: ", async (letter) => {
          if (!/^[a-zA-Z]$/.test(letter)) {
            console.log("Please enter a single letter (a-z)");
            rl.close();
            return;
          }
          currentResults = await searchAnime(letter);
          currentResults = currentResults.filter((anime) =>
            anime.title.toLowerCase().startsWith(letter.toLowerCase())
          );
          currentIndex = 0;
          if (currentResults.length === 0) {
            console.log("No anime found for that letter.");
            rl.close();
          } else {
            await showMoreResults();
          }
        });
        break;

      default:
        console.log("Invalid option.");
        rl.close();
    }
  });
}

module.exports = animeMenu;
