/* =========================
   要素取得
========================= */

const dom = {
  self: {
    hand: document.getElementById("player-hand"),
    deckCount: document.querySelector(".player-deck .deck-count"),
    deckCard: document.querySelector(".player-deck .deck-card"),
    file: document.getElementById("file-area"),
    fileCount: document.getElementById("file-count"),
    evidence: document.getElementById("evidence-area"),
    evidenceCount: document.getElementById("evidence-count"),
    remove: document.getElementById("remove-area"),
    scene: document.getElementById("scene-area")
  },
  opponent: {
    hand: document.getElementById("opponent-hand"),
    deckCount: document.querySelector(".opponent-deck .deck-count"),
    deckCard: document.querySelector(".opponent-deck .deck-card"),
    file: document.getElementById("opponent-file-area"),
    fileCount: document.getElementById("opponent-file-count"),
    evidence: document.getElementById("opponent-evidence-area"),
    evidenceCount: document.getElementById("opponent-evidence-count"),
    remove: document.getElementById("opponent-remove-area"),
    scene: document.getElementById("opponent-scene-area")
  }
};

const incidentCardEl = document.getElementById("incident-card");
const opponentIncidentCardEl = document.getElementById("opponent-incident-card");

const partnerCardEl = document.getElementById("partner-card");
const opponentPartnerCardEl = document.getElementById("opponent-partner-card");

const playerDeckEl = document.querySelector(".player-deck .deck-card");
const opponentDeckEl = document.querySelector(".opponent-deck .deck-card");

const fileAreaEl = document.getElementById("file-area");
const removeAreaEl = document.getElementById("remove-area");

const opponentRemoveAreaEl = document.getElementById("opponent-remove-area");
const opponentEvidenceAreaEl = document.getElementById("opponent-evidence-area");
const opponentFileAreaEl = document.getElementById("opponent-file-area");

const deckMenuEl = document.getElementById("deck-menu");
const deckOptions = document.querySelectorAll(".deck-option");

const handMenuEl = document.getElementById("hand-menu");
const handOptions = document.querySelectorAll(".hand-option");

const sceneMenuEl = document.getElementById("scene-menu");
const sceneOptions = document.querySelectorAll(".scene-option");

const revealMenuEl = document.getElementById("reveal-menu");
const revealOptions = document.querySelectorAll(".reveal-option");

const fileMenuEl = document.getElementById("file-menu");
const fileOptions = document.querySelectorAll(".file-option");

const evidenceMenuEl = document.getElementById("evidence-menu");
const evidenceOptions = document.querySelectorAll(".evidence-option");

const removeMenuEl = document.getElementById("remove-menu");
const removeOptions = document.querySelectorAll(".remove-option");

const removeCardMenuEl = document.getElementById("remove-card-menu");
const removeCardOptions = document.querySelectorAll(".remove-card-option");

const partnerMenuEl = document.getElementById("partner-menu");
const partnerOptions = document.querySelectorAll(".partner-option");

const cardPreviewEl = document.getElementById("card-preview");
const cardPreviewImageEl = document.getElementById("card-preview-image");

const revealLayerEl = document.getElementById("reveal-layer");
const revealLayerCardsEl = document.getElementById("reveal-layer-cards");

const removeLayerEl = document.getElementById("remove-layer");
const removeLayerCardsEl = document.getElementById("remove-layer-cards");

const partnerFileCardEl = document.getElementById("partner-file-card");
const opponentPartnerFileCardEl = document.getElementById("opponent-partner-file-card");

const incidentMenuEl = document.getElementById("incident-menu");
const incidentOptions = document.querySelectorAll(".incident-option");

const incidentOverlayEl = document.getElementById("incident-overlay");
const incidentOverlayImageEl = document.getElementById("incident-overlay-image");

const undoButtonEl = document.getElementById("undo-button");

const historyStack = [];

const evidenceLayerEl = document.getElementById("evidence-layer");
const evidenceLayerCardsEl = document.getElementById("evidence-layer-cards");
const evidenceCardMenuEl = document.getElementById("evidence-card-menu");
const evidenceCardOptions = document.querySelectorAll(".evidence-card-option");

/* =========================
   ゲームデータ
========================= */

const game = {
  self: {
    deck: [],
    hand: [],
    file: [],
    evidence: [],
    remove: [],
    revealed: [],
    scene: [null, null, null, null, null],
    incident: "",
    partner: "",
    partnerFile: ""
  },
  opponent: {
    deck: [],
    hand: [],
    file: [],
    evidence: [],
    remove: [],
    revealed: [],
    scene: [null, null, null, null, null],
    incident: "",
    partner: "",
    partnerFile: ""
  }
};

/* =========================
   選択状態
========================= */

let selectedHandCardIndex = null;
let selectedHandSide = "self";
let selectedSceneCardIndex = null;
let selectedSceneSide = "self";
let selectedRevealCardIndex = null;
let selectedRevealSide = "self";
let selectedRemoveCardIndex = null;
let selectedRemoveSide = "self";
let selectedFileCardIndex = null;

let selectedDeckSide = "self";
let selectedFileSide = "self";
let selectedPartnerSide = null;
let selectedEvidenceSide = "self";
let selectedIncidentSide = null;

let previewOpened = false;

let selectedEvidenceCardIndex = null;

const partnerTapped = {
  self: false,
  opponent: false
};

/* =========================
   共通関数
========================= */

function isHorizontalCard(imagePath) {
  return typeof imagePath === "string" && imagePath.includes("_h");
}

