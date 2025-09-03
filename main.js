const blessed = require('blessed');
const animeMenu = require('./anime');
const mangaMenu = require('./manga');

const screen = blessed.screen({ smartCSR: true, title: 'AMLIST TUI' });

const logo = blessed.box({
  top: 0,
  left: 'center',
  width: '100%',
  height: 3,
  content: '📚 AMLIST',
  align: 'center',
  style: { fg: 'white', bg: 'green' }
});

const menu = blessed.list({
  top: 4,
  left: 'center',
  width: '50%',
  height: 5,
  items: ['1. Anime', '2. Manga', 'q. Quit'],
  keys: true,
  mouse: true,
  border: { type: 'line' },
  style: { selected: { bg: 'green', fg: 'white' }, border: { fg: 'green' } }
});

screen.append(logo);
screen.append(menu);
menu.focus();
screen.render();

menu.key(['enter'], async () => {
  const choice = menu.getItem(menu.selected).content;
  if (choice.startsWith('1')) await animeMenu(screen);
  else if (choice.startsWith('2')) await mangaMenu(screen);
});

menu.key(['q', 'C-c'], () => process.exit(0));
