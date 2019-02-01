const puppeteer = require("puppeteer");

const getRandomAwaitTime = () =>
  Math.floor(Math.random() * (2000 - 1000) + 1000);

const goToMarketTab = async page => {
  await page.waitFor(getRandomAwaitTime());

  const transferMarketTabButton = await page.$x(
    "//button[contains(text(), 'Transfers')]"
  );

  if (transferMarketTabButton.length > 0) {
    transferMarketTabButton[0].click();
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
    goToMarketButton[0].click();
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
  await page.waitFor(getRandomAwaitTime() * 2);

  const playerButton = await page.$x(
    `//span[contains(text(), "${playerName}")]`
  );

  if (playerButton.length > 0) {
    playerButton[0].click();
  } else {
    console.log("Player name not found", playerButton);
  }
};

const searchPlayer = async page => {
  await page.waitFor(getRandomAwaitTime());

  const searchButton = await page.$x("//button[contains(text(), 'Search')]");

  if (searchButton.length > 0) {
    searchButton[0].click();
  } else {
    console.log("No search button found");
  }
};

const changeQuality = async (page, quality = "Special") => {
  await page.waitFor(getRandomAwaitTime());

  const qualityButton = await page.$x("//span[contains(text(), 'Quality')]");

  if (qualityButton.length > 0) {
    qualityButton[0].click();
  } else {
    console.log("No quality button found");
  }

  await page.waitFor(500);

  const qualityOptionButton = await page.$x(
    `//li[contains(text(), '${quality}')]`
  );

  if (qualityOptionButton.length > 0) {
    qualityOptionButton[0].click();
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

  await page.waitFor(250);

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
  await page.click(".btn-navigation");
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

  const playerName = "Armando Izzo";
  const playerQuality = "Special";
  const maxBuyNowPrice = 12000;

  await goToMarketTab(page);
  await goToMarket(page);

  await typePlayerOnInput(page, playerName);
  await selectPlayer(page, playerName);

  await changeQuality(page, playerQuality);

  await setMaxBuyNowPrice(page, maxBuyNowPrice);

  await searchPlayer(page);

  await page.waitFor(300);

  const isPlayerNotFound = await isNoResultBanner(page);

  if (isPlayerNotFound) {
    await clickBackButtonToMartket(page);
  }

  //   await page.screenshot({ path: "example1.png" });
})();
