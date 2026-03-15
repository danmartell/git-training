const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const BASE_URL = process.env.QA_URL || "http://localhost:3000";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const sections = [
  { id: "hero", selector: "section:first-of-type" },
  { id: "about", selector: "#about" },
  { id: "book", selector: "#book" },
  { id: "saas-academy", selector: "#saas-academy" },
  { id: "speaking", selector: "#speaking" },
  { id: "investing", selector: "#investing" },
  { id: "content", selector: "#content" },
  { id: "footer", selector: "footer" },
];

async function checkOverflow(page) {
  const issues = await page.evaluate(() => {
    const problems = [];
    const docWidth = document.documentElement.scrollWidth;
    const viewportWidth = window.innerWidth;

    if (docWidth > viewportWidth) {
      problems.push(
        `Page has horizontal overflow: ${docWidth}px > ${viewportWidth}px`
      );
    }

    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > viewportWidth + 2) {
        const id = el.id || el.className?.toString().slice(0, 40) || el.tagName;
        problems.push(`Element overflows right: ${id} (${Math.round(rect.right)}px)`);
      }
    });

    return problems.slice(0, 10);
  });

  return issues;
}

async function run() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log(`\n🔍 QA Testing: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let totalIssues = 0;

  for (const vp of viewports) {
    console.log(`\n📐 Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log("─".repeat(50));

    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for animations to settle
    await new Promise((r) => setTimeout(r, 2000));

    // Full page screenshot
    const fullPath = path.join(SCREENSHOT_DIR, `full-${vp.name}.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`  ✅ Full page → ${fullPath}`);

    // Section screenshots
    for (const section of sections) {
      try {
        const el = await page.$(section.selector);
        if (el) {
          const ssPath = path.join(
            SCREENSHOT_DIR,
            `${section.id}-${vp.name}.png`
          );
          await el.screenshot({ path: ssPath });
          console.log(`  ✅ ${section.id} → ${ssPath}`);
        } else {
          console.log(`  ⚠️  ${section.id} — selector not found`);
        }
      } catch (err) {
        console.log(`  ❌ ${section.id} — ${err.message}`);
      }
    }

    // Check for overflow issues
    const issues = await checkOverflow(page);
    if (issues.length > 0) {
      console.log(`\n  ⚠️  Layout issues (${vp.name}):`);
      issues.forEach((issue) => console.log(`     - ${issue}`));
      totalIssues += issues.length;
    } else {
      console.log(`\n  ✅ No layout overflow detected`);
    }

    await page.close();
  }

  await browser.close();

  console.log("\n" + "═".repeat(50));
  if (totalIssues > 0) {
    console.log(`⚠️  Found ${totalIssues} layout issue(s). Check above.`);
  } else {
    console.log("✅ All QA checks passed!");
  }
  console.log(`📸 Screenshots saved to ${SCREENSHOT_DIR}\n`);
}

run().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(1);
});