function showMenuAt(menuEl, targetRect, offsetX = 12, offsetY = 0) {
  if (!menuEl || !targetRect) return;

  const menuWidth = menuEl.offsetWidth || 140;
  const menuHeight = menuEl.offsetHeight || 220;

  let left = targetRect.right + offsetX;
  let top = targetRect.top + offsetY;

  if (left + menuWidth > window.innerWidth - 12) {
    left = targetRect.left - menuWidth - 12;
  }

  if (top + menuHeight > window.innerHeight - 12) {
    top = window.innerHeight - menuHeight - 12;
  }

  if (top < 12) top = 12;
  if (left < 12) left = 12;

  menuEl.style.left = `${left}px`;
  menuEl.style.top = `${top}px`;
  menuEl.style.transform = "none";
  menuEl.classList.remove("hidden");
}

function buildDeck(recipe) {
  const deck = [];

  for (const card of recipe) {
    for (let i = 0; i < card.count; i++) {
      deck.push(card.image);
    }
  }

  return deck;
}

function shuffle(array) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

function drawCard(deck) {
  return deck.shift();
}

function drawStartingHand(side, count = 5) {
  game[side].hand = [];

  for (let i = 0; i < count; i++) {
    const card = drawCard(game[side].deck);
    if (card) {
      game[side].hand.push(card);
    }
  }
}

function getFirstEmptySceneSlot(side) {
  return game[side].scene.findIndex((slot) => slot === null);
}

/* =========================
   盤面縮尺
========================= */

function fitBoardToViewport() {
  const viewport = document.querySelector(".board-viewport");
  const board = document.querySelector(".board");

  if (!viewport || !board) return;

  const isMobile = window.innerWidth <= 768;

  const baseWidth = isMobile ? 980 : 1600;
  const baseHeight = isMobile ? 1700 : 900;

  const scaleX = viewport.clientWidth / baseWidth;
  const scaleY = viewport.clientHeight / baseHeight;
  let scale = Math.min(scaleX, scaleY);

  if (isMobile) {
    scale *= 0.98;
  }

  board.style.transform = `scale(${scale})`;
}

/* =========================
   描画：事件 / パートナー
========================= */

function renderIncidentCard(imagePath) {
  if (!incidentCardEl) return;

  if (!imagePath) {
    incidentCardEl.style.backgroundImage = "none";
    incidentCardEl.classList.remove("card-vertical", "card-horizontal");
    return;
  }

  incidentCardEl.style.backgroundImage = `url("${imagePath}")`;
  incidentCardEl.classList.remove("card-vertical", "card-horizontal");

  if (isHorizontalCard(imagePath)) {
    incidentCardEl.classList.add("card-horizontal");
  } else {
    incidentCardEl.classList.add("card-vertical");
  }
}

function renderOpponentIncidentCard(imagePath) {
  if (!opponentIncidentCardEl) return;

  if (!imagePath) {
    opponentIncidentCardEl.style.backgroundImage = "none";
    opponentIncidentCardEl.classList.remove("card-vertical", "card-horizontal");
    return;
  }

  opponentIncidentCardEl.style.backgroundImage = `url("${imagePath}")`;
  opponentIncidentCardEl.classList.remove("card-vertical", "card-horizontal");

  if (isHorizontalCard(imagePath)) {
    opponentIncidentCardEl.classList.add("card-horizontal");
  } else {
    opponentIncidentCardEl.classList.add("card-vertical");
  }
}

function renderPartnerCard(imagePath) {
  if (!partnerCardEl) return;

  partnerCardEl.classList.remove("partner-vertical", "partner-horizontal");

  if (!imagePath) {
    partnerCardEl.style.backgroundImage = "none";
    return;
  }

  partnerCardEl.style.backgroundImage = `url("${imagePath}")`;

  if (isHorizontalCard(imagePath)) {
    partnerCardEl.classList.add("partner-horizontal");
  } else {
    partnerCardEl.classList.add("partner-vertical");
  }

  partnerCardEl.style.transformOrigin = "center center";
  partnerCardEl.style.transform = partnerTapped.self ? "rotate(180deg)" : "rotate(90deg)";
}

function renderOpponentPartnerCard(imagePath) {
  if (!opponentPartnerCardEl) return;

  opponentPartnerCardEl.classList.remove("partner-vertical", "partner-horizontal");

  if (!imagePath) {
    opponentPartnerCardEl.style.backgroundImage = "none";
    return;
  }

  opponentPartnerCardEl.style.backgroundImage = `url("${imagePath}")`;

  if (isHorizontalCard(imagePath)) {
    opponentPartnerCardEl.classList.add("partner-horizontal");
  } else {
    opponentPartnerCardEl.classList.add("partner-vertical");
  }

  opponentPartnerCardEl.style.transformOrigin = "center center";
  opponentPartnerCardEl.style.transform = partnerTapped.opponent ? "rotate(0deg)" : "rotate(-90deg)";
}

function renderPartnerFileCard(side) {
  const targetEl = side === "self" ? partnerFileCardEl : opponentPartnerFileCardEl;
  if (!targetEl) return;

  const imagePath = game[side].partnerFile;

  targetEl.classList.remove("partner-vertical", "partner-horizontal");

  if (!imagePath) {
    targetEl.style.backgroundImage = "none";
    targetEl.style.transform = "none";
    return;
  }

  targetEl.style.backgroundImage = `url("${imagePath}")`;

  if (isHorizontalCard(imagePath)) {
    targetEl.classList.add("partner-horizontal");
  } else {
    targetEl.classList.add("partner-vertical");
  }

  targetEl.style.transformOrigin = "center center";

  if (side === "self") {
    targetEl.style.transform = "rotate(360deg)";
  } else {
    targetEl.style.transform = "rotate(180deg)";
  }
}
/* =========================
   描画：手札 / FILE / 証拠 / リムーブ / 現場
========================= */

