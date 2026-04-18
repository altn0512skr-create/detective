/* ========================================
   要素取得
   HTML上の各エリア・メニュー・レイヤーをまとめて取得
======================================== */

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
const opponentFileAreaEl = document.getElementById("opponent-file-area");

const removeAreaEl = document.getElementById("remove-area");
const opponentRemoveAreaEl = document.getElementById("opponent-remove-area");

const opponentEvidenceAreaEl = document.getElementById("opponent-evidence-area");

const mysteryAreaEl = document.getElementById("mystery-area");
const opponentMysteryAreaEl = document.getElementById("opponent-mystery-area");

const partnerFileCardEl = document.getElementById("partner-file-card");
const opponentPartnerFileCardEl = document.getElementById("opponent-partner-file-card");

const selfPartnerZoneEl = document.querySelector(".self-partner-zone");
const opponentPartnerZoneEl = document.querySelector(".opponent-partner-zone");

const deckMenuEl = document.getElementById("deck-menu");
const deckOptions = document.querySelectorAll(".deck-option");

const deckToSceneMenuEl = document.getElementById("deck-to-scene-menu");
const deckToSceneOptions = document.querySelectorAll(".deck-to-scene-option");

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

const evidenceLayerEl = document.getElementById("evidence-layer");
const evidenceLayerCardsEl = document.getElementById("evidence-layer-cards");
const evidenceCardMenuEl = document.getElementById("evidence-card-menu");
const evidenceCardOptions = document.querySelectorAll(".evidence-card-option");

const removeMenuEl = document.getElementById("remove-menu");
const removeOptions = document.querySelectorAll(".remove-option");

const removeLayerEl = document.getElementById("remove-layer");
const removeLayerCardsEl = document.getElementById("remove-layer-cards");

const removeCardMenuEl = document.getElementById("remove-card-menu");
const removeCardOptions = document.querySelectorAll(".remove-card-option");

const removeToSceneMenuEl = document.getElementById("remove-to-scene-menu");
const removeToSceneOptions = document.querySelectorAll(".remove-to-scene-option");

const partnerMenuEl = document.getElementById("partner-menu");
const partnerOptions = document.querySelectorAll(".partner-option");

const partnerStackLayerEl = document.getElementById("partner-stack-layer");
const partnerStackLayerCardsEl = document.getElementById("partner-stack-layer-cards");
const partnerStackCardMenuEl = document.getElementById("partner-stack-card-menu");
const partnerStackCardOptions = document.querySelectorAll(".partner-stack-card-option");

const sceneStackLayerEl = document.getElementById("scene-stack-layer");
const sceneStackLayerCardsEl = document.getElementById("scene-stack-layer-cards");
const sceneStackCardMenuEl = document.getElementById("scene-stack-card-menu");
const sceneStackCardOptions = document.querySelectorAll(".scene-stack-card-option");

const incidentMenuEl = document.getElementById("incident-menu");
const incidentOptions = document.querySelectorAll(".incident-option");

const incidentOverlayEl = document.getElementById("incident-overlay");
const incidentOverlayImageEl = document.getElementById("incident-overlay-image");

const cardPreviewEl = document.getElementById("card-preview");
const cardPreviewImageEl = document.getElementById("card-preview-image");

const revealLayerEl = document.getElementById("reveal-layer");
const revealLayerCardsEl = document.getElementById("reveal-layer-cards");

const undoButtonEl = document.getElementById("undo-button");

const revealToSceneMenuEl = document.getElementById("reveal-to-scene-menu");
const revealToSceneOptions = document.querySelectorAll(".reveal-to-scene-option");

/* ========================================
   ゲームデータ
   各サイドの山札・手札・現場などの状態を保持
======================================== */

function createEmptySideState() {
  return {
    deck: [],
    hand: [],
    file: [],
    evidence: [],
    remove: [],
    revealed: [],
    scene: [[], [], [], [], []],
    incident: "",
    partner: [],
    partnerFile: "",
    mystery: "",
    incidentOverlays: []
  };
}

const game = {
  self: createEmptySideState(),
  opponent: createEmptySideState()
};

/* ========================================
   選択状態
   どのカード・どのサイドを選択中かを保持
======================================== */

let selectedHandCardIndex = null;
let selectedHandSide = "self";

let selectedSceneCardIndex = null;
let selectedSceneSide = "self";

let selectedRevealCardIndex = null;
let selectedRevealSide = "self";

let selectedRemoveCardIndex = null;
let selectedRemoveSide = "self";

let selectedFileCardIndex = null;
let selectedFileSide = "self";

let selectedDeckSide = "self";
let selectedPartnerSide = null;
let selectedEvidenceSide = "self";
let selectedEvidenceCardIndex = null;
let selectedIncidentSide = null;

let selectedSceneStackSide = "self";
let selectedSceneStackIndex = null;
let selectedSceneStackHiddenIndex = null;

let selectedPartnerStackSide = "self";
let selectedPartnerStackIndex = null;

let previewOpened = false;

const partnerTapped = {
  self: false,
  opponent: false
};

const historyStack = [];

/* ========================================
   共通ユーティリティ
======================================== */

/* 横向きカード判定 */
function isHorizontalCard(imagePath) {
  return typeof imagePath === "string" && imagePath.includes("_h");
}

/* メニューを対象要素の近くに表示 */
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

/* レシピから山札配列を作る */
function buildDeck(recipe) {
  const deck = [];

  for (const card of recipe) {
    for (let i = 0; i < card.count; i++) {
      deck.push(card.image);
    }
  }

  return deck;
}

/* 配列シャッフル */
function shuffle(array) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

/* 山札の上から1枚引く */
function drawCard(deck) {
  return deck.shift();
}

/* 初期手札を配る */
function drawStartingHand(side, count = 5) {
  game[side].hand = [];

  for (let i = 0; i < count; i++) {
    const card = drawCard(game[side].deck);
    if (card) {
      game[side].hand.push(card);
    }
  }
}

/* 空いている現場スロットの先頭を返す */
function getFirstEmptySceneSlot(side) {
  return game[side].scene.findIndex((slot) => slot.length === 0);
}


/* ========================================
   盤面縮尺
   画面サイズに合わせてボードを縮小表示
======================================== */

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


/* ========================================
   描画：事件・パートナー
======================================== */

function renderIncidentCard(imagePath) {
  if (!incidentCardEl) return;

  incidentCardEl.classList.remove("card-vertical", "card-horizontal");
  incidentCardEl.onclick = null;
  incidentCardEl.onpointerup = null;

  if (!imagePath) {
    incidentCardEl.style.backgroundImage = "none";
    return;
  }

  incidentCardEl.style.backgroundImage = `url("${imagePath}")`;

  if (isHorizontalCard(imagePath)) {
    incidentCardEl.classList.add("card-horizontal");
  } else {
    incidentCardEl.classList.add("card-vertical");
  }

  incidentCardEl.onpointerup = (event) => {
    event.stopPropagation();

    if (previewOpened) {
      hideCardPreview();
    } else {
      showCardPreview(imagePath);
    }
  };
}

function renderOpponentIncidentCard(imagePath) {
  if (!opponentIncidentCardEl) return;

  opponentIncidentCardEl.classList.remove("card-vertical", "card-horizontal");
  opponentIncidentCardEl.onclick = null;
  opponentIncidentCardEl.onpointerup = null;

  if (!imagePath) {
    opponentIncidentCardEl.style.backgroundImage = "none";
    return;
  }

  opponentIncidentCardEl.style.backgroundImage = `url("${imagePath}")`;

  if (isHorizontalCard(imagePath)) {
    opponentIncidentCardEl.classList.add("card-horizontal");
  } else {
    opponentIncidentCardEl.classList.add("card-vertical");
  }

  opponentIncidentCardEl.onpointerup = (event) => {
    event.stopPropagation();

    if (previewOpened) {
      hideCardPreview();
    } else {
      showCardPreview(imagePath);
    }
  };
}

function renderPartnerCard(side) {
  const targetEl = side === "self" ? partnerCardEl : opponentPartnerCardEl;
  if (!targetEl) return;

  const stack = Array.isArray(game[side].partner) ? game[side].partner : [];
  const topCard = stack[0];

  targetEl.innerHTML = "";
  targetEl.className = "partner-card";
  targetEl.style.backgroundImage = "none";
  targetEl.style.transform = "none";
  targetEl.style.transformOrigin = "center center";

  if (!topCard) return;

  const underCards = stack.slice(1, 4);

  underCards.forEach((imagePath, idx) => {
    const underEl = document.createElement("div");
    underEl.className = `partner-under layer-${idx + 1} ${side === "self" ? "self-under" : "opponent-under"}`;
    underEl.style.backgroundImage = `url("${imagePath}")`;
    targetEl.appendChild(underEl);
  });

    const mainEl = document.createElement("div");
  mainEl.className = "partner-main";
  mainEl.style.backgroundImage = `url("${topCard}")`;

  if (isHorizontalCard(topCard)) {
    mainEl.classList.add("partner-horizontal");
  } else {
    mainEl.classList.add("partner-vertical");
  }

  if (side === "self") {
    mainEl.style.transform = partnerTapped.self ? "rotate(180deg)" : "rotate(90deg)";
  } else {
    mainEl.style.transform = partnerTapped.opponent ? "rotate(0deg)" : "rotate(-90deg)";
  }

  mainEl.style.transformOrigin = "center center";

  mainEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginPartnerDrag(mainEl, side, event);
  });

  targetEl.appendChild(mainEl);
  if (stack.length >= 2) {
    const countEl = document.createElement("div");
    countEl.className = "partner-stack-count";
    countEl.textContent = stack.length - 1;
    targetEl.appendChild(countEl);
  }
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

