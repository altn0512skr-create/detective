// ========================================
// 状態
// ========================================

let currentDeckId = null;
let currentDeckRecipe = [];

let currentPage = 1;
const cardsPerPage = 30;

let currentIncidentCard = "";
let currentPartnerCard = "";
// ========================================
// 要素取得
// ========================================

const savedDeckListEl = document.getElementById("saved-deck-list");
const deckNameInput = document.getElementById("deck-name-input");
const deckTotalCountEl = document.getElementById("deck-total-count");
const deckUniqueCountEl = document.getElementById("deck-unique-count");

const createNewDeckButton = document.getElementById("create-new-deck-button");
const saveNewDeckButton = document.getElementById("save-new-deck-button");
const overwriteDeckButton = document.getElementById("overwrite-deck-button");
const duplicateDeckButton = document.getElementById("duplicate-deck-button");
const renameDeckButton = document.getElementById("rename-deck-button");
const deleteDeckButton = document.getElementById("delete-deck-button");
const clearDeckButton = document.getElementById("clear-current-deck-button");

const cardLibraryEl = document.getElementById("card-library");
const currentDeckListEl = document.getElementById("current-deck-card-list");

const cardSearchInput = document.getElementById("card-search-input");
const cardSortSelect = document.getElementById("card-sort-select");

const playerDeckSelectBuilderEl = document.getElementById("player-deck-select-builder");
const opponentDeckSelectBuilderEl = document.getElementById("opponent-deck-select-builder");
const startGameButtonEl = document.getElementById("start-game-button");

const incidentCardSelectEl = document.getElementById("incident-card-select");
const partnerCardSelectEl = document.getElementById("partner-card-select");
const incidentCardPreviewEl = document.getElementById("incident-card-preview");
const partnerCardPreviewEl = document.getElementById("partner-card-preview");
const saveSpecialCardButtonEl = document.getElementById("save-special-card-button");

const partnerCardSearchEl = document.getElementById("partner-card-search");
const partnerCardGalleryEl = document.getElementById("partner-card-gallery");

const incidentCardSearchEl = document.getElementById("incident-card-search");
const incidentCardGalleryEl = document.getElementById("incident-card-gallery");
// ========================================
// カードデータ取得
// ========================================

function getAllCards() {
  if (typeof cardMaster !== "undefined" && Array.isArray(cardMaster)) {
    return normalizeCardList(cardMaster);
  }

  if (typeof cardData !== "undefined" && Array.isArray(cardData)) {
    return normalizeCardList(cardData);
  }

  if (typeof cards !== "undefined" && Array.isArray(cards)) {
    return normalizeCardList(cards);
  }

  if (typeof cardList !== "undefined" && Array.isArray(cardList)) {
    return normalizeCardList(cardList);
  }

  if (typeof allCards !== "undefined" && Array.isArray(allCards)) {
    return normalizeCardList(allCards);
  }

  if (Array.isArray(window.cardData)) return normalizeCardList(window.cardData);
  if (Array.isArray(window.cards)) return normalizeCardList(window.cards);
  if (Array.isArray(window.cardList)) return normalizeCardList(window.cardList);
  if (Array.isArray(window.allCards)) return normalizeCardList(window.allCards);

  return [];
}

function normalizeCardList(list) {
  return list
    .map((card, index) => {
      if (!card || typeof card !== "object") return null;

      const image =
        card.image ||
        card.imagePath ||
        card.src ||
        card.path ||
        "";

      if (!image) return null;

      const id =
        card.id ||
        card.cardId ||
        card.code ||
        extractIdFromImage(image) ||
        String(index + 1);

      const name =
        card.name ||
        card.title ||
        card.cardName ||
        extractNameFromImage(image) ||
        `カード ${index + 1}`;

      return {
        id: String(id),
        name: String(name),
        image: String(image),
        maxCopies: Number(card.maxCopies || 3)
      };
    })
    .filter(Boolean);
}

function extractIdFromImage(image) {
  const match = image.match(/([A-Za-z]?\d{3,4})/);
  return match ? match[1] : "";
}

function extractNameFromImage(image) {
  const parts = image.split("/");
  return parts[parts.length - 1] || image;
}

