const puppeteer = require("puppeteer");
const config = require("./config.json");

if (config.email || config.password) {
  throw new Error(
    "You should create your config.json file and provide your email and password"
  );
}

const emailInputId = "email";
const passwordInputId = "password";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.easports.com/fifa/ultimate-team/web-app/");
  await page.waitFor(() =>
    [...document.querySelectorAll("button")].some(i => i.innerText === "Login")
  );

  // TODO add a random here
  await page.waitFor(1500);

  const loginButton = await page.$x("//button[contains(text(), 'Login')]");

  if (loginButton.length > 0) {
    loginButton[0].click();
  } else {
    console.log("No login found");
    await browser.close();
  }

  await page.waitFor(5000);

  await page.type(`input[id=${emailInputId}]`, "user", { delay: 100 });
  await page.type(`input[id=${passwordInputId}]`, "password", { delay: 120 });

  await page.screenshot({ path: "example.png" });
})();