function hideCardPreview() {
  if (!cardPreviewEl) return;

  cardPreviewEl.classList.add("hidden");
  cardPreviewImageEl.classList.remove("preview-vertical", "preview-horizontal");
  previewOpened = false;

  if (selectedRevealSide && game[selectedRevealSide].revealed.length > 0) {
    renderRevealLayer(selectedRevealSide);
  }
}

/* ========================================
   描画：手札・FILE・証拠・リムーブ・現場
======================================== */

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

      if (dragJustEnded) {
        dragJustEnded = false;
        return;
      }

      if (!handMenuEl.classList.contains("hidden")) {
        hideHandMenu();
        return;
      }

      hideAllMenus();
      selectedHandSide = side;
      selectedHandCardIndex = index;
      showMenuAt(handMenuEl, cardEl.getBoundingClientRect());
    });

    cardEl.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();
      beginHandDrag(cardEl, index, side, event);
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

  if (cardData.type === "partner") {
    cardEl.style.backgroundImage = `url("${cardData.image}")`;
  } else {
    cardEl.style.backgroundImage = cardData.faceUp
      ? `url("${cardData.image}")`
      : `url("cards/back.png")`;
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


function renumberEvidence(side) {
  game[side].evidence.forEach((cardData, index) => {
    cardData.number = index + 1;
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
    slotEl.classList.remove("has-card");

    const stack = game[side].scene[index];
    if (!stack || stack.length === 0) return;

    slotEl.classList.add("has-card");

    const visibleCard = stack[0];
    const underCards = stack.slice(1, 4); // 最大3枚まで見せる

    const stackWrapEl = document.createElement("div");
    stackWrapEl.className = "scene-card-stack";

    // 下のカードを先に描画
    underCards.forEach((cardData, underIndex) => {
  const underEl = document.createElement("div");
  underEl.className = `scene-card-under layer-${underIndex + 1} ${
    side === "self" ? "self-under" : "opponent-under"
  }`;

  underEl.style.backgroundImage = cardData.faceDown
    ? 'url("cards/back.png")'
    : `url("${cardData.image}")`;

  stackWrapEl.appendChild(underEl);
});

    // 表のカード
    const cardEl = document.createElement("div");
    cardEl.className = "scene-card";
    cardEl.style.backgroundImage = `url("${visibleCard.image}")`;

    if (visibleCard.sleep) cardEl.classList.add("card-sleep");
    if (visibleCard.stun) cardEl.classList.add("card-stun");

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();

      if (dragJustEnded) {
        dragJustEnded = false;
        return;
      }

      hideAllMenus();
      clearSceneSelection();

      cardEl.classList.add("selected");

      selectedSceneCardIndex = index;
      selectedSceneSide = side;
      showMenuAt(sceneMenuEl, cardEl.getBoundingClientRect());
    });

    cardEl.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();
      beginSceneDrag(cardEl, index, side, event);
    });

    stackWrapEl.appendChild(cardEl);
    slotEl.appendChild(stackWrapEl);

    if (stack.length >= 2) {
      const stackCountEl = document.createElement("div");
      stackCountEl.className = "scene-stack-count";
      stackCountEl.textContent = stack.length - 1;
      slotEl.appendChild(stackCountEl);
    }
  });
}

function renderMysteryArea(side) {
  const targetEl = side === "self" ? mysteryAreaEl : opponentMysteryAreaEl;
  if (!targetEl) return;

  if (!game[side].mystery) {
    targetEl.style.backgroundImage = "none";
    return;
  }

  targetEl.style.backgroundImage = `url("${game[side].mystery}")`;
}

function clearSceneSelection() {
  document.querySelectorAll(".scene-card.selected").forEach((el) => {
    el.classList.remove("selected");
  });
}
/* ========================================
   描画：各種レイヤー
======================================== */

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

  if (selectedRevealSide && game[selectedRevealSide].revealed.length > 0) {
    renderRevealLayer(selectedRevealSide);
  }
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

function hideRemoveLayer() {
  if (!removeLayerEl) return;
  removeLayerEl.classList.add("hidden");
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

function renderSceneStackLayer(side, sceneIndex) {
  if (!sceneStackLayerEl || !sceneStackLayerCardsEl) return;

  const stack = game[side].scene[sceneIndex];
  if (!stack || stack.length <= 1) {
    sceneStackLayerCardsEl.innerHTML = "";
    sceneStackLayerEl.classList.add("hidden");
    return;
  }

  const hiddenCards = stack.slice(1);
  sceneStackLayerCardsEl.innerHTML = "";

  hiddenCards.forEach((card, hiddenIndex) => {
    const cardEl = document.createElement("div");
    cardEl.className = "scene-stack-list-card";
    cardEl.style.backgroundImage = `url("${card.image}")`;

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      hideSceneStackCardMenu();
      selectedSceneStackSide = side;
      selectedSceneStackIndex = sceneIndex;
      selectedSceneStackHiddenIndex = hiddenIndex + 1;
      showMenuAt(sceneStackCardMenuEl, cardEl.getBoundingClientRect());
    });

    sceneStackLayerCardsEl.appendChild(cardEl);
  });

  sceneStackLayerEl.classList.remove("hidden");
}

function hideSceneStackLayer() {
  if (!sceneStackLayerEl) return;
  sceneStackLayerEl.classList.add("hidden");
}

function renderPartnerStackLayer(side) {
  if (!partnerStackLayerEl || !partnerStackLayerCardsEl) return;

  const stack = game[side].partner;
  if (!Array.isArray(stack) || stack.length <= 1) {
    partnerStackLayerCardsEl.innerHTML = "";
    partnerStackLayerEl.classList.add("hidden");
    return;
  }

  const hiddenCards = stack.slice(1);
  partnerStackLayerCardsEl.innerHTML = "";

  hiddenCards.forEach((imagePath, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "scene-stack-list-card";
    cardEl.style.backgroundImage = `url("${imagePath}")`;

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedPartnerStackSide = side;
      selectedPartnerStackIndex = index + 1;
      showMenuAt(partnerStackCardMenuEl, cardEl.getBoundingClientRect());
    });

    partnerStackLayerCardsEl.appendChild(cardEl);
  });

  partnerStackLayerEl.classList.remove("hidden");
}

function hidePartnerStackLayer() {
  if (!partnerStackLayerEl) return;
  partnerStackLayerEl.classList.add("hidden");
}

function hidePartnerStackCardMenu() {
  if (!partnerStackCardMenuEl) return;
  partnerStackCardMenuEl.classList.add("hidden");
  selectedPartnerStackIndex = null;
}


/* ========================================
   盤面全体再描画
======================================== */

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

  renderPartnerCard("self");
  renderPartnerCard("opponent");

  renderPartnerFileCard("self");
  renderPartnerFileCard("opponent");

  renderMysteryArea("self");
  renderMysteryArea("opponent");

  updateDeckCount("self");
  updateDeckCount("opponent");

  renderRevealLayer("self");
  renderIncidentOverlays();
}


/* ========================================
   Undo
======================================== */

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
  hideEvidenceCardMenu();
  hideEvidenceLayer();

  renderAll();
}


/* ========================================
   基本操作：山札
======================================== */

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
  type: "normal",
  faceUp: false
});

  renderFileArea(side);
  updateDeckCount(side);
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

function sendCardToRemove(side) {
  if (game[side].deck.length === 0) return;

  const card = game[side].deck.shift();
  game[side].remove.push(card);

  renderRemoveArea(side);
  updateDeckCount(side);
}

function previewTopDeckCard(side) {
  if (game[side].deck.length === 0) return;

  const card = game[side].deck.shift();
  game[side].revealed.push(card);

  renderRevealLayer(side);
  updateDeckCount(side);
}

function moveRevealedCardToScene(side, revealIndex, sceneIndex) {
  const card = game[side].revealed[revealIndex];
  if (!card) return false;

  const targetStack = game[side].scene[sceneIndex];
  if (!targetStack) return false;

  if (targetStack.length === 0) {
    targetStack.push({
      image: card,
      sleep: false,
      stun: false
    });
  } else {
    targetStack.push({
      image: card,
      sleep: false,
      stun: false
    });
  }

  game[side].revealed.splice(revealIndex, 1);

  renderRevealLayer(side);
  renderSceneArea(side);

  return true;
}

function shuffleDeck(side) {
  if (game[side].deck.length === 0) return;

  game[side].deck = shuffle(game[side].deck);
  updateDeckCount(side);
}

function sendDeckCardToSceneUnder(side, sceneIndex) {
  if (game[side].deck.length === 0) return false;

  const targetStack = game[side].scene[sceneIndex];
  if (!targetStack || targetStack.length === 0) {
    alert("その現場には表のカードがありません。");
    return false;
  }

  const card = game[side].deck.shift();

  targetStack.push({
    image: card,
    sleep: false,
    stun: false,
    faceDown: true
  });

  renderSceneArea(side);
  updateDeckCount(side);

  return true;
}