// ========================================
// 初期化
// ========================================

init();

function init() {
  renderSavedDecks();
  renderCardLibrary();
  renderCurrentDeck();
  refreshMatchDeckSelectors();
  fillSpecialCardSelectors();
}

// ========================================
// デッキ一覧
// ========================================

function renderSavedDecks() {
  const decks = getSavedDecks();
  savedDeckListEl.innerHTML = "";

  decks.forEach((deck) => {
    const div = document.createElement("div");
    div.className = "saved-deck-item";

    const total = recipeTotal(deck.recipe);

    div.innerHTML = `
      <div class="saved-deck-main">
        <div class="saved-deck-name-row">
          <span class="saved-deck-name">${escapeHtml(deck.name)}</span>
          <span class="saved-deck-count">${total}枚</span>
        </div>
      </div>
      <div class="saved-deck-actions">
        <button type="button" data-action="load">読み込み</button>
        <button type="button" data-action="self">自分側に指定</button>
        <button type="button" data-action="opponent">相手側に指定</button>
      </div>

      <div class="saved-deck-meta">
  事件: ${escapeHtml(extractNameFromImage(deck.incidentCard || "未設定"))}<br>
  パートナー: ${escapeHtml(extractNameFromImage(deck.partnerCard || "未設定"))}
</div>
    `;

    div.querySelector('[data-action="load"]').addEventListener("click", () => loadDeck(deck.id));
    div.querySelector('[data-action="self"]').addEventListener("click", () => {
      setActiveDeckId("self", deck.id);
      alert(`自分側デッキを「${deck.name}」にしました。`);
    });
    div.querySelector('[data-action="opponent"]').addEventListener("click", () => {
      setActiveDeckId("opponent", deck.id);
      alert(`相手側デッキを「${deck.name}」にしました。`);
    });
    
    
    savedDeckListEl.appendChild(div);
  });
}

// ========================================
// デッキ操作
// ========================================

function loadDeck(id) {
  const deck = getDeckById(id);
  if (!deck) return;

  currentDeckId = id;
  currentDeckRecipe = JSON.parse(JSON.stringify(deck.recipe));
  currentIncidentCard = deck.incidentCard || "";
  currentPartnerCard = deck.partnerCard || "";

  deckNameInput.value = deck.name;

  renderCurrentDeck();
  fillSpecialCardSelectors();
}

createNewDeckButton.onclick = () => {
  currentDeckId = null;
  currentDeckRecipe = [];
  currentIncidentCard = "";
  currentPartnerCard = "";
  deckNameInput.value = "";
  renderCurrentDeck();
  fillSpecialCardSelectors();
};

saveNewDeckButton.onclick = () => {
  const saved = upsertSavedDeck(
    null,
    deckNameInput.value,
    currentDeckRecipe,
    {
      incidentCard: currentIncidentCard,
      partnerCard: currentPartnerCard
    }
  );

  currentDeckId = saved.id;
  currentIncidentCard = saved.incidentCard || "";
  currentPartnerCard = saved.partnerCard || "";
  deckNameInput.value = saved.name;

  renderSavedDecks();
  refreshMatchDeckSelectors();
  fillSpecialCardSelectors();
};

overwriteDeckButton.onclick = () => {
  if (!currentDeckId) {
    alert("上書き対象がありません。先に読み込むか、新規保存してください。");
    return;
  }

  const saved = upsertSavedDeck(
    currentDeckId,
    deckNameInput.value,
    currentDeckRecipe,
    {
      incidentCard: currentIncidentCard,
      partnerCard: currentPartnerCard
    }
  );

  currentDeckId = saved.id;
  currentIncidentCard = saved.incidentCard || "";
  currentPartnerCard = saved.partnerCard || "";
  deckNameInput.value = saved.name;

  renderSavedDecks();
  refreshMatchDeckSelectors();
  fillSpecialCardSelectors();
};

