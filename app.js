const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const songList = document.getElementById('songList');
const count = document.getElementById('count');
const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');
const songTitle = document.getElementById('songTitle');
const songText = document.getElementById('songText');
const songCategory = document.getElementById('songCategory');
const backBtn = document.getElementById('backBtn');

function fillCategories(){
  categoryFilter.innerHTML = '<option value="Alle">Alle Kategorien</option>';
  const cats = [...new Set((SONGS || []).map(s => s.category).filter(Boolean))].sort();
  cats.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function renderList(){
  const q = (searchInput.value || '').trim().toLowerCase();
  const selectedCategory = categoryFilter.value || 'Alle';
  const filtered = (SONGS || []).filter(song => {
    const matchesText =
      (song.title || '').toLowerCase().includes(q) ||
      (song.text || '').toLowerCase().includes(q) ||
      (song.nr || '').toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'Alle' || song.category === selectedCategory;
    return matchesText && matchesCategory;
  });

  count.textContent = filtered.length + ' Lieder';
  songList.innerHTML = '';

  filtered.forEach(song => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'song-btn';
    const label = song.nr ? ('Nr. ' + song.nr + ' – ' + song.title) : song.title;
    btn.innerHTML = label + '<span class="song-sub">' + (song.category || '') + '</span>';
    btn.addEventListener('click', () => openSong(song));
    li.appendChild(btn);
    songList.appendChild(li);
  });
}

function openSong(song){
  songCategory.textContent = song.category || '';
  songTitle.textContent = song.nr ? ('Nr. ' + song.nr + ' – ' + song.title) : song.title;
  songText.textContent = song.text || 'Kein Text gefunden.';
  listView.classList.add('hidden');
  detailView.classList.remove('hidden');
  window.scrollTo({top:0, behavior:'smooth'});
}

function closeSong(){
  detailView.classList.add('hidden');
  listView.classList.remove('hidden');
}

searchInput.addEventListener('input', renderList);
categoryFilter.addEventListener('change', renderList);
backBtn.addEventListener('click', closeSong);

fillCategories();
renderList();