/* ========================================
   基本操作：現場
======================================== */

function sendSceneCardToRemove(side) {
  if (selectedSceneCardIndex === null) return;

  const stack = game[side].scene[selectedSceneCardIndex];
  if (!stack || stack.length === 0) return;

  const visibleCard = stack[0];
  const hiddenCards = stack.slice(1);

  game[side].remove.push(visibleCard.image);

  hiddenCards.forEach((card) => {
    game[side].remove.push(card.image);
  });

  game[side].scene[selectedSceneCardIndex] = [];

  renderSceneArea(side);
  renderRemoveArea(side);
}

function sendSceneCardToDeckBottom(side) {
  if (selectedSceneCardIndex === null) return;

  const stack = game[side].scene[selectedSceneCardIndex];
  if (!stack || stack.length === 0) return;

  const visibleCard = stack[0];
  const hiddenCards = stack.slice(1);

  game[side].deck.push(visibleCard.image);

  hiddenCards.forEach((card) => {
    game[side].remove.push(card.image);
  });

  game[side].scene[selectedSceneCardIndex] = [];

  renderSceneArea(side);
  renderRemoveArea(side);
  updateDeckCount(side);
}


/* ========================================
   基本操作：FILE / リムーブ / パートナー
======================================== */

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

function moveRemoveCardToSceneUnder(side, removeIndex, sceneIndex) {
  const removeCard = game[side].remove[removeIndex];
  if (!removeCard) return false;

  const targetStack = game[side].scene[sceneIndex];
  if (!targetStack) return false;

  if (targetStack.length === 0) {
    // 現場が空なら、そのカードを表のカードとして登場させる
    targetStack.push({
      image: removeCard,
      sleep: false,
      stun: false
    });
  } else {
    // すでにカードがあるなら、その下に重ねる
    targetStack.push({
      image: removeCard,
      sleep: false,
      stun: false
    });
  }

  game[side].remove.splice(removeIndex, 1);

  renderSceneArea(side);
  renderRemoveArea(side);
  renderRemoveLayer(side);

  return true;
}
function partnerActionA(side) {
  if (!Array.isArray(game[side].partner) || game[side].partner.length === 0) return;

  partnerTapped[side] = !partnerTapped[side];
  renderPartnerCard(side);
}

function partnerActionB(side) {
  if (!Array.isArray(game[side].partner) || game[side].partner.length === 0) return;

  saveState();

const card = game[side].partner.shift();
if (!card) return false;

game[side].partnerFile = card;

  renderPartnerCard(side);
  renderPartnerFileCard(side);
}

function partnerActionC(side) {
  const card = game[side].partnerFile;
  if (!card) return;

  if (!Array.isArray(game[side].partner)) {
    game[side].partner = [];
  }

  game[side].partner.unshift(card);
  game[side].partnerFile = "";

  renderPartnerCard(side);
  renderPartnerFileCard(side);
}

function moveHandCardToPartner(side, handIndex) {
  if (handIndex === null || handIndex === undefined) return false;

  const card = game[side].hand[handIndex];
  if (!card) return false;

  game[side].partner.push(card);
  game[side].hand.splice(handIndex, 1);
  partnerTapped[side] = false;

  renderHand(side);
  renderPartnerCard(side);

  return true;
}


/* ========================================
   事件オーバーレイ操作
======================================== */

function showIncidentOverlay(side, type = "A") {
  if (!game[side].incidentOverlays) {
    game[side].incidentOverlays = [];
  }

  game[side].incidentOverlays.push(type);
  renderIncidentOverlays();
}

function renderIncidentOverlays() {
  document.querySelectorAll(".incident-floating-image").forEach((el) => {
    el.remove();
  });

  ["self", "opponent"].forEach((side) => {
    const targetEl = side === "self" ? incidentCardEl : opponentIncidentCardEl;
    if (!targetEl) return;

    const overlays = game[side].incidentOverlays || [];
    const rect = targetEl.getBoundingClientRect();

    overlays.forEach((type) => {
      let imagePath = "cards/case.png";
      let offsetX = 0;
      let offsetY = 0;
      let scale = 0.5;

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

      const overlayImage = document.createElement("div");
      overlayImage.className = "incident-floating-image";
      overlayImage.dataset.side = side;
      overlayImage.dataset.type = type;

      overlayImage.style.position = "fixed";
      overlayImage.style.left = `${left}px`;
      overlayImage.style.top = `${top}px`;
      overlayImage.style.width = `${width}px`;
      overlayImage.style.height = `${height}px`;
      overlayImage.style.backgroundImage = `url("${imagePath}")`;
      overlayImage.style.backgroundSize = "contain";
      overlayImage.style.backgroundPosition = "center";
      overlayImage.style.backgroundRepeat = "no-repeat";
      overlayImage.style.transform = side === "self" ? "rotate(90deg)" : "rotate(-90deg)";
      overlayImage.style.zIndex = "30000";
      overlayImage.style.cursor = "pointer";

      overlayImage.addEventListener("click", (event) => {
        event.stopPropagation();

        const list = game[side].incidentOverlays || [];
        const index = list.indexOf(type);
        if (index !== -1) {
          list.splice(index, 1);
        }

        renderIncidentOverlays();
      });

      document.body.appendChild(overlayImage);
    });
  });
}

function hideIncidentOverlay() {
  game.self.incidentOverlays = [];
  game.opponent.incidentOverlays = [];

  document.querySelectorAll(".incident-floating-image").forEach((el) => {
    el.remove();
  });
}


/* ========================================
   枚数表示
======================================== */

function updateDeckCount(side) {
  const deckCountEl = dom[side].deckCount;
  const deckCardEl = dom[side].deckCard;

  if (!deckCountEl || !deckCardEl) return;

  const deckLength = game[side].deck.length;
  deckCountEl.textContent = `${deckLength}枚`;

  if (deckLength === 0) {
    deckCardEl.style.backgroundImage = "none";
    deckCardEl.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
    deckCardEl.style.border = "2px dashed rgba(255, 255, 255, 0.35)";
    deckCardEl.style.boxShadow = "none";
  } else {
    deckCardEl.style.backgroundImage = 'url("cards/back.png")';
    deckCardEl.style.backgroundColor = "";
    deckCardEl.style.border = "";
    deckCardEl.style.boxShadow = "";
  }
}


/* ========================================
   各メニューを閉じる
======================================== */

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

function hideRemoveToSceneMenu() {
  if (!removeToSceneMenuEl) return;
  removeToSceneMenuEl.classList.add("hidden");
}

function hideRevealToSceneMenu() {
  if (!revealToSceneMenuEl) return;
  revealToSceneMenuEl.classList.add("hidden");
}

function hideSceneStackCardMenu() {
  if (!sceneStackCardMenuEl) return;
  sceneStackCardMenuEl.classList.add("hidden");
  selectedSceneStackIndex = null;
  selectedSceneStackHiddenIndex = null;
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
  hideSceneStackLayer();
  hideSceneStackCardMenu();
  hidePartnerStackLayer();
  hidePartnerStackCardMenu();
  hideRemoveToSceneMenu();
  hideRevealToSceneMenu();

  if (deckToSceneMenuEl) {
    deckToSceneMenuEl.classList.add("hidden");
  }
}


/* ========================================
   イベント登録：基本エリア
======================================== */

if (partnerCardEl) {
  partnerCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.self.partner.length) return;

    selectedPartnerSide = "self";
    showMenuAt(partnerMenuEl, partnerCardEl.getBoundingClientRect());
  });
}

if (opponentPartnerCardEl) {
  opponentPartnerCardEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideAllMenus();

    if (!game.opponent.partner.length) return;

    selectedPartnerSide = "opponent";
    showMenuAt(partnerMenuEl, opponentPartnerCardEl.getBoundingClientRect());
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

if (playerDeckEl) {
  playerDeckEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (dragJustEnded) {
      dragJustEnded = false;
      return;
    }

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

    if (dragJustEnded) {
      dragJustEnded = false;
      return;
    }

    selectedDeckSide = "opponent";
    hideAllMenus();
    showMenuAt(deckMenuEl, opponentDeckEl.getBoundingClientRect(), 12, 0);
  });
}

if (playerDeckEl) {
  playerDeckEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginDeckDrag(playerDeckEl, "self", event);
  });
}

if (opponentDeckEl) {
  opponentDeckEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginDeckDrag(opponentDeckEl, "opponent", event);
  });
}

if (fileAreaEl) {
  fileAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.self.file.length === 0) return;

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

    if (game.opponent.file.length === 0) return;

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

if (fileAreaEl) {
  fileAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginFileDrag("self", event);
  });
}

if (opponentFileAreaEl) {
  opponentFileAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginFileDrag("opponent", event);
  });
}

if (dom.self.evidence) {
  dom.self.evidence.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.self.evidence.length === 0) return;

    hideAllMenus();
    selectedEvidenceSide = "self";
    renderEvidenceLayer("self");
  });
}

if (opponentEvidenceAreaEl) {
  opponentEvidenceAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.opponent.evidence.length === 0) return;

    hideAllMenus();
    selectedEvidenceSide = "opponent";
    renderEvidenceLayer("opponent");
  });
}

