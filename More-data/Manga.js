const readline = require("readline");
const { MANGA } = require("@consumet/extensions");

const mangaProviders = [
  new MANGA.MangaDex(),
  new MANGA.MangaHere(),
  new MANGA.MangaKakalot(),
  new MANGA.Mangasee123(),
  new MANGA.MangaHost(),
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
  console.log("            malist-owm");
  console.log("        by DASKR coding no database ");
  console.log("=====================================");
  console.log(" *.Manga.*\n");
  console.log("1 = search name manga");
  console.log("2 = list top 10");
  console.log("3 = Choose a letter from a to z\n");
}

async function searchManga(query) {
  for (const provider of mangaProviders) {
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

  slice.forEach((manga, i) => {
    console.log(`${currentIndex + i + 1}. ${manga.title}`);
  });
  currentIndex += 10;

  rl.question("====(NUMBER = n OR MORE = m) $: ", async (answer) => {
    if (answer === "m") {
      await showMoreResults();
    } else if (!isNaN(answer) && currentResults[parseInt(answer) - 1]) {
      const selected = currentResults[parseInt(answer) - 1];
      try {
        const info = await currentProvider.fetchMangaInfo(selected.id);
        console.log(`\nTitle: ${info.title}`);
        console.log(`Status: ${info.status || "?"}`);
        console.log(`Release Date: ${info.releaseDate || "?"}`);
        console.log(`Chapters: ${info.totalChapters || "?"}`);
        console.log(`Type: ${info.type || "?"}`);
        console.log(`Description: ${info.description || "N/A"}`);
      } catch (err) {
        console.log("Failed to fetch manga info.");
      }
      rl.close();
    } else {
      console.log("Invalid input.");
      rl.close();
    }
  });
}

async function mangaMenu() {
  createReadline();
  printHeader();
  rl.question("=======(1 to 3) $: ", async (choice) => {
    switch (choice) {
      case "1":
        rl.question("Search Manga Name: ", async (query) => {
          currentResults = await searchManga(query);
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
        for (const provider of mangaProviders) {
          if (typeof provider.fetchPopularManga === "function") {
            try {
              const top = await provider.fetchPopularManga();
              console.log("\nTop 10 Popular Manga:\n");
              top.results.slice(0, 10).forEach((manga, index) => {
                console.log(`${index + 1}. ${manga.title}`);
              });
              rl.close();
              return;
            } catch (e) {
              console.log("Failed to fetch top manga from provider.");
            }
          }
        }
        console.log("No provider supports top manga listing.");
        rl.close();
        break;

      case "3":
        rl.question("(a to z) $: ", async (letter) => {
          if (!/^[a-zA-Z]$/.test(letter)) {
            console.log("Please enter a single letter (a-z)");
            rl.close();
            return;
          }
          currentResults = await searchManga(letter);
          currentResults = currentResults.filter((manga) =>
            manga.title.toLowerCase().startsWith(letter.toLowerCase())
          );
          currentIndex = 0;
          if (currentResults.length === 0) {
            console.log("No manga found for that letter.");
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

module.exports = mangaMenu;