function renderHand(side) {
  const handEl = dom[side].hand;
  if (!handEl) return;

  handEl.innerHTML = "";

  const total = game[side].hand.length;

  game[side].hand.forEach((imagePath, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "hand-card";
    cardEl.style.backgroundImage = `url("${imagePath}")`;

    if (side === "self") {
      cardEl.style.zIndex = index + 1;
    } else {
      cardEl.style.zIndex = total - index;
    }

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!handMenuEl.classList.contains("hidden")) {
        hideHandMenu();
        return;
      }

      hideAllMenus();
      selectedHandSide = side;
      selectedHandCardIndex = index;
      showMenuAt(handMenuEl, cardEl.getBoundingClientRect());
    });

    handEl.appendChild(cardEl);
  });
}

function renderFileArea(side) {
  const fileEl = dom[side].file;
  const fileCountEl = dom[side].fileCount;

  if (!fileEl || !fileCountEl) return;

  fileCountEl.textContent = `${game[side].file.length}枚`;
  fileEl.classList.toggle("has-cards", game[side].file.length > 0);
  fileEl.innerHTML = "";

  game[side].file.forEach((cardData, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "file-card";

    const imagePath = cardData.image;
    const type = cardData.type;

    if (type === "partner") {
      cardEl.style.backgroundImage = `url("${imagePath}")`;
    } else {
      cardEl.style.backgroundImage = `url("cards/back.png")`;
    }

    cardEl.style.left = "0px";

    if (side === "self") {
      cardEl.style.top = `${index * 14}px`;
      cardEl.style.transform = "rotate(180deg)";
    } else {
      cardEl.style.top = `${index * -14}px`;
      cardEl.style.transform = "rotate(0deg)";
    }

    cardEl.style.zIndex = `${index + 1}`;

    fileEl.appendChild(cardEl);
  });
}

function renderEvidenceArea(side) {
  const evidenceEl = dom[side].evidence;
  const evidenceCountEl = dom[side].evidenceCount;

  if (!evidenceEl || !evidenceCountEl) return;

  renumberEvidence(side);

  evidenceCountEl.textContent = `${game[side].evidence.length}枚`;
  evidenceEl.innerHTML = "";

  game[side].evidence.forEach((cardData, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "evidence-card";

    cardEl.style.backgroundImage = cardData.faceUp
      ? `url("${cardData.image}")`
      : `url("cards/back.png")`;

    if (side === "self") {
      cardEl.style.left = `${index * -20}px`;
      cardEl.style.transform = "rotate(180deg)";
    } else {
      cardEl.style.left = `${index * 20}px`;
      cardEl.style.transform = "rotate(0deg)";
    }

    cardEl.style.top = "0px";
    cardEl.style.zIndex = index + 1;

    const numberEl = document.createElement("div");
    numberEl.className = "evidence-card-number";
    numberEl.textContent = cardData.number;

    cardEl.appendChild(numberEl);
    evidenceEl.appendChild(cardEl);
  });
}

function renderRemoveArea(side) {
  const removeEl = dom[side].remove;
  if (!removeEl) return;

  if (game[side].remove.length === 0) {
    removeEl.style.backgroundImage = "";
  } else {
    const topCard = game[side].remove[game[side].remove.length - 1];
    removeEl.style.backgroundImage = `url("${topCard}")`;
  }
}

function renderSceneArea(side) {
  const sceneEl = dom[side].scene;
  if (!sceneEl) return;

  const slotEls = sceneEl.querySelectorAll(".scene-slot");
  if (!slotEls.length) return;

  slotEls.forEach((slotEl, index) => {
    slotEl.innerHTML = "";

    const card = game[side].scene[index];
    if (!card) return;

    const cardEl = document.createElement("div");
    cardEl.className = "scene-card";
    cardEl.style.backgroundImage = `url("${card.image}")`;

    if (card.sleep) {
      cardEl.classList.add("card-sleep");
    }

    if (card.stun) {
      cardEl.classList.add("card-stun");
    }

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      hideAllMenus();
      selectedSceneCardIndex = index;
      selectedSceneSide = side;
      showMenuAt(sceneMenuEl, cardEl.getBoundingClientRect());
    });

    slotEl.appendChild(cardEl);
  });
}

/* =========================
   描画：レイヤー
========================= */

function showCardPreview(imagePath) {
  if (!cardPreviewEl || !cardPreviewImageEl) return;

  cardPreviewImageEl.style.backgroundImage = `url("${imagePath}")`;
  cardPreviewEl.classList.remove("hidden");
  previewOpened = true;
}

function hideCardPreview() {
  if (!cardPreviewEl) return;

  cardPreviewEl.classList.add("hidden");
  previewOpened = false;
}

function renderRevealLayer(side) {
  if (!revealLayerEl || !revealLayerCardsEl) return;

  revealLayerCardsEl.innerHTML = "";

  game[side].revealed.forEach((imagePath, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "hand-card";
    cardEl.style.backgroundImage = `url("${imagePath}")`;

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      hideAllMenus();
      selectedRevealCardIndex = index;
      selectedRevealSide = side;
      showMenuAt(revealMenuEl, cardEl.getBoundingClientRect());
    });

    revealLayerCardsEl.appendChild(cardEl);
  });

  revealLayerEl.classList.toggle("hidden", game[side].revealed.length === 0);
}

