import puppeteer from "puppeteer";
import path from "path";
import { generateBadgeImageUrl, log } from "@lib/utils/generic";
import { isProd } from "@config/config";

export const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--start-maximized", isProd ? "--kiosk" : ""],
});
export const page = await browser.newPage();

export const setPageBadge = (id: string) => {
  const imgSrc = generateBadgeImageUrl(id);

  try {
    page.$eval(
      "#badge-image",
      (e, imgSrc) => {
        const element = e as HTMLInputElement;

        element.src = imgSrc;
      },
      imgSrc,
    );
  } catch (err) {
    log(err);
  }
};

export default async () => {
  page.once("domcontentloaded", () => setPageBadge(""));

  const indexPath = path.resolve(path.join(__dirname, "../../build/static/index.html"));

  await page.goto(indexPath);
};
