import puppeteer from "puppeteer";
import path from "path";
import { generateBadgeImageUrl, log } from "@lib/utils/generic";
import { isProd } from "@config/config";

export const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: {
    width: isProd ? 800 : 480,
    height: isProd ? 480 : 800,
  },
  args: [
    "--start-maximized",
    isProd ? "--kiosk" : "",
    isProd ? `--window-size=800,480` : `--window-size=480,800`,
  ],
  ignoreDefaultArgs: ["--enable-automation"],
  executablePath: isProd ? "/usr/bin/chromium-browser" : undefined,
});
export const page = await browser.newPage();

export const setPageBadge = (id: string) => {
  const imgSrc = generateBadgeImageUrl(id);

  try {
    page.$eval(
      "#badge-image",
      (e, imgSrc, isProd) => {
        const element = e as HTMLInputElement;

        element.src = imgSrc;
        if (isProd) element.style.transform = "rotate(-90deg)";
      },
      imgSrc,
      isProd,
    );
  } catch (err) {
    log(err);
  }
};

export default async () => {
  const indexPath = path.resolve(path.join(__dirname, "../../build/static/index.html"));

  await page.goto(`file://${indexPath}`);
};
