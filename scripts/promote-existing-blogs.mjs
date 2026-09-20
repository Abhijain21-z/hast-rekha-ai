import { readFileSync, writeFileSync } from "fs";

const p = "src/content/blogs.json";
const blogs = JSON.parse(readFileSync(p, "utf8"));

const promo = {
  h: { en: "Try It Yourself — Free Reading on Hast Rekha AI", hi: "स्वयं आज़माएँ — हस्त रेखा AI पर फ्री रीडिंग" },
  p: [
    {
      en: "Reading about palmistry is the first step — seeing it in your own hand is the real one. Visit https://hastrekhaai.online for a free, instant reading of your palm lines, rashi, nakshatra and lagna. No sign-up, no payment: https://hastrekhaai.online",
      hi: "हस्तरेखा पढ़ना पहला कदम है — अपने हाथ में देखना असली कदम। https://hastrekhaai.online पर जाएँ और पाएँ अपनी हस्तरेखा, राशि, नक्षत्र और लग्न की मुफ्त, तुरंत रीडिंग। न रजिस्ट्रेशन, न भुगतान: https://hastrekhaai.online",
    },
  ],
};

let updated = 0;
for (const b of blogs) {
  if (!b.sections.some((s) => (s.h?.en || "").includes("Hast Rekha AI"))) {
    b.sections.push(promo);
    updated++;
  }
}
writeFileSync(p, JSON.stringify(blogs, null, 1));
console.log("promoted in", updated, "blogs; total", blogs.length);