function hideRevealLayer() {
  if (!revealLayerEl) return;
  revealLayerEl.classList.add("hidden");
}

function renderRemoveLayer(side = "self") {
  if (!removeLayerEl || !removeLayerCardsEl) return;

  removeLayerCardsEl.innerHTML = "";

  game[side].remove.forEach((imagePath, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "hand-card";
    cardEl.style.backgroundImage = `url("${imagePath}")`;

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      hideAllMenus();
      selectedRemoveCardIndex = index;
      selectedRemoveSide = side;
      showMenuAt(removeCardMenuEl, cardEl.getBoundingClientRect());
    });

    removeLayerCardsEl.appendChild(cardEl);
  });

  removeLayerEl.classList.toggle("hidden", game[side].remove.length === 0);
}

function renderEvidenceLayer(side = "self") {
  if (!evidenceLayerEl || !evidenceLayerCardsEl) return;

  renumberEvidence(side);

  evidenceLayerCardsEl.innerHTML = "";

  game[side].evidence.forEach((cardData, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "evidence-list-card";
    cardEl.style.backgroundImage = cardData.faceUp
      ? `url("${cardData.image}")`
      : `url("cards/back.png")`;

    const badgeEl = document.createElement("div");
    badgeEl.className = "evidence-number-badge";
    badgeEl.textContent = cardData.number;

    cardEl.appendChild(badgeEl);

    cardEl.addEventListener("click", (event) => {
  event.stopPropagation();

  hideEvidenceCardMenu();

  selectedEvidenceSide = side;
  selectedEvidenceCardIndex = index;

  showMenuAt(evidenceCardMenuEl, cardEl.getBoundingClientRect());
});

    evidenceLayerCardsEl.appendChild(cardEl);
  });

  evidenceLayerEl.classList.toggle("hidden", game[side].evidence.length === 0);
}

function hideEvidenceCardMenu() {
  if (!evidenceCardMenuEl) return;
  evidenceCardMenuEl.classList.add("hidden");
  selectedEvidenceCardIndex = null;
}
function hideEvidenceLayer() {
  if (!evidenceLayerEl) return;
  evidenceLayerEl.classList.add("hidden");
}

function hideRemoveLayer() {
  if (!removeLayerEl) return;
  removeLayerEl.classList.add("hidden");
}

/* =========================
   盤面全体再描画
========================= */

function renderAll() {
  renderHand("self");
  renderHand("opponent");

  renderFileArea("self");
  renderFileArea("opponent");

  renderEvidenceArea("self");
  renderEvidenceArea("opponent");

  renderSceneArea("self");
  renderSceneArea("opponent");

  renderRemoveArea("self");
  renderRemoveArea("opponent");

  renderIncidentCard(game.self.incident);
  renderOpponentIncidentCard(game.opponent.incident);

  renderPartnerCard(game.self.partner);
  renderOpponentPartnerCard(game.opponent.partner);

  renderPartnerFileCard("self");
  renderPartnerFileCard("opponent");

  updateDeckCount("self");
  updateDeckCount("opponent");

  renderRevealLayer("self");
}

/* =========================
   Undo
========================= */

function saveState() {
  const snapshot = {
    game: JSON.parse(JSON.stringify(game)),
    partnerTapped: JSON.parse(JSON.stringify(partnerTapped))
  };

  historyStack.push(snapshot);
  console.log("saveState:", historyStack.length);
}

function undo() {
  console.log("undo click:", historyStack.length);

  if (historyStack.length === 0) return;

  const prevState = historyStack.pop();

  game.self = prevState.game.self;
  game.opponent = prevState.game.opponent;

  partnerTapped.self = prevState.partnerTapped.self;
  partnerTapped.opponent = prevState.partnerTapped.opponent;

  hideAllMenus();
  hideCardPreview();
  hideRevealMenu();
  hideRevealLayer();
  hideRemoveMenu();
  hideRemoveCardMenu();
  hideRemoveLayer();
  hideIncidentOverlay();
  hideEvidenceCardMenu();
  hideEvidenceLayer();

  renderAll();
}
/* =========================
   操作：DECK / 現場 / FILE / パートナー
========================= */

function drawCardToHand(side) {
  if (game[side].deck.length === 0) return;

  const card = game[side].deck.shift();
  game[side].hand.push(card);

  renderHand(side);
  updateDeckCount(side);
}

function sendCardToFile(side) {
  if (game[side].deck.length === 0) return;

  const card = game[side].deck.shift();
  game[side].file.push({
    image: card,
    type: "normal"
  });

  renderFileArea(side);
  updateDeckCount(side);
}

function renumberEvidence(side) {
  game[side].evidence.forEach((cardData, index) => {
    cardData.number = index + 1;
  });
}

function sendCardToEvidence(side) {
  if (game[side].deck.length === 0) return;

  const card = game[side].deck.shift();

  game[side].evidence.push({
    image: card,
    number: 0,
    faceUp: false
  });

  renumberEvidence(side);
  renderEvidenceArea(side);
  updateDeckCount(side);
}

function previewTopDeckCard(side) {
  if (game[side].deck.length === 0) return;

  const card = game[side].deck.shift();
  game[side].revealed.push(card);

  renderRevealLayer(side);
  updateDeckCount(side);
}