duplicateDeckButton.onclick = () => {
  if (!currentDeckId) {
    alert("複製するデッキがありません。");
    return;
  }

  const duplicated = duplicateSavedDeck(currentDeckId);
  if (!duplicated) return;

  currentDeckId = duplicated.id;
  currentDeckRecipe = JSON.parse(JSON.stringify(duplicated.recipe));
  currentIncidentCard = duplicated.incidentCard || "";
  currentPartnerCard = duplicated.partnerCard || "";
  deckNameInput.value = duplicated.name;

  renderSavedDecks();
  renderCurrentDeck();
  refreshMatchDeckSelectors();
  fillSpecialCardSelectors();
};
renameDeckButton.onclick = () => {
  if (!currentDeckId) {
    alert("名前変更するデッキがありません。");
    return;
  }

  renameSavedDeck(currentDeckId, deckNameInput.value);
  renderSavedDecks();
  refreshMatchDeckSelectors();
  fillSpecialCardSelectors();
};

deleteDeckButton.onclick = () => {
  if (!currentDeckId) {
    alert("削除するデッキがありません。");
    return;
  }

  const ok = confirm("このデッキを削除しますか？");
  if (!ok) return;

  const deleted = deleteSavedDeck(currentDeckId);
  if (!deleted) return;

  currentDeckId = null;
  currentDeckRecipe = [];
  currentIncidentCard = "";
  currentPartnerCard = "";
  deckNameInput.value = "";

  renderSavedDecks();
  renderCurrentDeck();
  refreshMatchDeckSelectors();
  fillSpecialCardSelectors();
};

clearDeckButton.onclick = () => {
  currentDeckRecipe = [];
  renderCurrentDeck();
  renderCardLibrary();
};

if (incidentCardSelectEl) {
  incidentCardSelectEl.addEventListener("change", updateSpecialCardPreview);
}

if (partnerCardSelectEl) {
  partnerCardSelectEl.addEventListener("change", updateSpecialCardPreview);
}
// ========================================
// カード一覧
// ========================================

function renderCardLibrary() {
  cardLibraryEl.innerHTML = "";

  const allCards = getAllCards();

  if (!allCards.length) {
    cardLibraryEl.innerHTML = `
      <div style="padding:16px; color:#fff;">
        カード一覧が見つかりません。<br>
        card-data.js の変数名が想定と違う可能性があります。
      </div>
    `;
    return;
  }

  const keyword = (cardSearchInput?.value || "").trim().toLowerCase();
  const sortType = cardSortSelect?.value || "default";

  let filtered = allCards.filter((card) => {
    if (!keyword) return true;

    return (
      card.name.toLowerCase().includes(keyword) ||
      card.id.toLowerCase().includes(keyword) ||
      card.image.toLowerCase().includes(keyword)
    );
  });

  filtered = sortCards(filtered, sortType);

  const totalPages = Math.max(1, Math.ceil(filtered.length / cardsPerPage));

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const pageCards = filtered.slice(startIndex, endIndex);

  const listWrap = document.createElement("div");
  listWrap.className = "card-library-page-list";

  pageCards.forEach((card) => {
    const currentCount = getCurrentCount(card.image);

    const div = document.createElement("div");
    div.className = "card-library-item";

    div.innerHTML = `
      <div class="card-library-image-wrap">
        <div class="card-library-image" style="background-image:url('${escapeAttr(card.image)}')"></div>
      </div>
      <div class="card-library-info">
        <div class="card-library-title">${escapeHtml(card.name)}</div>
        <div class="card-library-sub">
          ID: ${escapeHtml(card.id)}<br>
          ${currentCount} / ${card.maxCopies}
        </div>
      </div>
      <div class="card-library-actions">
        <button type="button" data-action="add">＋1</button>
        <button type="button" data-action="remove">－1</button>
      </div>
    `;

    div.querySelector('[data-action="add"]').addEventListener("click", () => addCard(card.image));
    div.querySelector('[data-action="remove"]').addEventListener("click", () => removeCard(card.image));

    listWrap.appendChild(div);
  });

  cardLibraryEl.appendChild(listWrap);

  const paginationWrap = document.createElement("div");
  paginationWrap.className = "pagination-wrap";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.textContent = "←";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => changePage(currentPage - 1));
  paginationWrap.appendChild(prevButton);

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  pageNumbers.forEach((item) => {
    if (item === "...") {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.padding = "0 4px";
      dots.style.color = "rgba(255,255,255,0.8)";
      paginationWrap.appendChild(dots);
      return;
    }

    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = String(item);

    if (item === currentPage) {
      pageButton.style.background = "rgba(255, 230, 120, 0.95)";
      pageButton.style.color = "#111";
      pageButton.style.fontWeight = "800";
    }

    pageButton.addEventListener("click", () => changePage(item));
    paginationWrap.appendChild(pageButton);
  });

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "→";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => changePage(currentPage + 1));
  paginationWrap.appendChild(nextButton);

  cardLibraryEl.appendChild(paginationWrap);

  const pageInfo = document.createElement("div");
  pageInfo.className = "pagination-info";
  pageInfo.textContent = `${filtered.length}件中 ${startIndex + 1}〜${Math.min(endIndex, filtered.length)}件を表示`;
  cardLibraryEl.appendChild(pageInfo);
}