if (removeAreaEl) {
  removeAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (game.self.remove.length === 0) return;

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

    if (game.opponent.remove.length === 0) return;

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
  cardPreviewEl.addEventListener("click", (event) => {
    event.stopPropagation();
    hideCardPreview();
  });
}

if (evidenceLayerEl) {
  evidenceLayerEl.addEventListener("click", () => {
    hideEvidenceLayer();
    hideEvidenceCardMenu();
  });
}

if (sceneStackLayerEl) {
  sceneStackLayerEl.addEventListener("click", (event) => {
    if (event.target === sceneStackLayerEl || event.target.classList.contains("scene-stack-layer-bg")) {
      hideSceneStackLayer();
      hideSceneStackCardMenu();
    }
  });
}

if (partnerStackLayerEl) {
  partnerStackLayerEl.addEventListener("click", (event) => {
    if (event.target === partnerStackLayerEl || event.target.classList.contains("scene-stack-layer-bg")) {
      hidePartnerStackLayer();
      hidePartnerStackCardMenu();
    }
  });
}

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

document.addEventListener("click", (event) => {
  if (event.target.closest(".menu") || event.target.closest(".reveal-layer")) {
    return;
  }

  hideAllMenus();
  clearSceneSelection();
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

if (revealLayerEl) {
  revealLayerEl.addEventListener("click", (event) => {
    if (previewOpened) return;

    if (event.target.classList.contains("reveal-layer-bg")) {
      hideRevealMenu();
      hideRevealToSceneMenu();
      hideRevealLayer();
    }
  });
}

if (mysteryAreaEl) {
  mysteryAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!game.self.mystery) return;

    hideAllMenus();
    showCardPreview(game.self.mystery);
  });
}

if (opponentMysteryAreaEl) {
  opponentMysteryAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!game.opponent.mystery) return;

    hideAllMenus();
    showCardPreview(game.opponent.mystery);
  });
}

if (mysteryAreaEl) {
  mysteryAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!game.self.mystery) return;

    hideAllMenus();
    showCardPreview(game.self.mystery);
  });

  mysteryAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginMysteryDrag("self", event);
  });
}

if (opponentMysteryAreaEl) {
  opponentMysteryAreaEl.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!game.opponent.mystery) return;

    hideAllMenus();
    showCardPreview(game.opponent.mystery);
  });

  opponentMysteryAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginMysteryDrag("opponent", event);
  });
}

if (fileAreaEl) {
  fileAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginFileDrag("self", event);
  });
}

if (opponentFileAreaEl) {
  opponentFileAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginFileDrag("opponent", event);
  });
}

if (dom.self.evidence) {
  dom.self.evidence.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginEvidenceDrag("self", event);
  });
}

if (opponentEvidenceAreaEl) {
  opponentEvidenceAreaEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    beginEvidenceDrag("opponent", event);
  });
}

document.addEventListener("click", () => {
  if (previewOpened) {
    hideCardPreview();
  }
});

/* ========================================
   DECKメニュー
======================================== */

deckOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const choice = button.textContent.trim();


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
    }
  });
});

deckToSceneOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const slot = Number(button.dataset.slot);
    const side = selectedDeckSide;

    if (slot === -1) {
      deckToSceneMenuEl.classList.add("hidden");
      return;
    }

    saveState();

    const moved = sendDeckCardToSceneUnder(side, slot);
    if (moved) {
      deckToSceneMenuEl.classList.add("hidden");
      hideDeckMenu();
    }
  });
});


/* ========================================
   手札メニュー
======================================== */

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

    if (choice === "閉じる") {
      hideHandMenu();
    }
  });
});

/* ========================================
   現場メニュー
======================================== */

sceneOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedSceneSide;

    if (selectedSceneCardIndex === null) return;

    const stack = game[side].scene[selectedSceneCardIndex];
    if (!stack || stack.length === 0) return;

    const card = stack[0];
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

    if (choice === "一覧") {
      renderSceneStackLayer(side, selectedSceneCardIndex);
      hideSceneMenu();
      return;
    }

    if (choice === "閉じる") {
      hideSceneMenu();
    }
  });
});


/* ========================================
   めくったカードメニュー
======================================== */

revealOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedRevealSide;

    if (selectedRevealCardIndex === null) return;

    const card = game[side].revealed[selectedRevealCardIndex];
    if (!card) return;

    if (choice === "拡大") {
  hideRevealMenu();
  hideRevealLayer();
  showCardPreview(card);
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

        if (choice === "現場") {
      showMenuAt(revealToSceneMenuEl, revealMenuEl.getBoundingClientRect(), 12, 0);
      return;
    }


    if (choice === "閉じる") {
      hideRevealMenu();
    }
  });
});


/* ========================================
   FILEメニュー
======================================== */

fileOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedFileSide;

    if (selectedFileCardIndex === null) {
      hideFileMenu();
      return;
    }

    const fileCards = game[side].file;
    const cardData = fileCards[selectedFileCardIndex];
    if (!cardData) {
      hideFileMenu();
      return;
    }

    if (choice === "拡大") {
      showCardPreview(cardData.image);
      hideFileMenu();
      return;
    }

    if (choice === "表向き") {
      saveState();
      cardData.faceUp = true;
      renderFileArea(side);
      hideFileMenu();
      return;
    }

    if (choice === "閉じる") {
      hideFileMenu();
      return;
    }
  });
});


/* ========================================
   証拠メニュー
======================================== */

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

    if (choice === "手札") {
      saveState();

      game[side].hand.push(cardData.image);
      game[side].evidence.splice(selectedEvidenceCardIndex, 1);

      renumberEvidence(side);

      renderHand(side);
      renderEvidenceArea(side);

      if (game[side].evidence.length === 0) {
        hideEvidenceLayer();
      } else {
        renderEvidenceLayer(side);
      }

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


/* ========================================
   リムーブメニュー
======================================== */

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


/* ========================================
   リムーブ一覧カードメニュー
======================================== */

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

    if (choice === "現場") {
      showMenuAt(removeToSceneMenuEl, removeCardMenuEl.getBoundingClientRect(), 12, 0);
      return;
    }

    if (choice === "山札") {
      saveState();

      game[side].deck.push(card);
      game[side].remove.splice(selectedRemoveCardIndex, 1);

      renderRemoveArea(side);
      renderRemoveLayer(side);
      updateDeckCount(side);
      hideRemoveCardMenu();
      return;
    }

    if (choice === "閉じる") {
      hideRemoveCardMenu();
    }
  });
});

removeToSceneOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const slot = Number(button.dataset.slot);
    const side = selectedRemoveSide;

    if (slot === -1) {
      hideRemoveToSceneMenu();
      return;
    }

    if (selectedRemoveCardIndex === null) return;

    saveState();

    const moved = moveRemoveCardToSceneUnder(side, selectedRemoveCardIndex, slot);

    if (moved) {
      hideRemoveToSceneMenu();
      hideRemoveCardMenu();
    }
  });
});

revealToSceneOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const slot = Number(button.dataset.slot);
    const side = selectedRevealSide;

    if (slot === -1) {
      hideRevealToSceneMenu();
      return;
    }

    if (selectedRevealCardIndex === null) return;

    saveState();

    const moved = moveRevealedCardToScene(side, selectedRevealCardIndex, slot);

    if (moved) {
      hideRevealToSceneMenu();
      hideRevealMenu();

      if (game[side].revealed.length === 0) {
        hideRevealLayer();
      } else {
        renderRevealLayer(side);
      }
    }
  });
});


/* ========================================
   パートナーメニュー
======================================== */

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

    if (type === "D") {
      renderPartnerStackLayer(selectedPartnerSide);
      hidePartnerMenu();
    }
  });
});

partnerStackCardOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();
    const side = selectedPartnerStackSide;
    const stackIndex = selectedPartnerStackIndex;

    if (stackIndex === null) return;

    const stack = game[side].partner;
    const card = stack?.[stackIndex];

    if (!card) {
      hidePartnerStackCardMenu();
      return;
    }

    if (choice === "拡大") {
      showCardPreview(card);
      hidePartnerStackCardMenu();
      return;
    }

    if (choice === "リムーブ") {
      saveState();

      game[side].remove.push(card);
      stack.splice(stackIndex, 1);

      renderPartnerCard(side);
      renderPartnerStackLayer(side);
      renderRemoveArea(side);

      if (!Array.isArray(stack) || stack.length <= 1) {
        hidePartnerStackLayer();
      }

      hidePartnerStackCardMenu();
      return;
    }

    if (choice === "閉じる") {
      hidePartnerStackCardMenu();
    }
  });
});


/* ========================================
   事件メニュー
======================================== */

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

    if (label === "閉じる") {
      incidentMenuEl.classList.add("hidden");
    }
  });
});


/* ========================================
   現場下カード一覧メニュー
======================================== */

sceneStackCardOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const choice = button.textContent.trim();

    if (selectedSceneStackIndex === null || selectedSceneStackHiddenIndex === null) {
      hideSceneStackCardMenu();
      return;
    }

    const side = selectedSceneStackSide;
    const stack = game[side].scene[selectedSceneStackIndex];
    const card = stack?.[selectedSceneStackHiddenIndex];

    if (!card) {
      hideSceneStackCardMenu();
      return;
    }

    if (choice === "A") {
      saveState();

      stack.splice(selectedSceneStackHiddenIndex, 1);
      game[side].remove.push(card.image);

      renderSceneStackLayer(side, selectedSceneStackIndex);
      renderSceneArea(side);
      renderRemoveArea(side);

      hideSceneStackCardMenu();
      return;
    }

    if (choice === "B") {
      hideSceneStackCardMenu();
      return;
    }

    if (choice === "閉じる") {
      hideSceneStackCardMenu();
    }
  });
});