function sendSceneCardToRemove(side) {
  if (selectedSceneCardIndex === null) return;

  const card = game[side].scene[selectedSceneCardIndex];
  if (!card) return;

  game[side].scene[selectedSceneCardIndex] = null;
  game[side].remove.push(card.image);

  renderSceneArea(side);
  renderRemoveArea(side);
}

function moveTopFileCardToHand(side) {
  if (selectedFileCardIndex === null) return;

  const fileCards = game[side].file;
  const cardData = fileCards[selectedFileCardIndex];
  if (!cardData) return;

  game[side].hand.push(cardData.image);
  fileCards.splice(selectedFileCardIndex, 1);

  renderHand(side);
  renderFileArea(side);
}

function partnerActionA(side) {
  partnerTapped[side] = !partnerTapped[side];

  if (side === "self") {
    renderPartnerCard(game.self.partner);
  } else {
    renderOpponentPartnerCard(game.opponent.partner);
  }
}

function partnerActionB(side) {
  const card = game[side].partner;
  if (!card) return;

  game[side].partnerFile = card;
  game[side].partner = "";

  if (side === "self") {
    renderPartnerCard(game.self.partner);
  } else {
    renderOpponentPartnerCard(game.opponent.partner);
  }

  renderPartnerFileCard(side);
}

function partnerActionC(side) {
  const card = game[side].partnerFile;
  if (!card) return;

  game[side].partner = card;
  game[side].partnerFile = "";

  if (side === "self") {
    renderPartnerCard(game.self.partner);
  } else {
    renderOpponentPartnerCard(game.opponent.partner);
  }

  renderPartnerFileCard(side);
}

function showIncidentOverlay(side, type = "A") {
  const targetEl = side === "self" ? incidentCardEl : opponentIncidentCardEl;
  if (!targetEl) return;

  const rect = targetEl.getBoundingClientRect();

  let imagePath = "cards/case.png";
  let offsetX = 0;
  let offsetY = 0;
  let scale = 0.7;

  // ===== 自分側 =====
  if (side === "self") {
    if (type === "A") {
      offsetX = -40;
      offsetY = 90;
    } else if (type === "B") {
      offsetX = -40;
      offsetY = -30;
    } else if (type === "C") {
      imagePath = "cards/closed.png";
      offsetX = -40;
      offsetY = 90;
    } else if (type === "D") {
      imagePath = "cards/closed.png";
      offsetX = -40;
      offsetY = -30;
    }
  }

  // ===== 相手側 =====
  if (side === "opponent") {
    if (type === "A") {
      offsetX = 50;
      offsetY = -20;
    } else if (type === "B") {
      offsetX = 50;
      offsetY = 80;
    } else if (type === "C") {
      imagePath = "cards/closed.png";
      offsetX = 50;
      offsetY = -20;
    } else if (type === "D") {
      imagePath = "cards/closed.png";
      offsetX = 50;
      offsetY = 80;
    }
  }

  const width = rect.width * scale;
  const height = rect.height * scale;
  const left = rect.left + offsetX;
  const top = rect.top + offsetY;

  // ★ここが最大の変更ポイント
  const overlayImage = document.createElement("div");

  overlayImage.className = "incident-floating-image";

  overlayImage.style.position = "fixed";
  overlayImage.style.left = `${left}px`;
  overlayImage.style.top = `${top}px`;
  overlayImage.style.width = `${width}px`;
  overlayImage.style.height = `${height}px`;
  overlayImage.style.backgroundImage = `url("${imagePath}")`;
  overlayImage.style.backgroundSize = "contain";
  overlayImage.style.backgroundPosition = "center";
  overlayImage.style.backgroundRepeat = "no-repeat";

  overlayImage.style.transform =
    side === "self" ? "rotate(90deg)" : "rotate(-90deg)";

  overlayImage.style.zIndex = "30000";
  overlayImage.style.cursor = "pointer";

  // ★クリックで個別削除できるようにする
  overlayImage.onclick = (event) => {
    event.stopPropagation();
    overlayImage.remove();
  };

  document.body.appendChild(overlayImage);
}

function hideIncidentOverlay() {
  document.querySelectorAll(".incident-floating-image").forEach((el) => {
    el.remove();
  });
}

function shuffleDeck(side) {
  if (game[side].deck.length === 0) return;

  game[side].deck = shuffle(game[side].deck);
  updateDeckCount(side);
}
/* =========================
   枚数表示
========================= */

function updateDeckCount(side) {
  const deckCountEl = dom[side].deckCount;
  if (!deckCountEl) return;

  deckCountEl.textContent = `${game[side].deck.length}枚`;
}

/* =========================
   各メニューを閉じる
========================= */

function hideDeckMenu() {
  if (!deckMenuEl) return;
  deckMenuEl.classList.add("hidden");
}

function hideHandMenu() {
  if (!handMenuEl) return;
  handMenuEl.classList.add("hidden");
  selectedHandCardIndex = null;
  selectedHandSide = "self";
}

function hideSceneMenu() {
  if (!sceneMenuEl) return;
  sceneMenuEl.classList.add("hidden");
  selectedSceneCardIndex = null;
  selectedSceneSide = "self";
}

function hidePartnerMenu() {
  if (!partnerMenuEl) return;
  partnerMenuEl.classList.add("hidden");
  selectedPartnerSide = null;
}

function hideRevealMenu() {
  if (!revealMenuEl) return;
  revealMenuEl.classList.add("hidden");
  selectedRevealCardIndex = null;
  selectedRevealSide = "self";
}

