import { readFileSync, writeFileSync } from "fs";

const p = "src/content/blogs.json";
const blogs = JSON.parse(readFileSync(p, "utf8"));

const promo = {
  h: { en: "Gupt Khazana — Dhandayak Tantrik Prayog (Special Book)", hi: "गुप्त खजाना — धनदायक तांत्रिक प्रयोग (विशेष पुस्तक)" },
  p: [
    {
      en: "This secret book has come before you — it means the universe also wants all problems to end from your life now. Many people will ignore this book, because getting this book is not in everyone's destiny. Money-related tantric practices, sadhana methods and rules — a special compilation of traditional remedies for stuck money, debt freedom and business growth. Read the book: https://superprofile.bio/vp/💰-धनदायक-तांत्रिक-प्रयोग-अटका-धन--कर्ज-मुक्ति-व-व्यापार-वृद्धि-गुप्त-खजाना",
      hi: "यह गुप्त पुस्तक आपके सामने आई है — इसका तात्पर्य है कि ब्रह्मांड भी चाहता है कि अब आपके जीवन से सभी समस्याएँ समाप्त हों। कई लोग इस पुस्तक को ignore कर देंगे, क्योंकि यह पुस्तक पाना सबके भाग्य में नहीं होता। धन-संबंधी तांत्रिक प्रयोग, साधना-विधियाँ और नियम — अटका धन, कर्ज मुक्ति और व्यापार वृद्धि के पारंपरिक उपायों का विशेष संकलन। पुस्तक देखें: https://superprofile.bio/vp/💰-धनदायक-तांत्रिक-प्रयोग-अटका-धन--कर्ज-मुक्ति-व-व्यापार-वृद्धि-गुप्त-खजाना",
    },
  ],
};

let updated = 0;
for (const b of blogs) {
  if (!b.sections.some((s) => (s.h?.hi || "").includes("धनदायक तांत्रिक"))) {
    b.sections.push(promo);
    updated++;
  }
}
writeFileSync(p, JSON.stringify(blogs, null, 1));
console.log("upay promo added to", updated, "blogs; total", blogs.length);
