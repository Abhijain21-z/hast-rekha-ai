import { readFileSync, writeFileSync } from "fs";

const p = "src/lib/i18n.ts";
let s = readFileSync(p, "utf8");

// EN keys
const enRem = `donateReminder: { title: "Donate — Satisfied?", body: "If you are satisfied with this prediction, you may offer a voluntary dakshina. This small support helps us improve this platform further.", btn: "Donate", later: "Later" },
  printGate: { title: "Download PDF Report", body: "Pay \\u20B951 to download your complete prediction as a beautifully formatted PDF report. The download unlocks right after payment.", btn: "Pay \\u20B951 \\u2014 Get PDF", later: "Cancel", paid: "Payment received \\u2014 download your PDF now" },
  donate: { title: "Donate for Improvement"`;

// HI keys
const hiRem = `donateReminder: { title: "\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902 \\u2014 \\u0938\\u0902\\u0924\\u0941\\u0937\\u094D\\u091F \\u0939\\u0941\\u090F?", body: "\\u092F\\u0926\\u093F \\u0906\\u092A \\u0907\\u0938 prediction \\u0938\\u0947 \\u0938\\u0902\\u0924\\u0941\\u0937\\u094D\\u091F \\u0939\\u0948\\u0902 \\u0924\\u094B \\u0936\\u094D\\u0930\\u0926\\u094D\\u0927\\u093E \\u0938\\u0947 \\u0926\\u0915\\u094D\\u0937\\u093F\\u0923\\u093E \\u0930\\u0942\\u092A \\u0926\\u093E\\u0928 \\u0915\\u0930 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u092F\\u0939 \\u091B\\u094B\\u091F\\u093E \\u0938\\u093E \\u0938\\u0939\\u092F\\u094B\\u0917 \\u0907\\u0938 platform \\u0915\\u094B \\u0914\\u0930 \\u0905\\u0927\\u093F\\u0915 \\u0938\\u0941\\u0927\\u093E\\u0930\\u0928\\u0947 \\u092E\\u0947\\u0902 \\u092E\\u0939\\u0924\\u094D\\u0935\\u092A\\u0942\\u0930\\u094D\\u0923 \\u0938\\u093F\\u0926\\u094D\\u0927 \\u0939\\u094B\\u0917\\u093E\\u0964", btn: "\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902", later: "\\u092C\\u093E\\u0926 \\u092E\\u0947\\u0902" },
  printGate: { title: "PDF \\u0930\\u093F\\u092A\\u094B\\u0930\\u094D\\u091F \\u0921\\u093E\\u0909\\u0928\\u0932\\u094B\\u0921 \\u0915\\u0930\\u0947\\u0902", body: "\\u0906\\u092A\\u0915\\u0940 \\u092A\\u0942\\u0930\\u0940 prediction \\u0915\\u0940 \\u0938\\u0941\\u0902\\u0926\\u0930 PDF \\u0930\\u093F\\u092A\\u094B\\u0930\\u094D\\u091F \\u0921\\u093E\\u0909\\u0928\\u0932\\u094B\\u0921 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u20B951 \\u0915\\u093E \\u092D\\u0941\\u0917\\u0924\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902\\u0964 \\u092D\\u0941\\u0917\\u0924\\u093E\\u0928 \\u0915\\u0947 \\u0924\\u0941\\u0930\\u0902\\u0924 \\u092C\\u093E\\u0926 \\u0930\\u093F\\u092A\\u094B\\u0930\\u094D\\u091F \\u0921\\u093E\\u0909\\u0928\\u0932\\u094B\\u0921 \\u0939\\u094B \\u091C\\u093E\\u090F\\u0917\\u0940\\u0964", btn: "\\u20B951 \\u092D\\u0941\\u0917\\u0924\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902 \\u2014 PDF \\u092A\\u093E\\u090F\\u0901", later: "\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902", paid: "\\u092D\\u0941\\u0917\\u0924\\u093E\\u0928 \\u0939\\u0941\\u0906 \\u2014 \\u0905\\u092C PDF \\u0921\\u093E\\u0909\\u0928\\u0932\\u094B\\u0921 \\u0915\\u0930\\u0947\\u0902" },
  donate: { title: "\\u0938\\u0941\\u0927\\u093E\\u0930 \\u0939\\u0947\\u0924\\u0941 \\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902"`;

s = s.replace('donate: { title: "Donate for Improvement"', enRem);
s = s.replace('donate: { title: "सुधार हेतु दान करें"', hiRem);

writeFileSync(p, s);
console.log("keys added:", s.includes("donateReminder"), s.includes("printGate"));