/* ========================================
   高精度ドラッグ操作
   手札 → 現場 / パートナー
   現場 → 現場 / ミステリー
======================================== */

/* ========================================
   高精度ドラッグ操作
   安定版・丸ごと置き換え用
======================================== */

let dragState = null;
let dragJustEnded = false;
let dragGhostEl = null;

/* ========================================
   ドラッグ終了
======================================== */

function finishDrag() {
  const wasDragging = !!(dragState && dragState.started);

  if (dragState?.sourceEl && dragState.pointerId !== undefined) {
    try {
      if (dragState.sourceEl.hasPointerCapture?.(dragState.pointerId)) {
        dragState.sourceEl.releasePointerCapture(dragState.pointerId);
      }
    } catch (e) {
      // 失敗しても続行
    }
  }

  if (dragState) {
    if (dragState.element) {
      dragState.element.style.opacity = "";
      dragState.element.classList.remove("dragging");
    }

    if (dragState.zoneElement) {
      dragState.zoneElement.style.opacity = "";
      dragState.zoneElement.classList.remove("dragging");
    }
  }

  [
    playerDeckEl,
    opponentDeckEl,
    removeAreaEl,
    opponentRemoveAreaEl,
    partnerFileCardEl,
    opponentPartnerFileCardEl,
    mysteryAreaEl,
    opponentMysteryAreaEl,
    fileAreaEl,
    opponentFileAreaEl,
    dom.self.evidence,
    dom.opponent.evidence
  ].forEach((el) => {
    if (!el) return;
    el.style.opacity = "";
    el.classList.remove("dragging");
  });

  clearDropHighlights();

  if (dragGhostEl) {
    dragGhostEl.remove();
    dragGhostEl = null;
  }

  dragState = null;

  if (wasDragging) {
    dragJustEnded = true;
    setTimeout(() => {
      dragJustEnded = false;
    }, 0);
  } else {
    dragJustEnded = false;
  }
}
/* ========================================
   ハイライト解除
======================================== */

function clearDropHighlights() {
  document.querySelectorAll(".scene-slot.drop-highlight").forEach((el) => {
    el.classList.remove("drop-highlight");
  });

  if (mysteryAreaEl) mysteryAreaEl.classList.remove("drop-highlight");
  if (opponentMysteryAreaEl) opponentMysteryAreaEl.classList.remove("drop-highlight");
  if (selfPartnerZoneEl) selfPartnerZoneEl.classList.remove("drop-highlight");
  if (opponentPartnerZoneEl) opponentPartnerZoneEl.classList.remove("drop-highlight");
  if (dom.self.hand) dom.self.hand.classList.remove("drop-highlight");
  if (dom.opponent.hand) dom.opponent.hand.classList.remove("drop-highlight");
  if (dom.self.evidence) dom.self.evidence.classList.remove("drop-highlight");
  if (dom.opponent.evidence) dom.opponent.evidence.classList.remove("drop-highlight");

  [
    fileAreaEl,
    opponentFileAreaEl,
    removeAreaEl,
    opponentRemoveAreaEl,
    partnerFileCardEl,
    opponentPartnerFileCardEl,
    playerDeckEl,
    opponentDeckEl
  ].forEach((el) => {
    if (!el) return;
    el.classList.remove("drop-highlight");
    el.style.outline = "";
    el.style.outlineOffset = "";
    el.style.boxShadow = "";
  });
}

/* ========================================
   共通：判定
======================================== */

function getSceneSlots(side) {
  const selector = side === "self"
    ? "#scene-area .scene-slot"
    : "#opponent-scene-area .scene-slot";

  return Array.from(document.querySelectorAll(selector));
}

function getNearestSceneSlot(side, clientX, clientY) {
  const slots = getSceneSlots(side);

  let nearest = null;
  let nearestDistance = Infinity;

  slots.forEach((slotEl, index) => {
    const rect = slotEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = { index, el: slotEl, rect };
    }
  });

  return nearest;
}