function sortCards(cards, sortType) {
  const copied = [...cards];

  switch (sortType) {
    case "id-asc":
      return copied.sort((a, b) => a.id.localeCompare(b.id, "ja"));
    case "id-desc":
      return copied.sort((a, b) => b.id.localeCompare(a.id, "ja"));
    case "name-asc":
      return copied.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    case "name-desc":
      return copied.sort((a, b) => b.name.localeCompare(a.name, "ja"));
    default:
      return copied;
  }
}

function changePage(page) {
  currentPage = page;
  renderCardLibrary();
}

function buildPageNumbers(current, total) {
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (current > 4) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

if (cardSearchInput) {
  cardSearchInput.addEventListener("input", () => {
    currentPage = 1;
    renderCardLibrary();
  });
}

if (cardSortSelect) {
  cardSortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderCardLibrary();
  });
}

// ========================================
// カード追加・削除
// ========================================

function getCurrentCount(image) {
  const found = currentDeckRecipe.find((c) => c.image === image);
  return found ? found.count : 0;
}

function getMaxCopies(image) {
  const allCards = getAllCards();
  const found = allCards.find((card) => card.image === image);
  return found ? found.maxCopies : 3;
}

function addCard(image) {
  const currentCount = getCurrentCount(image);
  const maxCopies = getMaxCopies(image);

  if (currentCount >= maxCopies) {
    alert(`このカードは最大 ${maxCopies} 枚までです。`);
    return;
  }

  const found = currentDeckRecipe.find((c) => c.image === image);

  if (found) {
    found.count++;
  } else {
    currentDeckRecipe.push({ image, count: 1 });
  }

  renderCurrentDeck();
  renderCardLibrary();
}

function removeCard(image) {
  const found = currentDeckRecipe.find((c) => c.image === image);

  if (!found) return;

  found.count--;

  if (found.count <= 0) {
    currentDeckRecipe = currentDeckRecipe.filter((c) => c.image !== image);
  }

  renderCurrentDeck();
  renderCardLibrary();
}

// ========================================
// 現在のデッキ
// ========================================

function renderCurrentDeck() {
  currentDeckListEl.innerHTML = "";

  let total = 0;

  currentDeckRecipe.forEach((card) => {
    total += card.count;

    const div = document.createElement("div");
    div.className = "current-deck-item";

    div.innerHTML = `
      <div class="current-deck-image-wrap">
        <div class="current-deck-image" style="background-image:url('${escapeAttr(card.image)}')"></div>
      </div>
      <div class="current-deck-info">
        <div class="current-deck-title">${escapeHtml(extractNameFromImage(card.image))}</div>
        <div class="current-deck-sub">${escapeHtml(card.image)}</div>
      </div>
      <div class="current-deck-controls">
        <button type="button" data-action="minus">－</button>
        <span class="current-count">${card.count}</span>
        <button type="button" data-action="plus">＋</button>
      </div>
    `;

    div.querySelector('[data-action="minus"]').addEventListener("click", () => removeCard(card.image));
    div.querySelector('[data-action="plus"]').addEventListener("click", () => addCard(card.image));

    currentDeckListEl.appendChild(div);
  });

  deckTotalCountEl.textContent = total;
  deckUniqueCountEl.textContent = currentDeckRecipe.length;
}

