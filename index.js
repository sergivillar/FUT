const puppeteer = require("puppeteer");

let playersBuyed = 0;
const playerName = "Laurence Bilboe";
const playerQuality = "";
const maxBuyNowPrice = 250;
const playersToBuy = 2;

const getRandomAwaitTime = () => Math.floor(Math.random() * (1500 - 500) + 500);

const goToMarketTab = async page => {
  await page.waitFor(getRandomAwaitTime());

  const transferMarketTabButton = await page.$x(
    "//button[contains(text(), 'Transfers')]"
  );

  if (transferMarketTabButton.length > 0) {
    await transferMarketTabButton[0].click();
  } else {
    console.log("No transfer tab found");
    await browser.close();
  }
};

const goToMarket = async page => {
  await page.waitFor(getRandomAwaitTime());

  const goToMarketButton = await page.$x(
    "//h1[contains(text(), 'Search the Transfer Market')]"
  );

  if (goToMarketButton.length > 0) {
    await goToMarketButton[0].click();
  } else {
    console.log("No transfer button found");
    await browser.close();
  }
};

const typePlayerOnInput = async (page, playerName) => {
  await page.waitFor(getRandomAwaitTime());

  await page.click('input[placeholder="Type Player Name"]');

  await page.waitFor(500);

  await page.type('input[placeholder="Type Player Name"]', playerName, {
    delay: 80
  });
};

const selectPlayer = async (page, playerName) => {
  await page.waitFor(getRandomAwaitTime() * 1.5);

  const playerButton = await page.$x(
    `//span[contains(text(), "${playerName}")]`
  );

  if (playerButton.length > 0) {
    await playerButton[0].click();
  } else {
    console.log("Player name not found", playerButton);
  }
};

const searchPlayer = async page => {
  await page.waitFor(getRandomAwaitTime());

  const searchButton = await page.$x("//button[contains(text(), 'Search')]");

  if (searchButton.length > 0) {
    await searchButton[0].click();
  } else {
    console.log("No search button found");
  }
};

const changeQuality = async (page, quality) => {
  if (!quality) {
    return;
  }
  await page.waitFor(getRandomAwaitTime());

  const qualityButton = await page.$x("//span[contains(text(), 'Quality')]");

  if (qualityButton.length > 0) {
    await qualityButton[0].click();
  } else {
    console.log("No quality button found");
  }

  await page.waitFor(500);

  const qualityOptionButton = await page.$x(
    `//li[contains(text(), '${quality}')]`
  );

  if (qualityOptionButton.length > 0) {
    await qualityOptionButton[0].click();
  } else {
    console.log("No quality option button found");
  }
};

const setMaxBuyNowPrice = async (page, maxPrice = 0) => {
  await page.waitFor(getRandomAwaitTime());

  const valueInputs = await page.$$(".numericInput");

  if (valueInputs.length !== 4) {
    console.log("There's no money inputs. Somthing went wrong");
    return;
  }

  const maxBuyNowPriceButton = valueInputs[3];

  maxBuyNowPriceButton.click();

  await page.waitFor(200);

  await maxBuyNowPriceButton.type(String(maxPrice), {
    delay: 80
  });
};

const isNoResultBanner = async page => {
  const noResultBanner = await page.$x(
    "//h2[contains(text(), 'No results found')]"
  );

  return !!noResultBanner.length;
};

const clickBackButtonToMartket = async page => {
  await page.$(".btn-navigation");
  await page.click(".btn-navigation");
};

const buyPlayer = async page => {
  const players = await page.$$(".listFUTItem");
  const lastPlayer = players[players.length - 1];

  await lastPlayer.click();

  await page.waitFor(200);

  await page.click(".buyButton");

  await page.waitFor(180);

  const confirmBuyButtom = await page.$x(`//button[contains(text(), "Ok")]`);

  if (confirmBuyButtom.length > 0) {
    console.log("Buy");
    await confirmBuyButtom[0].click();

    // Check bid status (win or lose)
    await Promise.race([page.waitFor(".expired"), page.waitFor(".won")]);

    const playerWon = await page.$(".won");

    return !!playerWon;
  } else {
    console.log("Confirm buy button nor found", confirmBuyButtom);
    return false;
  }
};

const buyAllPlayer = async (page, playersToBuy) => {
  await page.waitFor(244);
  await searchPlayer(page);

  await Promise.race([
    page.waitFor(".listFUTItem"),
    page.waitForXPath("//h2[contains(text(), 'No results found')]")
  ]);

  const isPlayerNotFound = await isNoResultBanner(page);

  if (isPlayerNotFound) {
    await clickBackButtonToMartket(page);
    await page.waitFor(355);
    await buyAllPlayer(page, playersToBuy);
  } else {
    const isPlayerBuyed = await buyPlayer(page);

    if (isPlayerBuyed) {
      playersBuyed++;
    }

    if (playersBuyed === playersToBuy) {
      console.log(`You have buyed ${playersBuyed} players`);
      return process.exit(0);
    }

    await clickBackButtonToMartket(page);
    await page.waitFor(355);

    await buyAllPlayer(page, playersToBuy);
  }
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--user-data-dir=tmp/chrome-data`]
  });

  const page = await browser.newPage();
  await page.goto("https://www.easports.com/fifa/ultimate-team/web-app/");

  let isUserLogged = false;
  try {
    await page.waitForXPath("//button[contains(text(), 'Transfers')]", {
      timeout: 15000
    });
    isUserLogged = true;
  } catch (e) {
    console.log("You need to login manually and restart the script after that");
    return;
  }

  if (!isUserLogged) {
    return;
  }

  await goToMarketTab(page);
  await goToMarket(page);

  await typePlayerOnInput(page, playerName);
  await selectPlayer(page, playerName);

  await changeQuality(page, playerQuality);

  await setMaxBuyNowPrice(page, maxBuyNowPrice);

  await buyAllPlayer(page, playersToBuy);

  //   await page.screenshot({ path: "example1.png" });
})();