function isPointerOverHand(side, clientX, clientY) {
  const targetEl = side === "self" ? dom.self.hand : dom.opponent.hand;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverFile(side, clientX, clientY) {
  const targetEl = side === "self" ? fileAreaEl : opponentFileAreaEl;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverPartner(side, clientX, clientY) {
  const targetEl = side === "self" ? selfPartnerZoneEl : opponentPartnerZoneEl;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverPartnerFile(side, clientX, clientY) {
  const targetEl = side === "self" ? partnerFileCardEl : opponentPartnerFileCardEl;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverMystery(side, clientX, clientY) {
  const targetEl = side === "self" ? mysteryAreaEl : opponentMysteryAreaEl;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverEvidence(side, clientX, clientY) {
  const targetEl = side === "self" ? dom.self.evidence : dom.opponent.evidence;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 30;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverRemove(side, clientX, clientY) {
  const targetEl = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

function isPointerOverDeck(side, clientX, clientY) {
  const targetEl = side === "self" ? playerDeckEl : opponentDeckEl;
  if (!targetEl) return false;

  const rect = targetEl.getBoundingClientRect();
  const padding = 24;

  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

/* ========================================
   ドラッグ開始
======================================== */

function beginHandDrag(cardEl, handIndex, side, startEvent) {
  const rect = cardEl.getBoundingClientRect();

  cardEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "hand",
    side,
    handIndex,
    element: cardEl,
    sourceEl: cardEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

function beginMysteryDrag(side, startEvent) {
  const targetEl = side === "self" ? mysteryAreaEl : opponentMysteryAreaEl;
  if (!targetEl) return;

  const imagePath = game[side].mystery;
  if (!imagePath) return;

  const rect = targetEl.getBoundingClientRect();

  targetEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "mystery",
    side,
    element: targetEl,
    sourceEl: targetEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

function beginSceneDrag(cardEl, sceneIndex, side, startEvent) {
  const rect = cardEl.getBoundingClientRect();

  cardEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "scene",
    side,
    sceneIndex,
    element: cardEl,
    sourceEl: cardEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

function beginDeckDrag(cardEl, side, startEvent) {
  const rect = cardEl.getBoundingClientRect();

  cardEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "deck",
    side,
    element: cardEl,
    sourceEl: cardEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

function beginFileDrag(side, startEvent) {
  const zoneEl = side === "self" ? fileAreaEl : opponentFileAreaEl;
  if (!zoneEl) return;
  if (!game[side].file.length) return;

  const fileCardEls = zoneEl.querySelectorAll(".file-card");
  const topCardEl = fileCardEls[fileCardEls.length - 1];
  if (!topCardEl) return;

  const rect = topCardEl.getBoundingClientRect();

  topCardEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "file",
    side,
    element: topCardEl,      // ← ゴーストに使うのは一番上のカードだけ
    zoneElement: zoneEl,     // ← 元のFILE全体は別で持っておく
    sourceEl: topCardEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

function beginEvidenceDrag(side, startEvent) {
  const zoneEl = side === "self" ? dom.self.evidence : dom.opponent.evidence;
  if (!zoneEl) return;
  if (!game[side].evidence.length) return;

  const evidenceCardEls = zoneEl.querySelectorAll(".evidence-card");
  const topCardEl = evidenceCardEls[evidenceCardEls.length - 1];
  if (!topCardEl) return;

  const rect = topCardEl.getBoundingClientRect();

  topCardEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "evidence",
    side,
    element: topCardEl,      // ← 動かす見た目は一番上のカードだけ
    zoneElement: zoneEl,     // ← 元の証拠エリア全体は別で保持
    sourceEl: topCardEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

function beginPartnerDrag(cardEl, side, startEvent) {
  const rect = cardEl.getBoundingClientRect();

  cardEl.setPointerCapture?.(startEvent.pointerId);

  dragState = {
    type: "partner",
    side,
    element: cardEl,
    sourceEl: cardEl,
    pointerId: startEvent.pointerId,
    started: false,
    startX: startEvent.clientX,
    startY: startEvent.clientY,
    offsetX: startEvent.clientX - rect.left,
    offsetY: startEvent.clientY - rect.top
  };
}

/* ========================================
   ゴースト表示
======================================== */

function startDraggingVisual() {
  if (!dragState || dragState.started) return;

  dragState.started = true;

  const cardEl = dragState.element;
  const rect = cardEl.getBoundingClientRect();

  dragGhostEl = cardEl.cloneNode(true);
  dragGhostEl.classList.add("dragging");
  dragGhostEl.style.position = "fixed";
  dragGhostEl.style.left = `${rect.left}px`;
  dragGhostEl.style.top = `${rect.top}px`;
  dragGhostEl.style.width = `${rect.width}px`;
  dragGhostEl.style.height = `${rect.height}px`;
  dragGhostEl.style.zIndex = "99999";
  dragGhostEl.style.pointerEvents = "none";
  dragGhostEl.style.marginTop = "0";
  dragGhostEl.style.opacity = "0.96";
  dragGhostEl.style.transform = "scale(1.06) rotate(-4deg)";
  dragGhostEl.style.filter = "drop-shadow(0 10px 18px rgba(0,0,0,0.35))";

  document.body.appendChild(dragGhostEl);

  if (dragState.type === "file" && dragState.zoneElement) {
    dragState.zoneElement.style.opacity = "0.45";
  } else if (dragState.type === "evidence" && dragState.zoneElement) {
    dragState.zoneElement.style.opacity = "0.45";
  } else if (dragState.element) {
    dragState.element.style.opacity = "0.35";
  }
}

function moveDraggingVisual(clientX, clientY) {
  if (!dragState || !dragState.started || !dragGhostEl) return;

  dragGhostEl.style.left = `${clientX - dragState.offsetX}px`;
  dragGhostEl.style.top = `${clientY - dragState.offsetY}px`;

  clearDropHighlights();

  const side = dragState.side;

  if (dragState.type === "hand") {
  if (isPointerOverPartner(side, clientX, clientY)) {
    const zone = side === "self" ? selfPartnerZoneEl : opponentPartnerZoneEl;
    zone?.classList.add("drop-highlight");
    return;
  }

  if (isPointerOverRemove(side, clientX, clientY)) {
    const zone = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
    if (zone) {
      zone.style.outline = "3px solid rgba(255,230,120,0.95)";
      zone.style.outlineOffset = "4px";
      zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
    }
    return;
  }

  if (isPointerOverDeck(side, clientX, clientY)) {
    const zone = side === "self" ? playerDeckEl : opponentDeckEl;
    if (zone) {
      zone.style.outline = "3px solid rgba(255,230,120,0.95)";
      zone.style.outlineOffset = "4px";
      zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
    }
    return;
  }

  const nearest = getNearestSceneSlot(side, clientX, clientY);
  if (nearest) {
    nearest.el.classList.add("drop-highlight");
  }
}

  if (dragState.type === "scene") {
  if (isPointerOverRemove(side, clientX, clientY)) {
    const zone = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
    if (zone) {
      zone.style.outline = "3px solid rgba(255,230,120,0.95)";
      zone.style.outlineOffset = "4px";
      zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
    }
    return;
  }

  if (isPointerOverDeck(side, clientX, clientY)) {
    const zone = side === "self" ? playerDeckEl : opponentDeckEl;
    if (zone) {
      zone.style.outline = "3px solid rgba(255,230,120,0.95)";
      zone.style.outlineOffset = "4px";
      zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
    }
    return;
  }

  if (isPointerOverMystery(side, clientX, clientY)) {
    const zone = side === "self" ? mysteryAreaEl : opponentMysteryAreaEl;
    zone?.classList.add("drop-highlight");
    return;
  }

  if (isPointerOverHand(side, clientX, clientY)) {
    const zone = side === "self" ? dom.self.hand : dom.opponent.hand;
    zone?.classList.add("drop-highlight");
    return;
  }

  const nearest = getNearestSceneSlot(side, clientX, clientY);
  if (nearest) {
    nearest.el.classList.add("drop-highlight");
  }
}

  if (dragState.type === "deck") {
  if (isPointerOverFile(side, clientX, clientY)) {
    const zone = side === "self" ? fileAreaEl : opponentFileAreaEl;
    zone?.classList.add("drop-highlight");
    return;
  }

  if (isPointerOverEvidence(side, clientX, clientY)) {
    const zone = side === "self" ? dom.self.evidence : dom.opponent.evidence;
    zone?.classList.add("drop-highlight");
    return;
  }

  if (isPointerOverRemove(side, clientX, clientY)) {
    const zone = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
    if (zone) {
      zone.style.outline = "3px solid rgba(255,230,120,0.95)";
      zone.style.outlineOffset = "4px";
      zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
    }
    return;
  }

  if (isPointerOverHand(side, clientX, clientY)) {
    const zone = side === "self" ? dom.self.hand : dom.opponent.hand;
    zone?.classList.add("drop-highlight");
    return;
  }

  const nearest = getNearestSceneSlot(side, clientX, clientY);
  if (nearest) {
    const targetStack = game[side].scene[nearest.index];
    if (targetStack && targetStack.length > 0) {
      nearest.el.classList.add("drop-highlight");
    }
  }
}

  if (dragState.type === "file") {
  if (isPointerOverRemove(side, clientX, clientY)) {
    const zone = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
    if (zone) {
      zone.style.outline = "3px solid rgba(255,230,120,0.95)";
      zone.style.outlineOffset = "4px";
      zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
    }
    return;
  }

  if (isPointerOverHand(side, clientX, clientY)) {
    const zone = side === "self" ? dom.self.hand : dom.opponent.hand;
    zone?.classList.add("drop-highlight");
  }
}

  if (dragState.type === "evidence") {
    if (isPointerOverRemove(side, clientX, clientY)) {
      const zone = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
      if (zone) {
        zone.style.outline = "3px solid rgba(255,230,120,0.95)";
        zone.style.outlineOffset = "4px";
        zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
      }
    }

    if (isPointerOverHand(side, clientX, clientY)) {
      const zone = side === "self" ? dom.self.hand : dom.opponent.hand;
      zone?.classList.add("drop-highlight");
    }
  }

  if (dragState.type === "partner") {
    if (isPointerOverPartnerFile(side, clientX, clientY)) {
      const zone = side === "self" ? partnerFileCardEl : opponentPartnerFileCardEl;
      if (zone) {
        zone.style.outline = "3px solid rgba(255,230,120,0.95)";
        zone.style.outlineOffset = "4px";
        zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
      }
    }
  }

  if (dragState.type === "mystery") {
    const nearest = getNearestSceneSlot(side, clientX, clientY);
    if (nearest) nearest.el.classList.add("drop-highlight");

    if (isPointerOverRemove(side, clientX, clientY)) {
      const zone = side === "self" ? removeAreaEl : opponentRemoveAreaEl;
      if (zone) {
        zone.style.outline = "3px solid rgba(255,230,120,0.95)";
        zone.style.outlineOffset = "4px";
        zone.style.boxShadow = "0 0 18px rgba(255,230,120,0.55)";
      }
    }
  }
}

/* ========================================
   ドロップ処理
======================================== */

function dropHandToPartner(clientX, clientY) {
  if (!dragState || dragState.type !== "hand" || !dragState.started) return false;
  if (!isPointerOverPartner(dragState.side, clientX, clientY)) return false;

  const card = game[dragState.side].hand[dragState.handIndex];
  if (!card) return false;

  saveState();

  game[dragState.side].partner.push(card);
  game[dragState.side].hand.splice(dragState.handIndex, 1);
  partnerTapped[dragState.side] = false;

  renderHand(dragState.side);
  renderPartnerCard(dragState.side);

  return true;
}

function dropHandToScene(clientX, clientY) {
  if (!dragState || dragState.type !== "hand" || !dragState.started) return false;

  const nearest = getNearestSceneSlot(dragState.side, clientX, clientY);
  if (!nearest) return false;

  const card = game[dragState.side].hand[dragState.handIndex];
  if (!card) return false;

  const stack = game[dragState.side].scene[nearest.index];
  if (!stack) return false;

  saveState();

  const sceneCardData = {
    image: card,
    sleep: false,
    stun: false
  };

  if (stack.length === 0) {
    // 空の現場なら表で置く
    stack.unshift(sceneCardData);
  } else {
    // すでにカードがあるなら表の下に差し込む
    stack.splice(1, 0, sceneCardData);
  }

  game[dragState.side].hand.splice(dragState.handIndex, 1);

  renderHand(dragState.side);
  renderSceneArea(dragState.side);

  return true;
}

function dropHandToRemove(clientX, clientY) {
  if (!dragState || dragState.type !== "hand" || !dragState.started) return false;
  if (!isPointerOverRemove(dragState.side, clientX, clientY)) return false;

  const card = game[dragState.side].hand[dragState.handIndex];
  if (!card) return false;

  saveState();

  game[dragState.side].remove.push(card);
  game[dragState.side].hand.splice(dragState.handIndex, 1);

  renderHand(dragState.side);
  renderRemoveArea(dragState.side);

  return true;
}

function dropHandToDeck(clientX, clientY) {
  if (!dragState || dragState.type !== "hand" || !dragState.started) return false;
  if (!isPointerOverDeck(dragState.side, clientX, clientY)) return false;

  const card = game[dragState.side].hand[dragState.handIndex];
  if (!card) return false;

  saveState();

  game[dragState.side].deck.push(card);
  game[dragState.side].hand.splice(dragState.handIndex, 1);

  renderHand(dragState.side);
  updateDeckCount(dragState.side);

  return true;
}

function dropDeckToHand(clientX, clientY) {
  if (!dragState || dragState.type !== "deck" || !dragState.started) return false;
  if (!isPointerOverHand(dragState.side, clientX, clientY)) return false;
  if (game[dragState.side].deck.length === 0) return false;

  saveState();

  const card = game[dragState.side].deck.shift();
  game[dragState.side].hand.push(card);

  renderHand(dragState.side);
  updateDeckCount(dragState.side);

  return true;
}

function dropDeckToFile(clientX, clientY) {
  if (!dragState || dragState.type !== "deck" || !dragState.started) return false;
  if (!isPointerOverFile(dragState.side, clientX, clientY)) return false;
  if (game[dragState.side].deck.length === 0) return false;

  saveState();

  const card = game[dragState.side].deck.shift();
  game[dragState.side].file.push({
  image: card,
  type: "normal",
  faceUp: false
});

  renderFileArea(dragState.side);
  updateDeckCount(dragState.side);

  return true;
}

function dropDeckToEvidence(clientX, clientY) {
  if (!dragState || dragState.type !== "deck" || !dragState.started) return false;
  if (!isPointerOverEvidence(dragState.side, clientX, clientY)) return false;
  if (game[dragState.side].deck.length === 0) return false;

  saveState();

  const card = game[dragState.side].deck.shift();
  game[dragState.side].evidence.push({
    image: card,
    number: 0,
    faceUp: false
  });

  renumberEvidence(dragState.side);
  renderEvidenceArea(dragState.side);
  updateDeckCount(dragState.side);

  return true;
}

function dropDeckToRemove(clientX, clientY) {
  if (!dragState || dragState.type !== "deck" || !dragState.started) return false;
  if (!isPointerOverRemove(dragState.side, clientX, clientY)) return false;
  if (game[dragState.side].deck.length === 0) return false;

  saveState();

  const card = game[dragState.side].deck.shift();
  game[dragState.side].remove.push(card);

  renderRemoveArea(dragState.side);
  updateDeckCount(dragState.side);

  return true;
}

function dropDeckToSceneUnder(clientX, clientY) {
  if (!dragState || dragState.type !== "deck" || !dragState.started) return false;
  if (game[dragState.side].deck.length === 0) return false;

  const nearest = getNearestSceneSlot(dragState.side, clientX, clientY);
  if (!nearest) return false;

  const targetStack = game[dragState.side].scene[nearest.index];
  if (!targetStack || targetStack.length === 0) return false;

  saveState();

  const moved = sendDeckCardToSceneUnder(dragState.side, nearest.index);
  return moved;
}

function dropFileToHand(clientX, clientY) {
  if (!dragState || dragState.type !== "file" || !dragState.started) return false;
  if (!isPointerOverHand(dragState.side, clientX, clientY)) return false;
  if (!game[dragState.side].file.length) return false;

  saveState();

  const fileCards = game[dragState.side].file;
  const topIndex = fileCards.length - 1;
  const cardData = fileCards[topIndex];
  if (!cardData) return false;

  game[dragState.side].hand.push(cardData.image);
  fileCards.splice(topIndex, 1);

  renderHand(dragState.side);
  renderFileArea(dragState.side);

  return true;
}

function dropFileToRemove(clientX, clientY) {
  if (!dragState || dragState.type !== "file" || !dragState.started) return false;
  if (!isPointerOverRemove(dragState.side, clientX, clientY)) return false;
  if (!game[dragState.side].file.length) return false;

  saveState();

  const fileCards = game[dragState.side].file;
  const topIndex = fileCards.length - 1;
  const cardData = fileCards[topIndex];
  if (!cardData) return false;

  game[dragState.side].remove.push(cardData.image);
  fileCards.splice(topIndex, 1);

  renderFileArea(dragState.side);
  renderRemoveArea(dragState.side);

  return true;
}

function dropEvidenceToRemove(clientX, clientY) {
  if (!dragState || dragState.type !== "evidence" || !dragState.started) return false;
  if (!isPointerOverRemove(dragState.side, clientX, clientY)) return false;

  const evidenceCards = game[dragState.side].evidence;
  const topIndex = evidenceCards.length - 1;
  const cardData = evidenceCards[topIndex];
  if (!cardData) return false;

  saveState();

  game[dragState.side].remove.push(cardData.image);
  evidenceCards.splice(topIndex, 1);

  renumberEvidence(dragState.side);
  renderEvidenceArea(dragState.side);
  renderRemoveArea(dragState.side);

  return true;
}

function dropEvidenceToHand(clientX, clientY) {
  if (!dragState || dragState.type !== "evidence" || !dragState.started) return false;
  if (!isPointerOverHand(dragState.side, clientX, clientY)) return false;

  const evidenceCards = game[dragState.side].evidence;
  const topIndex = evidenceCards.length - 1;
  const cardData = evidenceCards[topIndex];
  if (!cardData) return false;

  saveState();

  game[dragState.side].hand.push(cardData.image);
  evidenceCards.splice(topIndex, 1);

  renumberEvidence(dragState.side);
  renderHand(dragState.side);
  renderEvidenceArea(dragState.side);

  return true;
}

function dropSceneToHand(clientX, clientY) {
  if (!dragState || dragState.type !== "scene" || !dragState.started) return false;
  if (!isPointerOverHand(dragState.side, clientX, clientY)) return false;

  const side = dragState.side;
  const fromIndex = dragState.sceneIndex;
  const fromStack = game[side].scene[fromIndex];

  if (!fromStack || fromStack.length === 0) return false;

  saveState();

  const visibleCard = fromStack[0];
  const hiddenCards = fromStack.slice(1);

  if (visibleCard) {
    game[side].hand.push(visibleCard.image);
  }

  hiddenCards.forEach((card) => {
    game[side].remove.push(card.image);
  });

  game[side].scene[fromIndex] = [];

  renderHand(side);
  renderSceneArea(side);
  renderRemoveArea(side);

  return true;
}

function moveSceneCard(clientX, clientY) {
  if (!dragState || dragState.type !== "scene" || !dragState.started) return false;

  const side = dragState.side;
  const fromIndex = dragState.sceneIndex;
  const nearest = getNearestSceneSlot(side, clientX, clientY);

  if (!nearest) return false;

  const toIndex = nearest.index;
  if (fromIndex === toIndex) return false;

  const fromStack = game[side].scene[fromIndex];
  const toStack = game[side].scene[toIndex];

  if (!fromStack || fromStack.length === 0) return false;
  if (!toStack) return false;

  saveState();

  // 移動元の表カードだけを持っていく
  const movingCard = fromStack.shift();
  if (!movingCard) return false;

  if (toStack.length === 0) {
    // 移動先が空なら、そのまま表で置く
    toStack.unshift(movingCard);
  } else {
    // 移動先にすでにカードがあるなら、表カードの下に差し込む
    toStack.splice(1, 0, movingCard);
  }

  renderSceneArea(side);
  return true;
}

function dropSceneToMystery(clientX, clientY) {
  if (!dragState || dragState.type !== "scene" || !dragState.started) return false;
  if (!isPointerOverMystery(dragState.side, clientX, clientY)) return false;

  const side = dragState.side;
  const fromIndex = dragState.sceneIndex;
  const fromStack = game[side].scene[fromIndex];

  if (!fromStack || fromStack.length === 0) return false;

  saveState();

  const visibleCard = fromStack[0];
  const hiddenCards = fromStack.slice(1);
  const oldMystery = game[side].mystery;

  game[side].mystery = visibleCard.image;

  hiddenCards.forEach((card) => {
    game[side].remove.push(card.image);
  });

  game[side].scene[fromIndex] = [];

  if (oldMystery) {
    game[side].remove.push(oldMystery);
  }

  renderSceneArea(side);
  renderMysteryArea(side);
  renderRemoveArea(side);

  return true;
}

function dropSceneToRemove(clientX, clientY) {
  if (!dragState || dragState.type !== "scene" || !dragState.started) return false;
  if (!isPointerOverRemove(dragState.side, clientX, clientY)) return false;

  const side = dragState.side;
  const fromIndex = dragState.sceneIndex;
  const fromStack = game[side].scene[fromIndex];

  if (!fromStack || fromStack.length === 0) return false;

  saveState();

  const visibleCard = fromStack[0];
  const hiddenCards = fromStack.slice(1);

  game[side].remove.push(visibleCard.image);

  hiddenCards.forEach((card) => {
    game[side].remove.push(card.image);
  });

  game[side].scene[fromIndex] = [];

  renderSceneArea(side);
  renderRemoveArea(side);

  return true;
}

function dropSceneToDeck(clientX, clientY) {
  if (!dragState || dragState.type !== "scene" || !dragState.started) return false;
  if (!isPointerOverDeck(dragState.side, clientX, clientY)) return false;

  const side = dragState.side;
  const fromIndex = dragState.sceneIndex;
  const fromStack = game[side].scene[fromIndex];

  if (!fromStack || fromStack.length === 0) return false;

  saveState();

  const visibleCard = fromStack[0];
  const hiddenCards = fromStack.slice(1);

  game[side].deck.push(visibleCard.image);

  hiddenCards.forEach((card) => {
    game[side].remove.push(card.image);
  });

  game[side].scene[fromIndex] = [];

  renderSceneArea(side);
  renderRemoveArea(side);
  updateDeckCount(side);

  return true;
}

function dropPartnerToPartnerFile(clientX, clientY) {
  if (!dragState || dragState.type !== "partner" || !dragState.started) return false;
  if (!isPointerOverPartnerFile(dragState.side, clientX, clientY)) return false;
  if (!Array.isArray(game[dragState.side].partner) || game[dragState.side].partner.length === 0) return false;

  saveState();

  const card = game[dragState.side].partner.shift();
  if (!card) return false;

  game[dragState.side].partnerFile = card;

  renderPartnerCard(dragState.side);
  renderPartnerFileCard(dragState.side);

  return true;
}

function dropMysteryToScene(clientX, clientY) {
  if (!dragState || dragState.type !== "mystery" || !dragState.started) return false;

  const side = dragState.side;
  const nearest = getNearestSceneSlot(side, clientX, clientY);
  if (!nearest) return false;

  const targetStack = game[side].scene[nearest.index];
  if (!targetStack || targetStack.length > 0) return false;

  const card = game[side].mystery;
  if (!card) return false;

  saveState();

  targetStack.push({
    image: card,
    sleep: false,
    stun: false
  });

  game[side].mystery = "";

  renderSceneArea(side);
  renderMysteryArea(side);

  return true;
}

function dropMysteryToRemove(clientX, clientY) {
  if (!dragState || dragState.type !== "mystery" || !dragState.started) return false;
  if (!isPointerOverRemove(dragState.side, clientX, clientY)) return false;

  const side = dragState.side;
  const card = game[side].mystery;
  if (!card) return false;

  saveState();

  game[side].remove.push(card);
  game[side].mystery = "";

  renderMysteryArea(side);
  renderRemoveArea(side);

  return true;
}
/* ========================================
   ドラッグ中イベント
======================================== */

document.addEventListener("pointermove", (event) => {
  if (!dragState) return;

  const dx = event.clientX - dragState.startX;
  const dy = event.clientY - dragState.startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (!dragState.started && distance >= 3) {
    startDraggingVisual();
    dragState.started = true;
  }

  if (!dragState.started) return;

  moveDraggingVisual(event.clientX, event.clientY);
});

document.addEventListener("pointerup", (event) => {
  if (!dragState) return;

  if (!dragState.started) {
    finishDrag();
    return;
  }

  if (dragState.type === "hand") {
  dropHandToPartner(event.clientX, event.clientY) ||
  dropHandToRemove(event.clientX, event.clientY) ||
  dropHandToDeck(event.clientX, event.clientY) ||
  dropHandToScene(event.clientX, event.clientY);
  } else if (dragState.type === "scene") {
  dropped =
    dropSceneToRemove(event.clientX, event.clientY) ||
    dropSceneToDeck(event.clientX, event.clientY) ||
    dropSceneToMystery(event.clientX, event.clientY) ||
    dropSceneToHand(event.clientX, event.clientY) ||
    moveSceneCard(event.clientX, event.clientY);
} else if (dragState.type === "deck") {
  dropped =
    dropDeckToFile(event.clientX, event.clientY) ||
    dropDeckToEvidence(event.clientX, event.clientY) ||
    dropDeckToRemove(event.clientX, event.clientY) ||
    dropDeckToHand(event.clientX, event.clientY) ||
    dropDeckToSceneUnder(event.clientX, event.clientY);
} else if (dragState.type === "file") {
  dropFileToRemove(event.clientX, event.clientY) ||
  dropFileToHand(event.clientX, event.clientY);
  } else if (dragState.type === "evidence") {
    dropEvidenceToRemove(event.clientX, event.clientY) ||
    dropEvidenceToHand(event.clientX, event.clientY);
  } else if (dragState.type === "partner") {
    dropPartnerToPartnerFile(event.clientX, event.clientY);
  } else if (dragState.type === "mystery") {
    dropMysteryToScene(event.clientX, event.clientY) ||
    dropMysteryToRemove(event.clientX, event.clientY);
  }

  finishDrag();
});

document.addEventListener("pointercancel", () => {
  if (!dragState) return;
  finishDrag();
});

document.addEventListener("mouseup", () => {
  if (!dragState) return;
  finishDrag();
});

window.addEventListener("blur", () => {
  if (!dragState) return;
  finishDrag();
});


/* ========================================
   初期化
======================================== */

function getSelectedDeckRecipe(side) {
  if (typeof window !== "undefined" && typeof window.getActiveDeckRecipe === "function") {
    const recipe = window.getActiveDeckRecipe(side);
    if (Array.isArray(recipe) && recipe.length > 0) {
      return recipe;
    }
  }

  if (side === "self" && typeof playerDeckRecipe !== "undefined" && Array.isArray(playerDeckRecipe)) {
    return playerDeckRecipe;
  }

  if (side === "opponent" && typeof opponentDeckRecipe !== "undefined" && Array.isArray(opponentDeckRecipe)) {
    return opponentDeckRecipe;
  }

  return [];
}

function resetGameState() {
  game.self = createEmptySideState();
  game.opponent = createEmptySideState();

  partnerTapped.self = false;
  partnerTapped.opponent = false;

  historyStack.length = 0;

  hideAllMenus();
  hideCardPreview();
  hideRevealLayer();
  hideRemoveLayer();
  hideEvidenceLayer();
  hideSceneStackLayer();
  hidePartnerStackLayer();
}

function setupGame() {
  resetGameState();

  const selfDeck = typeof getDeckById === "function"
    ? getDeckById(getActiveDeckId("self"))
    : null;

  const opponentDeck = typeof getDeckById === "function"
    ? getDeckById(getActiveDeckId("opponent"))
    : null;

  game.self.deck = shuffle(buildDeck(getSelectedDeckRecipe("self")));
  game.opponent.deck = shuffle(buildDeck(getSelectedDeckRecipe("opponent")));

  drawStartingHand("self", 5);
  drawStartingHand("opponent", 5);

  game.self.incident = selfDeck?.incidentCard || "";
  game.opponent.incident = opponentDeck?.incidentCard || "";

  game.self.partner = selfDeck?.partnerCard ? [selfDeck.partnerCard] : [];
  game.opponent.partner = opponentDeck?.partnerCard ? [opponentDeck.partnerCard] : [];

  game.self.partnerFile = "";
  game.opponent.partnerFile = "";

  game.self.mystery = "";
  game.opponent.mystery = "";

  renderAll();
  fitBoardToViewport();
}
window.restartGameWithSelectedDecks = function restartGameWithSelectedDecks() {
  setupGame();
};

setupGame();

/* ========================================
   事件パーツ自由配置
======================================== */

const incidentPiecePaletteEls = document.querySelectorAll(".incident-piece");

let freePieceDragState = null;

function createPlacedIncidentPiece(owner, type, clientX, clientY) {
  const el = document.createElement("div");
  el.className = `placed-incident-piece ${owner === "self" ? "self-piece" : "opponent-piece"}`;
  el.dataset.owner = owner;
  el.dataset.pieceType = type;

  if (type === "case") {
    el.style.backgroundImage = `url("cards/case.png")`;
  } else if (type === "closed") {
    el.style.backgroundImage = `url("cards/closed.png")`;
  }

  el.style.left = `${clientX - 45}px`;
  el.style.top = `${clientY - 45}px`;

  el.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    const rect = el.getBoundingClientRect();

    freePieceDragState = {
      mode: "move-existing",
      element: el,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
  });

  document.body.appendChild(el);
}

incidentPiecePaletteEls.forEach((pieceEl) => {
  pieceEl.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  event.stopPropagation();
  event.preventDefault();
  pieceEl.setPointerCapture?.(event.pointerId);
  
    const type = pieceEl.dataset.pieceType;
    const owner = pieceEl.dataset.owner;
    const rect = pieceEl.getBoundingClientRect();

    freePieceDragState = {
      mode: "create-new",
      pieceType: type,
      owner,
      sourceEl: pieceEl,
      ghostEl: null,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };

    const ghostEl = pieceEl.cloneNode(true);
    ghostEl.style.position = "fixed";
    ghostEl.style.left = `${rect.left}px`;
    ghostEl.style.top = `${rect.top}px`;
    ghostEl.style.width = `${rect.width}px`;
    ghostEl.style.height = `${rect.height}px`;
    ghostEl.style.zIndex = "50000";
    ghostEl.style.pointerEvents = "none";
    ghostEl.style.opacity = "0.9";

    document.body.appendChild(ghostEl);
    freePieceDragState.ghostEl = ghostEl;
  });
});

document.addEventListener("pointermove", (event) => {
  if (!freePieceDragState) return;

  if (freePieceDragState.mode === "create-new") {
    const ghostEl = freePieceDragState.ghostEl;
    if (!ghostEl) return;

    ghostEl.style.left = `${event.clientX - freePieceDragState.offsetX}px`;
    ghostEl.style.top = `${event.clientY - freePieceDragState.offsetY}px`;
    return;
  }

  if (freePieceDragState.mode === "move-existing") {
    const el = freePieceDragState.element;
    if (!el) return;

    el.style.left = `${event.clientX - freePieceDragState.offsetX}px`;
    el.style.top = `${event.clientY - freePieceDragState.offsetY}px`;
  }
});

document.addEventListener("pointerup", (event) => {
  if (!freePieceDragState) return;

  if (freePieceDragState.mode === "create-new") {
    const { owner, pieceType, ghostEl } = freePieceDragState;

    if (ghostEl) {
      createPlacedIncidentPiece(owner, pieceType, event.clientX, event.clientY);
      ghostEl.remove();
    }
  }

  freePieceDragState = null;
});

document.addEventListener("pointercancel", () => {
  if (!freePieceDragState) return;

  if (freePieceDragState.mode === "create-new" && freePieceDragState.ghostEl) {
    freePieceDragState.ghostEl.remove();
  }

  freePieceDragState = null;
});