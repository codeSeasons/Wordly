const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('word-input');
const titleEl = document.getElementById('word-title');
const definitionsContainer = document.getElementById('definitions');
const synonymsContainer = document.getElementById('synonyms');
const resultsSection = document.getElementById('results');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (query) {
    getWordData(query);
  }
});

async function getWordData(query) {
  clearResults(); // Reset old content

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);

    if (!response.ok) {
      throw new Error('No results found.');
    }

    const [entry] = await response.json();
    renderResults(entry);

    //show results section after successful fetch
    resultsSection.classList.remove('hidden');
  } catch (error) {
    titleEl.textContent = `Error: ${error.message}`;
  }
}

function renderResults(entry) {
  const { word, meanings } = entry;

  titleEl.textContent = word;

  definitionsContainer.innerHTML = `<h3>Definitions:</h3>`;
  meanings.forEach((meaning) => {
    const { partOfSpeech, definitions } = meaning;

    const definitionList = definitions
      .map((def) => `<li>${def.definition}</li>`)
      .join('');

    definitionsContainer.innerHTML += `
      <p><strong>${partOfSpeech}</strong></p>
      <ul>${definitionList}</ul>
    `;
  });

  const allSynonyms = meanings.flatMap((m) => m.synonyms || []);
  synonymsContainer.innerHTML = allSynonyms.length
    ? `<h3>Synonyms:</h3> ${allSynonyms.join(', ')}`
    : `<p>No synonyms available.</p>`;
}

function clearResults() {
  titleEl.textContent = '';
  definitionsContainer.innerHTML = '';
  synonymsContainer.innerHTML = '';
}