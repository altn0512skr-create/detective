(function () {
  const STORAGE_KEY = "conan_saved_decks_v2";
  const LEGACY_PLAYER_KEY = "playerDeckRecipe";
  const LEGACY_OPPONENT_KEY = "opponentDeckRecipe";
  const ACTIVE_PLAYER_KEY = "active_player_deck_id";
  const ACTIVE_OPPONENT_KEY = "active_opponent_deck_id";

  const DEFAULT_PLAYER_NAME = "デッキ1";
  const DEFAULT_OPPONENT_NAME = "デッキ2";

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function normalizeRecipe(recipe) {
    if (!Array.isArray(recipe)) return [];

    return recipe
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const image = typeof item.image === "string" ? item.image : "";
        const count = Number(item.count) || 0;

        if (!image || count <= 0) return null;

        return {
          image,
          count
        };
      })
      .filter(Boolean);
  }


  function normalizeSpecialCard(value) {
  return typeof value === "string" ? value : "";
}
  function loadLegacyRecipe(key) {
    return normalizeRecipe(safeJsonParse(localStorage.getItem(key), []));
  }

  function makeDeckId() {
    return "deck_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function saveSavedDecks(decks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }

  function buildDefaultSavedDecks() {
    const playerRecipe = loadLegacyRecipe(LEGACY_PLAYER_KEY);
    const opponentRecipe = loadLegacyRecipe(LEGACY_OPPONENT_KEY);

    const savedDecks = [];
    const now = new Date().toISOString();

    if (playerRecipe.length > 0) {
      savedDecks.push({
        id: makeDeckId(),
        name: DEFAULT_PLAYER_NAME,
        recipe: playerRecipe,
        createdAt: now,
        updatedAt: now
      });
    }

    if (opponentRecipe.length > 0) {
      savedDecks.push({
        id: makeDeckId(),
        name: savedDecks.length === 0 ? DEFAULT_PLAYER_NAME : DEFAULT_OPPONENT_NAME,
        recipe: opponentRecipe,
        createdAt: now,
        updatedAt: now
      });
    }

    return savedDecks;
  }

  function loadSavedDecks() {
    const stored = safeJsonParse(localStorage.getItem(STORAGE_KEY), null);

    if (Array.isArray(stored) && stored.length > 0) {
      return stored
        .map((deck) => {
          if (!deck || typeof deck !== "object") return null;

          const recipe = normalizeRecipe(deck.recipe);
          if (recipe.length === 0) return null;

          return {
  id: typeof deck.id === "string" && deck.id ? deck.id : makeDeckId(),
  name: typeof deck.name === "string" && deck.name.trim() ? deck.name.trim() : "デッキ",
  recipe,
  incidentCard: normalizeSpecialCard(deck.incidentCard),
  partnerCard: normalizeSpecialCard(deck.partnerCard),
  createdAt: deck.createdAt || new Date().toISOString(),
  updatedAt: deck.updatedAt || new Date().toISOString()
};

        })
        .filter(Boolean);
    }

    const migrated = buildDefaultSavedDecks();

    if (migrated.length > 0) {
      saveSavedDecks(migrated);
    }

    return migrated;
  }

  function getSavedDecks() {
    return loadSavedDecks();
  }

  function getDeckById(deckId) {
    return getSavedDecks().find((deck) => deck.id === deckId) || null;
  }

  function getDefaultDeckId() {
    const decks = getSavedDecks();
    return decks[0] ? decks[0].id : "";
  }

  function getActiveDeckId(side) {
    const storageKey = side === "self" ? ACTIVE_PLAYER_KEY : ACTIVE_OPPONENT_KEY;
    const storedId = localStorage.getItem(storageKey);

    if (storedId && getDeckById(storedId)) {
      return storedId;
    }

    const fallbackId = getDefaultDeckId();

    if (fallbackId) {
      localStorage.setItem(storageKey, fallbackId);
    }

    return fallbackId;
  }

  function setActiveDeckId(side, deckId) {
    const storageKey = side === "self" ? ACTIVE_PLAYER_KEY : ACTIVE_OPPONENT_KEY;
    localStorage.setItem(storageKey, deckId);
  }

  function getActiveDeckRecipe(side) {
    const deck = getDeckById(getActiveDeckId(side));
    return deck ? normalizeRecipe(deck.recipe) : [];
  }

  function syncLegacyGlobals() {
    window.playerDeckRecipe = getActiveDeckRecipe("self");
    window.opponentDeckRecipe = getActiveDeckRecipe("opponent");
  }

  function ensureAtLeastOneDeck() {
    const decks = getSavedDecks();

    if (decks.length === 0) {
      syncLegacyGlobals();
      return;
    }

    if (!getActiveDeckId("self")) {
      setActiveDeckId("self", decks[0].id);
    }

    if (!getActiveDeckId("opponent")) {
      setActiveDeckId("opponent", decks[0].id);
    }

    syncLegacyGlobals();
  }

  function upsertSavedDeck(deckId, name, recipe, extra = {}) {
  const decks = getSavedDecks();
  const normalizedRecipe = normalizeRecipe(recipe);
  const trimmedName = (name || "").trim() || `デッキ${decks.length + 1}`;
  const now = new Date().toISOString();

  const incidentCard = normalizeSpecialCard(extra.incidentCard);
  const partnerCard = normalizeSpecialCard(extra.partnerCard);

  const existingIndex = decks.findIndex((deck) => deck.id === deckId);

  if (existingIndex >= 0) {
    decks[existingIndex] = {
      ...decks[existingIndex],
      name: trimmedName,
      recipe: normalizedRecipe,
      incidentCard,
      partnerCard,
      updatedAt: now
    };
    saveSavedDecks(decks);
    syncLegacyGlobals();
    return decks[existingIndex];
  }

  const newDeck = {
    id: makeDeckId(),
    name: trimmedName,
    recipe: normalizedRecipe,
    incidentCard,
    partnerCard,
    createdAt: now,
    updatedAt: now
  };

  decks.push(newDeck);
  saveSavedDecks(decks);

  if (!getActiveDeckId("self")) setActiveDeckId("self", newDeck.id);
  if (!getActiveDeckId("opponent")) setActiveDeckId("opponent", newDeck.id);

  syncLegacyGlobals();
  return newDeck;
}

  function renameDeck(deckId, nextName) {
    const decks = getSavedDecks();
    const target = decks.find((deck) => deck.id === deckId);

    if (!target) return false;

    target.name = (nextName || "").trim() || target.name;
    target.updatedAt = new Date().toISOString();

    saveSavedDecks(decks);
    syncLegacyGlobals();
    return true;
  }

  function deleteDeck(deckId) {
    let decks = getSavedDecks();

    if (decks.length <= 1) {
      alert("最後の1個は削除できません。");
      return false;
    }

    decks = decks.filter((deck) => deck.id !== deckId);
    saveSavedDecks(decks);

    if (getActiveDeckId("self") === deckId) {
      setActiveDeckId("self", decks[0].id);
    }

    if (getActiveDeckId("opponent") === deckId) {
      setActiveDeckId("opponent", decks[0].id);
    }

    syncLegacyGlobals();
    return true;
  }

  function duplicateDeck(deckId) {
  const source = getDeckById(deckId);
  if (!source) return null;

  return upsertSavedDeck(
    null,
    `${source.name} コピー`,
    JSON.parse(JSON.stringify(source.recipe)),
    {
      incidentCard: source.incidentCard || "",
      partnerCard: source.partnerCard || ""
    }
  );
}
  function fillSelect(selectEl, activeId) {
    if (!selectEl) return;

    const decks = getSavedDecks();
    selectEl.innerHTML = "";

    decks.forEach((deck) => {
      const option = document.createElement("option");
      option.value = deck.id;
      option.textContent = `${deck.name}（${deck.recipe.reduce((sum, card) => sum + card.count, 0)}枚）`;
      selectEl.appendChild(option);
    });

    if (decks.length > 0) {
      selectEl.value = activeId && getDeckById(activeId) ? activeId : decks[0].id;
    }
  }

  function refreshBoardDeckSelectors() {
    const playerSelect = document.getElementById("player-deck-select");
    const opponentSelect = document.getElementById("opponent-deck-select");

    fillSelect(playerSelect, getActiveDeckId("self"));
    fillSelect(opponentSelect, getActiveDeckId("opponent"));
  }

  function bindBoardDeckSelectors() {
    const playerSelect = document.getElementById("player-deck-select");
    const opponentSelect = document.getElementById("opponent-deck-select");
    const applyButton = document.getElementById("apply-deck-selection");

    if (!playerSelect || !opponentSelect || !applyButton) return;

    refreshBoardDeckSelectors();

    playerSelect.addEventListener("change", () => {
      setActiveDeckId("self", playerSelect.value);
      syncLegacyGlobals();
    });

    opponentSelect.addEventListener("change", () => {
      setActiveDeckId("opponent", opponentSelect.value);
      syncLegacyGlobals();
    });

    applyButton.addEventListener("click", () => {
      setActiveDeckId("self", playerSelect.value);
      setActiveDeckId("opponent", opponentSelect.value);
      syncLegacyGlobals();

      if (typeof window.restartGameWithSelectedDecks === "function") {
        window.restartGameWithSelectedDecks();
      }
    });
  }

  function recipeTotal(recipe) {
    return normalizeRecipe(recipe).reduce((sum, item) => sum + item.count, 0);
  }

 window.getSavedDecks = getSavedDecks;
window.getDeckById = getDeckById;
window.getActiveDeckId = getActiveDeckId;
window.getActiveDeckRecipe = getActiveDeckRecipe;
window.setActiveDeckId = setActiveDeckId;
window.upsertSavedDeck = upsertSavedDeck;
window.renameSavedDeck = renameDeck;
window.deleteSavedDeck = deleteDeck;
window.duplicateSavedDeck = duplicateDeck;
window.refreshBoardDeckSelectors = refreshBoardDeckSelectors;
window.recipeTotal = recipeTotal;
window.normalizeRecipe = normalizeRecipe;

  ensureAtLeastOneDeck();
  syncLegacyGlobals();

  document.addEventListener("DOMContentLoaded", () => {
    bindBoardDeckSelectors();
  });
})();