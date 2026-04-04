const DECK_SIZE = 40;

let currentDeckTarget = "player";

const CARDS_PER_PAGE = 50;
let currentPage = 1;

const editingDeck = {
  cards: {}
};

let searchKeyword = "";

const cardListEl = document.getElementById("card-list");
const deckTotalEl = document.getElementById("deck-total");
const saveDeckButtonEl = document.getElementById("save-deck-button");
const resetDeckButtonEl = document.getElementById("reset-deck-button");
const editPlayerDeckButtonEl = document.getElementById("edit-player-deck");
const editOpponentDeckButtonEl = document.getElementById("edit-opponent-deck");

const prevPageButtonEl = document.getElementById("prev-page-button");
const nextPageButtonEl = document.getElementById("next-page-button");
const pageInfoEl = document.getElementById("page-info");

const cardSearchInputEl = document.getElementById("card-search-input");
const clearSearchButtonEl = document.getElementById("clear-search-button");

const deckPreviewListEl = document.getElementById("deck-preview-list");
function getStorageKey() {
  return currentDeckTarget === "player" ? "playerDeckData" : "opponentDeckData";
}

function getTargetLabel() {
  return currentDeckTarget === "player" ? "自分デッキ" : "相手デッキ";
}

function getCardCount(cardId) {
  return editingDeck.cards[cardId] || 0;
}

function getDeckTotal() {
  return Object.values(editingDeck.cards).reduce((sum, count) => sum + count, 0);
}

function addCard(cardId) {
  const card = cardMaster.find((c) => c.id === cardId);
  if (!card) return;

  const current = getCardCount(cardId);
  const total = getDeckTotal();

  if (current >= card.maxCopies) return;
  if (total >= DECK_SIZE) return;

  editingDeck.cards[cardId] = current + 1;
  renderAll();
}

function removeCard(cardId) {
  const current = getCardCount(cardId);
  if (current <= 0) return;

  editingDeck.cards[cardId] = current - 1;

  if (editingDeck.cards[cardId] === 0) {
    delete editingDeck.cards[cardId];
  }

  renderAll();
}

function saveDeck() {
  if (getDeckTotal() !== DECK_SIZE) {
    alert("40枚ちょうどで保存してください。");
    return;
  }

  localStorage.setItem(getStorageKey(), JSON.stringify(editingDeck));
  alert(`${getTargetLabel()}を保存しました。`);
}

function loadDeckForCurrentTarget() {
  const raw = localStorage.getItem(getStorageKey());

  editingDeck.cards = {};

  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.cards) {
      editingDeck.cards = parsed.cards;
    }
  } catch (error) {
    console.error("保存デッキの読み込みに失敗しました", error);
  }
}

function switchDeckTarget(target) {
  currentDeckTarget = target;
  loadDeckForCurrentTarget();
  renderAll();
}

function renderCardList() {
  cardListEl.innerHTML = "";

  const pagedCards = getPagedCards();

  pagedCards.forEach((card) => {
    const count = getCardCount(card.id);

    const itemEl = document.createElement("div");
    itemEl.className = "card-item";

    const imageEl = document.createElement("div");
    imageEl.className = "card-image";
    imageEl.style.backgroundImage = `url("${card.image}")`;

    const nameEl = document.createElement("p");
    nameEl.className = "card-name";
    nameEl.textContent = card.name;

    const controlsEl = document.createElement("div");
    controlsEl.className = "card-controls";

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.textContent = "−";
    minusButton.addEventListener("click", () => {
      removeCard(card.id);
    });

    const countEl = document.createElement("div");
    countEl.className = "card-count";
    countEl.textContent = count;

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.addEventListener("click", () => {
      addCard(card.id);
    });

    controlsEl.appendChild(minusButton);
    controlsEl.appendChild(countEl);
    controlsEl.appendChild(plusButton);

    itemEl.appendChild(imageEl);
    itemEl.appendChild(nameEl);
    itemEl.appendChild(controlsEl);

    cardListEl.appendChild(itemEl);
  });
}

function renderHeader() {
  const total = getDeckTotal();
  deckTotalEl.textContent = `${getTargetLabel()}：合計 ${total} / ${DECK_SIZE} 枚`;
  saveDeckButtonEl.disabled = total !== DECK_SIZE;

  editPlayerDeckButtonEl.classList.toggle("active", currentDeckTarget === "player");
  editOpponentDeckButtonEl.classList.toggle("active", currentDeckTarget === "opponent");
}

function renderAll() {
  renderHeader();
  renderPagination();
  renderCardList();
}

function resetDeck() {
  const ok = confirm(`${getTargetLabel()}の選択中カードをすべて0枚にします。よろしいですか？`);
  if (!ok) return;

  editingDeck.cards = {};
  renderAll();
}

