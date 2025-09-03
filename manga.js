const blessed = require('blessed');
const { MANGA } = require("@consumet/extensions");

const mangaProviders = [
  new MANGA.MangaDex(),
  new MANGA.MangaHere(),
  new MANGA.MangaKakalot(),
  new MANGA.Mangasee123(),
  new MANGA.MangaHost()
];

let currentResults = [];
let currentIndex = 0;
let currentProvider = null;

async function searchManga(query) {
  for (const provider of mangaProviders) {
    try {
      const result = await provider.search(query);
      if(result.results.length>0){
        currentProvider = provider;
        return result.results;
      }
    } catch {}
  }
  return [];
}

async function showResults(screen, list){
  list.setItems(currentResults.slice(currentIndex,currentIndex+10).map((m,i)=>`${currentIndex+i+1}. ${m.title}`));
  screen.render();

  list.key('enter', async ()=>{
    const selected = currentResults[list.selected];
    if(!selected) return;
    try{
      const info = await currentProvider.fetchMangaInfo(selected.id);
      blessed.message({parent:screen, top:'center', left:'center', width:'70%', height:'shrink'}).log(
        `Title: ${info.title}\nStatus: ${info.status||"?"}\nRelease Date: ${info.releaseDate||"?"}\nChapters: ${info.totalChapters||"?"}\nType: ${info.type||"?"}\nDescription: ${info.description||"N/A"}`
      );
    } catch {
      blessed.message({parent:screen}).log('Failed to fetch manga info.');
    }
  });

  list.key('d', ()=>{
    const removed = currentResults.splice(list.selected,1);
    list.setItems(currentResults.slice(currentIndex,currentIndex+10).map((m,i)=>`${currentIndex+i+1}. ${m.title}`));
    screen.render();
    blessed.message({parent:screen}).log(`❌ Removed: ${removed[0].title}`);
  });

  list.key('q',()=>process.exit(0));
}

async function mangaMenu(screen){
  screen.children.forEach(c=>screen.remove(c));

  const logo = blessed.box({ top:0, left:'center', width:'100%', height:3, content:'📚 AMLIST', align:'center', style:{ fg:'white', bg:'green' } });
  const help = blessed.box({ bottom:0, left:'center', width:'100%', height:1, content:'1=Search | 2=Top 10 | 3=a-z | Enter=Info | d=Remove | q=Quit', style:{ fg:'white', bg:'green' }, align:'center' });
  screen.append(logo);
  screen.append(help);

  const menu = blessed.list({
    top:4,
    left:'center',
    width:'50%',
    height:5,
    items:['1. Search by Name','2. Top 10','3. Letter a-z'],
    keys:true,
    mouse:true,
    border:{ type:'line' },
    style:{ selected:{ bg:'green', fg:'white' }, border:{ fg:'green' } }
  });

  screen.append(menu);
  menu.focus();
  screen.render();

  menu.key('enter', async ()=>{
    const choice = menu.getItem(menu.selected).content;
    const list = blessed.list({
      top:10,
      left:'center',
      width:'80%',
      height:'70%',
      items: [],
      keys:true,
      mouse:true,
      border:{ type:'line' },
      style:{ selected:{ bg:'green', fg:'white' }, border:{ fg:'green' } }
    });
    screen.append(list);
    list.focus();
    screen.render();

    if(choice.startsWith('1')){
      blessed.prompt({parent:screen, top:'center', left:'center', width:'50%', height:'shrink', label:'Search Manga', border:{type:'line'}, keys:true})
        .input('Search Name: ', async (err,value)=>{
          if(!value) return;
          currentResults = await searchManga(value);
          currentIndex=0;
          await showResults(screen,list);
        });
    } else if(choice.startsWith('2')){
      for(const provider of mangaProviders){
        if(typeof provider.fetchPopularManga==='function'){
          try{
            const top = await provider.fetchPopularManga();
            currentResults = top.results.slice(0,10);
            currentIndex=0;
            await showResults(screen,list);
            break;
          } catch {}
        }
      }
    } else if(choice.startsWith('3')){
      blessed.prompt({parent:screen, top:'center', left:'center', width:'50%', height:'shrink', label:'Letter a-z', border:{type:'line'}, keys:true})
        .input('Enter a letter: ', async (err,value)=>{
          if(!value || !/^[a-zA-Z]$/.test(value)) return;
          currentResults = await searchManga(value);
          currentResults = currentResults.filter(m=>m.title.toLowerCase().startsWith(value.toLowerCase()));
          currentIndex=0;
          await showResults(screen,list);
        });
    }
  });

  menu.key('q',()=>process.exit(0));
}

module.exports = mangaMenu;
