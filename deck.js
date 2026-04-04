function getDefaultDeckRecipe() {
  return [
    { image: "cards/0015.png", count: 3 },
    { image: "cards/0016.png", count: 3 },
    { image: "cards/0017.png", count: 3 },
    { image: "cards/0018.png", count: 3 },
    { image: "cards/0019.png", count: 3 },
    { image: "cards/0020.png", count: 3 },
    { image: "cards/0091.png", count: 3 },
    { image: "cards/0092.png", count: 3 },
    { image: "cards/0093.png", count: 3 },
    { image: "cards/0094.png", count: 3 },
    { image: "cards/0100.png", count: 3 },
    { image: "cards/0101.png", count: 3 },
    { image: "cards/0102.png", count: 2 }
  ];
}

function loadDeckRecipe(storageKey) {
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    console.log(`${storageKey} が見つからないので初期デッキを使います`);
    return getDefaultDeckRecipe();
  }

  try {
    const deckData = JSON.parse(raw);
    const recipe = [];

    for (const [cardId, count] of Object.entries(deckData.cards || {})) {
      const card = cardMaster.find((c) => c.id === cardId);
      if (!card || count <= 0) continue;

      recipe.push({
        image: card.image,
        count: count
      });
    }

    console.log(`${storageKey} から読み込んだレシピ`, recipe);

    if (recipe.length === 0) {
      return getDefaultDeckRecipe();
    }

    return recipe;
  } catch (error) {
    console.error(`${storageKey} の変換に失敗しました`, error);
    return getDefaultDeckRecipe();
  }
}

const playerDeckRecipe = loadDeckRecipe("playerDeckData");
const opponentDeckRecipe = loadDeckRecipe("opponentDeckData");