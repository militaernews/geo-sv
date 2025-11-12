import puppeteer from "puppeteer";
const actions = {
  default: async ({ request }) => {
    console.log("captureWithHtml2Canvass");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://geo-mn.vercel.app", { waitUntil: "networkidle0" });
    const element = await page.$("#container");
    await element?.screenshot({ path: "div-with-iframe.png" });
    console.log("screenshot captured");
    await browser.close();
    return new Response("ok");
  }
};
export {
  actions
};