// ========================================
// エスケープ
// ========================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return String(value).replaceAll("'", "\\'");
}

function refreshMatchDeckSelectors() {
  if (!playerDeckSelectBuilderEl || !opponentDeckSelectBuilderEl) return;

  const decks = getSavedDecks();

  playerDeckSelectBuilderEl.innerHTML = "";
  opponentDeckSelectBuilderEl.innerHTML = "";

  decks.forEach((deck) => {
    const total = recipeTotal(deck.recipe);

    const option1 = document.createElement("option");
    option1.value = deck.id;
    option1.textContent = `${deck.name}（${total}枚）`;
    playerDeckSelectBuilderEl.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = deck.id;
    option2.textContent = `${deck.name}（${total}枚）`;
    opponentDeckSelectBuilderEl.appendChild(option2);
  });

  const activePlayerId = localStorage.getItem("active_player_deck_id");
  const activeOpponentId = localStorage.getItem("active_opponent_deck_id");

  if (activePlayerId) {
    playerDeckSelectBuilderEl.value = activePlayerId;
  }

  if (activeOpponentId) {
    opponentDeckSelectBuilderEl.value = activeOpponentId;
  }

  if (!playerDeckSelectBuilderEl.value && decks[0]) {
    playerDeckSelectBuilderEl.value = decks[0].id;
  }

  if (!opponentDeckSelectBuilderEl.value && decks[0]) {
    opponentDeckSelectBuilderEl.value = decks[0].id;
  }
}

if (startGameButtonEl) {
  startGameButtonEl.addEventListener("click", () => {
    const playerDeckId = playerDeckSelectBuilderEl?.value;
    const opponentDeckId = opponentDeckSelectBuilderEl?.value;

    if (!playerDeckId || !opponentDeckId) {
      alert("自分側と相手側のデッキを選んでください。");
      return;
    }

    setActiveDeckId("self", playerDeckId);
    setActiveDeckId("opponent", opponentDeckId);

    location.href = "index.html";
  });
}

function fillSpecialCardSelectors() {
  if (incidentCardSelectEl && typeof incidentCardList !== "undefined" && Array.isArray(incidentCardList)) {
    incidentCardSelectEl.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "未設定";
    incidentCardSelectEl.appendChild(emptyOption);

    incidentCardList.forEach((card) => {
      const option = document.createElement("option");
      option.value = card.image;
      option.textContent = card.name || card.id || card.image;
      incidentCardSelectEl.appendChild(option);
    });
  }

  if (partnerCardSelectEl && typeof partnerCardList !== "undefined" && Array.isArray(partnerCardList)) {
    partnerCardSelectEl.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "未設定";
    partnerCardSelectEl.appendChild(emptyOption);

    partnerCardList.forEach((card) => {
      const option = document.createElement("option");
      option.value = card.image;
      option.textContent = card.name || card.id || card.image;
      partnerCardSelectEl.appendChild(option);
    });
  }

  if (incidentCardSelectEl) {
    incidentCardSelectEl.value = currentIncidentCard || "";
  }

  if (partnerCardSelectEl) {
    partnerCardSelectEl.value = currentPartnerCard || "";
  }

  updateSpecialCardPreview();
  renderIncidentCardGallery();
  renderPartnerCardGallery();
}

function renderIncidentCardGallery() {
  if (!incidentCardGalleryEl || typeof incidentCardList === "undefined" || !Array.isArray(incidentCardList)) {
    return;
  }

  const keyword = (incidentCardSearchEl?.value || "").trim().toLowerCase();
  incidentCardGalleryEl.innerHTML = "";

  const filtered = incidentCardList.filter((card) => {
    if (!keyword) return true;
    return (
      (card.id || "").toLowerCase().includes(keyword) ||
      (card.name || "").toLowerCase().includes(keyword) ||
      (card.image || "").toLowerCase().includes(keyword)
    );
  });

  filtered.forEach((card) => {
    const itemEl = document.createElement("button");
    itemEl.type = "button";
    itemEl.className = "special-card-gallery-item";

    if (card.image === currentIncidentCard) {
      itemEl.classList.add("is-selected");
    }

    itemEl.innerHTML = `
      <div class="special-card-gallery-thumb" style="background-image:url('${escapeAttr(card.image)}')"></div>
      <div class="special-card-gallery-name">${escapeHtml(card.name || card.id || card.image)}</div>
    `;

    itemEl.addEventListener("click", () => {
      currentIncidentCard = card.image;

      if (incidentCardSelectEl) {
        incidentCardSelectEl.value = card.image;
      }

      updateSpecialCardPreview();
    });

    incidentCardGalleryEl.appendChild(itemEl);
  });
}