function hideFileMenu() {
  if (!fileMenuEl) return;
  fileMenuEl.classList.add("hidden");
  selectedFileCardIndex = null;
  selectedFileSide = "self";
}

function hideEvidenceMenu() {
  if (!evidenceMenuEl) return;
  evidenceMenuEl.classList.add("hidden");
  selectedEvidenceSide = "self";
}

function hideRemoveMenu() {
  if (!removeMenuEl) return;
  removeMenuEl.classList.add("hidden");
  selectedRemoveSide = "self";
}

function hideRemoveCardMenu() {
  if (!removeCardMenuEl) return;
  removeCardMenuEl.classList.add("hidden");
  selectedRemoveCardIndex = null;
}

function hideAllMenus() {
  hideDeckMenu();
  hideHandMenu();
  hideSceneMenu();
  hidePartnerMenu();
  hideRevealMenu();
  hideFileMenu();
  hideEvidenceMenu();
  hideRemoveMenu();
  hideRemoveCardMenu();
  hideEvidenceCardMenu();
  hideEvidenceLayer();
}

/* =========================
   イベント登録
========================= */

if (partnerCardEl) {
  partnerCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.self.partner) return;

    selectedPartnerSide = "self";
    showMenuAt(partnerMenuEl, partnerCardEl.getBoundingClientRect());
  });
}

if (incidentCardEl) {
  incidentCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.self.incident) return;

    selectedIncidentSide = "self";
    showMenuAt(incidentMenuEl, incidentCardEl.getBoundingClientRect());
  });
}

if (opponentIncidentCardEl) {
  opponentIncidentCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.opponent.incident) return;

    selectedIncidentSide = "opponent";
    showMenuAt(incidentMenuEl, opponentIncidentCardEl.getBoundingClientRect());
  });
}

if (partnerFileCardEl) {
  partnerFileCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.self.partnerFile) return;

    selectedPartnerSide = "self";
    showMenuAt(partnerMenuEl, partnerFileCardEl.getBoundingClientRect());
  });
}

if (opponentPartnerFileCardEl) {
  opponentPartnerFileCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.opponent.partnerFile) return;

    selectedPartnerSide = "opponent";
    showMenuAt(partnerMenuEl, opponentPartnerFileCardEl.getBoundingClientRect());
  });
}

if (opponentPartnerCardEl) {
  opponentPartnerCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.opponent.partner) return;

    selectedPartnerSide = "opponent";
    showMenuAt(partnerMenuEl, opponentPartnerCardEl.getBoundingClientRect());
  });
}

if (playerDeckEl) {
  playerDeckEl.addEventListener("click", (event) => {
    event.stopPropagation();

    selectedDeckSide = "self";
    hideAllMenus();

    const rect = playerDeckEl.getBoundingClientRect();
    deckMenuEl.style.left = `${rect.left - 20}px`;
    deckMenuEl.style.top = `${rect.top - 220}px`;
    deckMenuEl.style.transform = "none";
    deckMenuEl.classList.remove("hidden");
  });
}

if (opponentDeckEl) {
  opponentDeckEl.addEventListener("click", (event) => {
    event.stopPropagation();

    selectedDeckSide = "opponent";
    hideAllMenus();
    showMenuAt(deckMenuEl, opponentDeckEl.getBoundingClientRect(), 12, 0);
  });
}

if (fileAreaEl) {
  fileAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.self.file.length === 0) {
      return;
    }

    if (!fileMenuEl.classList.contains("hidden")) {
      hideFileMenu();
      return;
    }

    hideAllMenus();
    selectedFileSide = "self";
    selectedFileCardIndex = game.self.file.length - 1;
    showMenuAt(fileMenuEl, fileAreaEl.getBoundingClientRect());
  });
}

if (opponentFileAreaEl) {
  opponentFileAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.opponent.file.length === 0) {
      return;
    }

    if (!fileMenuEl.classList.contains("hidden")) {
      hideFileMenu();
      return;
    }

    hideAllMenus();
    selectedFileSide = "opponent";
    selectedFileCardIndex = game.opponent.file.length - 1;
    showMenuAt(fileMenuEl, opponentFileAreaEl.getBoundingClientRect());
  });
}

if (dom.self.evidence) {
  dom.self.evidence.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.self.evidence.length === 0) {
      return;
    }

    hideAllMenus();
    selectedEvidenceSide = "self";
    renderEvidenceLayer("self");
  });
}

if (opponentEvidenceAreaEl) {
  opponentEvidenceAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.opponent.evidence.length === 0) {
      return;
    }

    hideAllMenus();
    selectedEvidenceSide = "opponent";
    renderEvidenceLayer("opponent");
  });
}

if (removeAreaEl) {
  removeAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.self.remove.length === 0) {
      return;
    }

    if (!removeMenuEl.classList.contains("hidden")) {
      hideRemoveMenu();
      return;
    }

    hideAllMenus();
    selectedRemoveSide = "self";
    showMenuAt(removeMenuEl, removeAreaEl.getBoundingClientRect());
  });
}

if (opponentRemoveAreaEl) {
  opponentRemoveAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.opponent.remove.length === 0) {
      return;
    }

    if (!removeMenuEl.classList.contains("hidden")) {
      hideRemoveMenu();
      return;
    }

    hideAllMenus();
    selectedRemoveSide = "opponent";
    showMenuAt(removeMenuEl, opponentRemoveAreaEl.getBoundingClientRect());
  });
}

if (removeLayerEl) {
  removeLayerEl.addEventListener("click", () => {
    hideRemoveLayer();
  });
}

