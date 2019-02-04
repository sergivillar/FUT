const puppeteer = require("puppeteer");

const MAX_NUMBER_ITERATIONS = 70;
let playersBuyed = 0;
let iteration = 0;
const playerName = "Omar Mascarell";
const playerQuality = "";
const playerMedia = 79;
const maxBuyNowPrice = 400;
const minBuyNowPrice = 0;
const playersToBuy = 3;

const getRandomAwaitTime = (min = 500, max = 1500) =>
  Math.floor(Math.random() * (max - min) + min);

const goToMarketTab = async page => {
  console.log("Go to market section");
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
  console.log("Go to market");
  // TODO, sometimes this does not works
  await page.waitFor(getRandomAwaitTime());

  const goToMarketButton = await page.waitForXPath(
    "//h1[contains(text(), 'Search the Transfer Market')]"
  );
  await goToMarketButton.asElement().click();
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

  const selectPlayerButton = await page.waitForXPath(
    `//span[contains(text(), "${playerName}")]`
  );
  await selectPlayerButton.asElement().click();
};

const searchPlayer = async page => {
  const searchButton = await page.waitForXPath(
    "//button[contains(text(), 'Search')]"
  );
  await searchButton.asElement().click();
};

const changeQuality = async (page, quality) => {
  await page.waitFor(getRandomAwaitTime());

  const qualityButton = await page.waitForXPath(
    "//span[contains(text(), 'Quality')]"
  );
  await qualityButton.asElement().click();

  await page.waitFor(500);

  const qualityOptionButton = await page.waitForXPath(
    `//li[contains(text(), '${quality}')]`
  );
  await qualityOptionButton.asElement().click();
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

const setMinBuyNowPrice = async (page, minPrice = 0) => {
  await page.waitFor(getRandomAwaitTime());

  const valueInputs = await page.$$(".numericInput");

  if (valueInputs.length !== 4) {
    console.log("There's no money inputs. Somthing went wrong");
    return;
  }

  const minBuyNowPriceButton = valueInputs[2];

  minBuyNowPriceButton.click();

  await page.waitFor(200);

  await minBuyNowPriceButton.type(String(minPrice), {
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
  await page.waitFor(200);
  await page.$(".btn-navigation");
  await page.click(".btn-navigation");
};

const buyPlayer = async page => {
  const players = !playerMedia
    ? await page.$$(".listFUTItem")
    : await page.$x(
        `//li[contains(@class, "listFUTItem") and .//div[contains(text() , "${playerMedia}")]]`
      );

  const lastPlayer =
    players[Math.floor(Math.random() * (players.length - 0) + 0)];

  await lastPlayer.click();

  await page.waitFor(200);

  await page.click(".buyButton");

  await page.waitFor(180);

  const confirmBuyButtom = await page.$x(`//button[contains(text(), "Ok")]`);

  if (confirmBuyButtom.length > 0) {
    console.log("Try to buy");
    await confirmBuyButtom[0].click();

    // Check bid status (win or lose)
    await Promise.race([page.waitFor(".expired"), page.waitFor(".won")]);

    const errorStatus = await page.$x(
      `//p[contains(text(), "Bid status changed, auction data will be updated.")]`
    );

    if (errorStatus.length > 0) {
      console.log("Status out of date");
      await page.waitFor(150);
      return false;
    }

    const playerWon = await page.$(".won");

    return !!playerWon;
  } else {
    console.log("Confirm buy button nor found", confirmBuyButtom);
    return false;
  }
};

const buyAllPlayer = async (page, playersToBuy) => {
  console.log(`Attempt number ${iteration++}`);

  if (iteration > MAX_NUMBER_ITERATIONS) {
    console.log("Max. number of iterations exceeded ", MAX_NUMBER_ITERATIONS);
    console.log("Total players buyed :", playersBuyed);
    return process.exit(0);
  }

  await page.waitFor(getRandomAwaitTime(300, 400));
  await searchPlayer(page);

  await Promise.race([
    page.waitFor(".listFUTItem"),
    page.waitForXPath("//h2[contains(text(), 'No results found')]")
  ]);

  const isPlayerNotFound = await isNoResultBanner(page);
  await page.waitFor(getRandomAwaitTime(250, 350));

  if (isPlayerNotFound) {
    await clickBackButtonToMartket(page);
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

  try {
    await page.waitForXPath("//button[contains(text(), 'Transfers')]", {
      timeout: 20000
    });
  } catch (e) {
    console.log("You need to login manually and restart the script after that");
    return;
  }

  await goToMarketTab(page);
  await goToMarket(page);

  await typePlayerOnInput(page, playerName);
  await selectPlayer(page, playerName);

  if (!!playerQuality) {
    await changeQuality(page, playerQuality);
  }

  if (!!minBuyNowPrice) {
    await setMinBuyNowPrice(page, minBuyNowPrice);
  }
  if (!!maxBuyNowPrice) {
    await setMaxBuyNowPrice(page, maxBuyNowPrice);
  }

  await buyAllPlayer(page, playersToBuy);

  //   await page.screenshot({ path: "example1.png" });
})();
