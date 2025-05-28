const readline = require("readline");
const animeMenu = require("./Anime");
const mangaMenu = require("./Manga");

function mainMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.clear();
  console.log("=====================================");
  console.log("            amlist-owm");
  console.log("        by DASKR coding no database");
  console.log("=====================================");
  console.log(" *.Choose option.*\n");
  console.log("1 = Anime");
  console.log("2 = Manga");
  console.log("Other options not implemented yet.\n");

  rl.question("ENTER TO NUMBER (1 OR 2) $: ", (choice) => {
    rl.close();
    if (choice === "1") {
      animeMenu(mainMenu);
    } else if (choice === "2") {
      mangaMenu(mainMenu);
    } else {
      console.log("Feature not implemented or invalid input.");
      process.exit(0);
    }
  });
}

if (require.main === module) {
  mainMenu();
}

module.exports = mainMenu;