function renderPartnerCardGallery() {
  if (!partnerCardGalleryEl || typeof partnerCardList === "undefined" || !Array.isArray(partnerCardList)) {
    return;
  }

  const keyword = (partnerCardSearchEl?.value || "").trim().toLowerCase();
  partnerCardGalleryEl.innerHTML = "";

  const filtered = partnerCardList.filter((card) => {
    if (!keyword) return true;
    return (
      (card.id || "").toLowerCase().includes(keyword) ||
      (card.name || "").toLowerCase().includes(keyword) ||
      (card.image || "").toLowerCase().includes(keyword)
    );
  });

  filtered.forEach((card) => {
    const itemEl = document.createElement("button");
    itemEl.type = "button";
    itemEl.className = "special-card-gallery-item";

    if (card.image === currentPartnerCard) {
      itemEl.classList.add("is-selected");
    }

    itemEl.innerHTML = `
      <div class="special-card-gallery-thumb" style="background-image:url('${escapeAttr(card.image)}')"></div>
      <div class="special-card-gallery-name">${escapeHtml(card.name || card.id || card.image)}</div>
    `;

    itemEl.addEventListener("click", () => {
      currentPartnerCard = card.image;

      if (partnerCardSelectEl) {
        partnerCardSelectEl.value = card.image;
      }

      updateSpecialCardPreview();
    });

    partnerCardGalleryEl.appendChild(itemEl);
  });
}

function updateSpecialCardPreview() {
  currentIncidentCard = incidentCardSelectEl?.value || "";
  currentPartnerCard = partnerCardSelectEl?.value || "";

  if (incidentCardPreviewEl) {
    incidentCardPreviewEl.style.backgroundImage = currentIncidentCard
      ? `url("${currentIncidentCard}")`
      : "none";
  }

  if (partnerCardPreviewEl) {
    partnerCardPreviewEl.style.backgroundImage = currentPartnerCard
      ? `url("${currentPartnerCard}")`
      : "none";
  }

  renderIncidentCardGallery();
  renderPartnerCardGallery();
}

if (incidentCardSearchEl) {
  incidentCardSearchEl.addEventListener("input", renderIncidentCardGallery);
}

if (partnerCardSearchEl) {
  partnerCardSearchEl.addEventListener("input", renderPartnerCardGallery);
}

if (incidentCardSelectEl) {
  incidentCardSelectEl.addEventListener("change", updateSpecialCardPreview);
}

if (partnerCardSelectEl) {
  partnerCardSelectEl.addEventListener("change", updateSpecialCardPreview);
}

if (saveSpecialCardButtonEl) {
  saveSpecialCardButtonEl.addEventListener("click", () => {
    updateSpecialCardPreview();

    if (!currentDeckId) {
      alert("先に保存済みデッキを読み込むか、新規保存してください。");
      return;
    }

    const saved = upsertSavedDeck(
      currentDeckId,
      deckNameInput.value,
      currentDeckRecipe,
      {
        incidentCard: currentIncidentCard,
        partnerCard: currentPartnerCard
      }
    );

    currentDeckId = saved.id;
    currentIncidentCard = saved.incidentCard || "";
    currentPartnerCard = saved.partnerCard || "";
    deckNameInput.value = saved.name;

    renderSavedDecks();
    refreshMatchDeckSelectors();
    fillSpecialCardSelectors();

    alert("このデッキに事件カードとパートナーカードを保存しました。");
  });
}