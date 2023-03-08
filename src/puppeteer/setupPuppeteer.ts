import puppeteer from "puppeteer";
import path from "path";
import { generateBadgeImageUrl, log } from "@lib/utils/generic";
import { isProd } from "@config/config";

export const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: {
    width: 480,
    height: 800,
  },
  args: ["--start-maximized", isProd ? "--kiosk" : "", `--window-size=480,800`],
  ignoreDefaultArgs: ["--enable-automation"],
  executablePath: isProd ? "/usr/bin/chromium-browser" : undefined,
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
  const indexPath = path.resolve(path.join(__dirname, "../../build/static/index.html"));

  await page.goto(`file://${indexPath}`);
};