function getTotalPages() {
  const filteredCards = getFilteredCards();
  return Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));
}

function getPagedCards() {
  const filteredCards = getFilteredCards();
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  return filteredCards.slice(startIndex, endIndex);
}

function goToPrevPage() {
  if (currentPage <= 1) return;
  currentPage--;
  renderAll();
}

function goToNextPage() {
  if (currentPage >= getTotalPages()) return;
  currentPage++;
  renderAll();
}

function renderPagination() {
  const filteredCards = getFilteredCards();
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;
  prevPageButtonEl.disabled = currentPage === 1;
  nextPageButtonEl.disabled = currentPage === totalPages;
}

function getFilteredCards() {
  const keyword = searchKeyword.trim();

  if (!keyword) {
    return cardMaster;
  }

  return cardMaster.filter((card) => {
    return card.id.includes(keyword);
  });
}

function handleSearchInput() {
  searchKeyword = cardSearchInputEl.value;
  currentPage = 1;
  renderAll();
}

function clearSearch() {
  searchKeyword = "";
  cardSearchInputEl.value = "";
  currentPage = 1;
  renderAll();
}

function renderDeckPreview() {
  deckPreviewListEl.innerHTML = "";

  const entries = Object.entries(editingDeck.cards);

  if (entries.length === 0) {
    deckPreviewListEl.textContent = "カードが選択されていません";
    return;
  }

  entries
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([cardId, count]) => {
      const card = cardMaster.find((c) => c.id === cardId);
      if (!card) return;

      const item = document.createElement("div");
      item.className = "deck-preview-item";

      const image = document.createElement("div");
      image.className = "deck-preview-image";
      image.style.backgroundImage = `url("${card.image}")`;

      const info = document.createElement("div");
      info.className = "deck-preview-info";

      const name = document.createElement("div");
      name.className = "deck-preview-name";
      name.textContent = card.id;

      const amount = document.createElement("div");
      amount.className = "deck-preview-count";
      amount.textContent = `×${count}`;

      info.appendChild(name);
      info.appendChild(amount);

      const controls = document.createElement("div");
      controls.className = "deck-preview-controls";

      const minusButton = document.createElement("button");
      minusButton.type = "button";
      minusButton.className = "deck-preview-button";
      minusButton.textContent = "−";
      minusButton.addEventListener("click", (event) => {
        event.stopPropagation();
        removeOneFromPreview(cardId);
      });

      const plusButton = document.createElement("button");
      plusButton.type = "button";
      plusButton.className = "deck-preview-button";
      plusButton.textContent = "+";
      plusButton.addEventListener("click", (event) => {
        event.stopPropagation();
        addOneFromPreview(cardId);
      });

      controls.appendChild(minusButton);
      controls.appendChild(plusButton);

      item.appendChild(image);
      item.appendChild(info);
      item.appendChild(controls);

      deckPreviewListEl.appendChild(item);
    });
}

function renderAll() {
  renderHeader();
  renderPagination();
  renderCardList();
  renderDeckPreview(); // ←追加
}

function removeOneFromPreview(cardId) {
  const current = getCardCount(cardId);
  if (current <= 0) return;

  editingDeck.cards[cardId] = current - 1;

  if (editingDeck.cards[cardId] === 0) {
    delete editingDeck.cards[cardId];
  }

  renderAll();
}

function addOneFromPreview(cardId) {
  const card = cardMaster.find((c) => c.id === cardId);
  if (!card) return;

  const current = getCardCount(cardId);
  const total = getDeckTotal();

  if (current >= card.maxCopies) return;
  if (total >= DECK_SIZE) return;

  editingDeck.cards[cardId] = current + 1;
  renderAll();
}

function removeOneFromPreview(cardId) {
  const current = getCardCount(cardId);
  if (current <= 0) return;

  editingDeck.cards[cardId] = current - 1;

  if (editingDeck.cards[cardId] === 0) {
    delete editingDeck.cards[cardId];
  }

  renderAll();
}

cardSearchInputEl.addEventListener("input", handleSearchInput);
clearSearchButtonEl.addEventListener("click", clearSearch);
prevPageButtonEl.addEventListener("click", goToPrevPage);
nextPageButtonEl.addEventListener("click", goToNextPage);
saveDeckButtonEl.addEventListener("click", saveDeck);
resetDeckButtonEl.addEventListener("click", resetDeck);

editPlayerDeckButtonEl.addEventListener("click", () => {
  switchDeckTarget("player");
});

editOpponentDeckButtonEl.addEventListener("click", () => {
  switchDeckTarget("opponent");
});

loadDeckForCurrentTarget();
renderAll();