if (cardPreviewEl) {
  cardPreviewEl.addEventListener("click", () => {
    hideCardPreview();
  });
}

document.addEventListener("click", () => {
  hideAllMenus();
});

document.addEventListener("keydown", (event) => {
  const isMacUndo = event.metaKey && event.key.toLowerCase() === "z";
  const isWinUndo = event.ctrlKey && event.key.toLowerCase() === "z";

  if (isMacUndo || isWinUndo) {
    event.preventDefault();
    undo();
  }
});

if (undoButtonEl) {
  undoButtonEl.addEventListener("click", () => {
    undo();
  });
}

window.addEventListener("load", fitBoardToViewport);
window.addEventListener("resize", fitBoardToViewport);

/* =========================
   DECKメニュー
========================= */

deckOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();

    if (choice === "手札") {
      if (game[selectedDeckSide].deck.length === 0) {
        hideDeckMenu();
        return;
      }
      saveState();
      drawCardToHand(selectedDeckSide);
      hideDeckMenu();
      return;
    }

    if (choice === "FILE") {
      if (game[selectedDeckSide].deck.length === 0) {
        hideDeckMenu();
        return;
      }
      saveState();
      sendCardToFile(selectedDeckSide);
      hideDeckMenu();
      return;
    }

    if (choice === "証拠") {
      if (game[selectedDeckSide].deck.length === 0) {
        hideDeckMenu();
        return;
      }
      saveState();
      sendCardToEvidence(selectedDeckSide);
      hideDeckMenu();
      return;
    }

    if (choice === "山札をめくる") {
      if (game[selectedDeckSide].deck.length === 0) {
        hideDeckMenu();
        return;
      }
      saveState();
      previewTopDeckCard(selectedDeckSide);
      return;
    }

    if (choice === "山札をシャッフル") {
      if (game[selectedDeckSide].deck.length === 0) {
        hideDeckMenu();
        return;
      }
      saveState();
      shuffleDeck(selectedDeckSide);
      hideDeckMenu();
      return;
    }

    if (choice === "閉じる") {
      hideDeckMenu();
      return;
    }
  });
});

/* =========================
   手札メニュー
========================= */

handOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedHandSide;

    if (selectedHandCardIndex === null) return;

    const card = game[side].hand[selectedHandCardIndex];
    if (!card) return;

    if (choice === "拡大") {
      showCardPreview(card);
      hideHandMenu();
      return;
    }

    if (choice === "現場") {
      const emptySlotIndex = getFirstEmptySceneSlot(side);

      if (emptySlotIndex === -1) {
        alert("現場には5枚までしか出せません。");
        hideHandMenu();
        return;
      }

      saveState();

      game[side].scene[emptySlotIndex] = {
        image: card,
        sleep: false,
        stun: false
      };

      game[side].hand.splice(selectedHandCardIndex, 1);

      renderHand(side);
      renderSceneArea(side);
      hideHandMenu();
      return;
    }

    if (choice === "リムーブ") {
      saveState();

      game[side].remove.push(card);
      game[side].hand.splice(selectedHandCardIndex, 1);

      renderHand(side);
      renderRemoveArea(side);
      hideHandMenu();
      return;
    }

    if (choice === "閉じる") {
      hideHandMenu();
    }
  });
});

/* =========================
   現場メニュー
========================= */

sceneOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedSceneSide;

    if (selectedSceneCardIndex === null) return;

    const card = game[side].scene[selectedSceneCardIndex];
    if (!card) return;

    if (choice === "拡大") {
      showCardPreview(card.image);
      hideSceneMenu();
      return;
    }

    if (choice === "スリープ") {
      saveState();
      card.sleep = !card.sleep;
      renderSceneArea(side);
      return;
    }

    if (choice === "スタン") {
      saveState();
      card.stun = !card.stun;
      renderSceneArea(side);
      return;
    }

    if (choice === "リムーブ") {
      saveState();
      sendSceneCardToRemove(side);
      hideSceneMenu();
      return;
    }

    if (choice === "閉じる") {
      hideSceneMenu();
    }
  });
});

/* =========================
   めくったカードメニュー
========================= */

revealOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedRevealSide;

    if (selectedRevealCardIndex === null) return;

    const card = game[side].revealed[selectedRevealCardIndex];
    if (!card) return;

    if (choice === "拡大") {
      showCardPreview(card);
      hideRevealMenu();
      return;
    }

    if (choice === "手札") {
      saveState();

      game[side].hand.push(card);
      game[side].revealed.splice(selectedRevealCardIndex, 1);

      renderHand(side);
      renderRevealLayer(side);
      hideRevealMenu();
      return;
    }

    if (choice === "山札") {
      saveState();

      game[side].deck.push(card);
      game[side].revealed.splice(selectedRevealCardIndex, 1);

      renderRevealLayer(side);
      updateDeckCount(side);
      hideRevealMenu();
      return;
    }

    if (choice === "閉じる") {
      hideRevealMenu();
    }
  });
});

/* =========================
   FILEメニュー
========================= */

fileOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();

    if (selectedFileCardIndex === null) {
      hideFileMenu();
      return;
    }

    if (choice === "手札") {
      saveState();
      moveTopFileCardToHand(selectedFileSide);
      hideFileMenu();
      return;
    }

    if (choice === "B") {
      hideFileMenu();
    }
  });
});

/* =========================
   証拠メニュー
========================= */

evidenceOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    hideEvidenceMenu();
  });
});

evidenceCardOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedEvidenceSide;

    if (selectedEvidenceCardIndex === null) return;

    const cardData = game[side].evidence[selectedEvidenceCardIndex];
    if (!cardData) return;

    if (choice === "拡大") {
      showCardPreview(cardData.image);
      hideEvidenceCardMenu();
      return;
    }

    if (choice === "表向き/裏向き") {
      saveState();
      cardData.faceUp = !cardData.faceUp;
      renderEvidenceArea(side);
      renderEvidenceLayer(side);
      hideEvidenceCardMenu();
      return;
    }

    if (choice === "リムーブ") {
      saveState();

      game[side].remove.push(cardData.image);
      game[side].evidence.splice(selectedEvidenceCardIndex, 1);

      renumberEvidence(side);

      renderEvidenceArea(side);
      renderRemoveArea(side);

      if (game[side].evidence.length === 0) {
        hideEvidenceLayer();
      } else {
        renderEvidenceLayer(side);
      }

      hideEvidenceCardMenu();
      return;
    }

    if (choice === "閉じる") {
      hideEvidenceCardMenu();
    }
  });
});

if (evidenceLayerEl) {
  evidenceLayerEl.addEventListener("click", () => {
    hideEvidenceLayer();
    hideEvidenceCardMenu();
  });
}

/* =========================
   リムーブメニュー
========================= */

removeOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedRemoveSide;

    if (choice === "一覧") {
      renderRemoveLayer(side);
      hideRemoveMenu();
      return;
    }

    if (choice === "山札") {
      if (game[side].remove.length === 0) return;

      saveState();

      const shuffledRemoveCards = shuffle(game[side].remove);
      game[side].deck.push(...shuffledRemoveCards);
      game[side].remove = [];

      renderRemoveArea(side);
      updateDeckCount(side);
      hideRemoveLayer();
      hideRemoveMenu();
      return;
    }

    if (choice === "閉じる") {
      hideRemoveMenu();
    }
  });
});

/* =========================
   リムーブ一覧カードメニュー
========================= */

removeCardOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedRemoveSide;

    if (selectedRemoveCardIndex === null) return;

    const card = game[side].remove[selectedRemoveCardIndex];
    if (!card) return;

    if (choice === "拡大") {
      showCardPreview(card);
      hideRemoveCardMenu();
      return;
    }

    if (choice === "手札") {
      saveState();

      game[side].hand.push(card);
      game[side].remove.splice(selectedRemoveCardIndex, 1);

      renderHand(side);
      renderRemoveArea(side);
      renderRemoveLayer(side);
      hideRemoveCardMenu();
      return;
    }

    if (choice === "山札" || choice === "C") {
      saveState();

      game[side].deck.push(card);
      game[side].remove.splice(selectedRemoveCardIndex, 1);

      renderRemoveArea(side);
      renderRemoveLayer(side);
      updateDeckCount(side);
      hideRemoveCardMenu();
    }
  });
});

/* =========================
   パートナーメニュー
========================= */

partnerOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const type = button.dataset.type;
    if (!selectedPartnerSide) return;

    if (type === "A") {
      saveState();
      partnerActionA(selectedPartnerSide);
      hidePartnerMenu();
      return;
    }

    if (type === "B") {
      saveState();
      partnerActionB(selectedPartnerSide);
      hidePartnerMenu();
      return;
    }

    if (type === "C") {
      saveState();
      partnerActionC(selectedPartnerSide);
      hidePartnerMenu();
      return;
    }
  });
});

/* =========================
   事件メニュー
========================= */

incidentOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const label = button.textContent.trim();
    const type = button.dataset.type;

    if (!selectedIncidentSide) return;

    const card =
      selectedIncidentSide === "self"
        ? game.self.incident
        : game.opponent.incident;

    if (label === "拡大") {
      showCardPreview(card);
      incidentMenuEl.classList.add("hidden");
      return;
    }

    if (type === "A") {
      incidentMenuEl.classList.add("hidden");
      showIncidentOverlay(selectedIncidentSide, "A");
      return;
    }

    if (type === "B") {
      incidentMenuEl.classList.add("hidden");
      showIncidentOverlay(selectedIncidentSide, "B");
      return;
    }

    if (type === "C") {
      incidentMenuEl.classList.add("hidden");
      showIncidentOverlay(selectedIncidentSide, "C");
      return;
    }

    if (type === "D") {
      incidentMenuEl.classList.add("hidden");
      showIncidentOverlay(selectedIncidentSide, "D");
      return;
    }

    if (label === "閉じる") {
      incidentMenuEl.classList.add("hidden");
    }
  });
});

if (incidentOverlayImageEl) {
  incidentOverlayImageEl.addEventListener("click", (event) => {
    event.stopPropagation();
    alert("case.png がクリックされました");
  });
}

if (incidentOverlayEl) {
  incidentOverlayEl.addEventListener("click", (event) => {
    if (event.target === incidentOverlayEl) {
      hideIncidentOverlay();
    }
  });
}

/* =========================
   初期化
========================= */

function setupGame() {
  game.self.deck = shuffle(buildDeck(playerDeckRecipe));
  game.opponent.deck = shuffle(buildDeck(opponentDeckRecipe));

  drawStartingHand("self", 5);
  drawStartingHand("opponent", 5);

  game.self.incident = "cards_i/0930_h.png";
  game.opponent.incident = "cards_i/1051.png";

  game.self.partner = "cards_p/P008.png";
  game.opponent.partner = "cards_p/P004.png";

  renderAll();
  fitBoardToViewport();
}

setupGame();