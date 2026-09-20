import { readFileSync, writeFileSync } from "fs";

const p = "src/content/legal.json";
const legal = JSON.parse(readFileSync(p, "utf8"));

legal.terms = {
  title: { en: "Terms of Service", hi: "सेवा की शर्तें" },
  updated: { en: "Last updated: 20 September 2026", hi: "अंतिम अद्यतन: 20 सितंबर 2026" },
  intro: {
    en: "Welcome to Hast Rekha AI (https://hastrekhaai.online). By using this website, you agree to these Terms of Service. Please read them carefully before using our astrology and palmistry services.",
    hi: "हस्त रेखा AI (https://hastrekhaai.online) में आपका स्वागत है। इस वेबसाइट का उपयोग करके आप इन सेवा शर्तों से सहमत होते हैं। कृपया हमारी ज्योतिष और हस्तरेखा सेवाओं का उपयोग करने से पहले इन्हें ध्यानपूर्वक पढ़ें।",
  },
  sections: [
    {
      h: { en: "Nature of Services", hi: "सेवाओं की प्रकृति" },
      p: [
        {
          en: "Hast Rekha AI provides astrology and palmistry content for entertainment and self-reflection purposes only. Our readings are generated using rule-based traditional Vedic astrology calculations and are not a substitute for professional advice of any kind — medical, legal, financial, or psychological.",
          hi: "हस्त रेखा AI केवल मनोरंजन और आत्मचिंतन के उद्देश्य से ज्योतिष और हस्तरेखा सामग्री प्रदान करता है। हमारी रीडिंग पारंपरिक वैदिक ज्योतिष गणनाओं पर आधारित हैं और किसी भी प्रकार की पेशेवर सलाह — चिकित्सा, कानूनी, वित्तीय या मनोवैज्ञानिक — का विकल्प नहीं हैं।",
        },
        {
          en: "Predictions and readings should never be used to make important life decisions. Always consult qualified professionals for such matters.",
          hi: "महत्वपूर्ण जीवन निर्णयों के लिए रीडिंग का उपयोग कभी न करें। ऐसे मामलों में हमेशा योग्य विशेषज्ञों से परामर्श करें।",
        },
      ],
    },
    {
      h: { en: "Eligibility", hi: "पात्रता" },
      p: [
        {
          en: "You must be at least 13 years old to use this website. By using the service, you confirm that you meet this age requirement and that the information you provide (name, birth details) is accurate to the best of your knowledge.",
          hi: "इस वेबसाइट का उपयोग करने के लिए आपकी आयु कम से कम 13 वर्ष होनी चाहिए। सेवा का उपयोग करके आप पुष्टि करते हैं कि आप यह आयु आवश्यकता पूरी करते हैं और आपकी दी गई जानकारी (नाम, जन्म विवरण) आपकी जानकारी के अनुसार सही है।",
        },
      ],
    },
    {
      h: { en: "Accounts", hi: "खाते" },
      p: [
        {
          en: "You may use the free reading service without an account. If you create an account, you are responsible for keeping your login credentials secure and for all activity that occurs under your account. Notify us immediately of any unauthorized use.",
          hi: "आप बिना खाते के भी फ्री रीडिंग सेवा का उपयोग कर सकते हैं। यदि आप खाता बनाते हैं, तो आप अपने लॉगिन क्रेडेंशियल सुरक्षित रखने और आपके खाते के तहत होने वाली सभी गतिविधियों के लिए जिम्मेदार हैं। अनधिकृत उपयोग की सूचना तुरंत दें।",
        },
      ],
    },
    {
      h: { en: "Acceptable Use", hi: "उचित उपयोग" },
      p: [
        {
          en: "You agree not to: misuse or attempt to disrupt the website; scrape, copy, or redistribute our content or reports for commercial purposes; upload unlawful, harmful, or inappropriate palm images; reverse engineer, decompile, or attempt to extract the source code or calculation logic of the service.",
          hi: "आप सहमत होते हैं कि आप: वेबसाइट का दुरुपयोग या बाधा नहीं पहुँचाएँगे; हमारी सामग्री या रिपोर्ट को व्यावसायिक उद्देश्यों के लिए स्क्रैप, कॉपी या पुनर्वितरित नहीं करेंगे; अवैध, हानिकारक या अनुचित हथेली चित्र अपलोड नहीं करेंगे; सेवा का सोर्स कोड या गणना लॉजिक रिवर्स इंजीनियर नहीं करेंगे।",
        },
      ],
    },
    {
      h: { en: "Payments and Premium Services", hi: "भुगतान और प्रीमियम सेवाएँ" },
      p: [
        {
          en: "Certain advanced features may require payment. Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes. Payments are processed through UPI. All paid reports are delivered digitally and, given their instant nature, are generally non-refundable once generated. If you were charged but did not receive your report, contact us at abhijain.technical@gmail.com and we will resolve it.",
          hi: "कुछ उन्नत सुविधाओं के लिए भुगतान आवश्यक हो सकता है। कीमतें भारतीय रुपये (INR) में प्रदर्शित होती हैं और लागू कर सहित हैं। भुगतान UPI के माध्यम से किया जाता है। सभी सशुल्क रिपोर्ट डिजिटल रूप से वितरित होती हैं और उनकी त्वरित प्रकृति के कारण एक बार बनने के बाद सामान्यतः गैर-धनवापसी योग्य होती हैं। यदि भुगतान हुआ परंतु रिपोर्ट नहीं मिली, तो abhijain.technical@gmail.com पर संपर्क करें।",
        },
      ],
    },
    {
      h: { en: "Intellectual Property", hi: "बौद्धिक संपदा" },
      p: [
        {
          en: "All content on Hast Rekha AI — including text, graphics, logos, calculation logic, and design — is owned by us or licensed to us and is protected by applicable intellectual property laws. You may view and print your personal readings for your own use, but you may not redistribute them commercially.",
          hi: "हस्त रेखा AI की सारी सामग्री — टेक्स्ट, ग्राफ़िक्स, लोगो, गणना लॉजिक और डिज़ाइन — हमारी स्वामित्व या लाइसेंस प्राप्त है और लागू बौद्धिक संपदा कानूनों द्वारा संरक्षित है। आप अपनी व्यक्तिगत रीडिंग को निजी उपयोग के लिए देख और प्रिंट सकते हैं, परंतु व्यावसायिक पुनर्वितरण नहीं कर सकते।",
        },
      ],
    },
    {
      h: { en: "Third-Party Services and Advertising", hi: "तृतीय-पक्ष सेवाएँ और विज्ञापन" },
      p: [
        {
          en: "This website may display advertisements served by third parties, including Google AdSense. These services may use cookies to show you relevant ads. We are not responsible for the content of third-party advertisements or websites linked from them. See our Privacy Policy for details on cookies and advertising.",
          hi: "यह वेबसाइट Google AdSense सहित तृतीय-पक्ष विज्ञापन प्रदर्शित कर सकती है। ये सेवाएँ प्रासंगिक विज्ञापन दिखाने के लिए कुकीज़ का उपयोग कर सकती हैं। हम तृतीय-पक्ष विज्ञापनों या उनके लिंक की सामग्री के लिए जिम्मेदार नहीं हैं। कुकीज़ और विज्ञापन का विवरण हमारी गोपनीयता नीति देखें।",
        },
      ],
    },
    {
      h: { en: "Limitation of Liability", hi: "दायित्व सीमा" },
      p: [
        {
          en: 'The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Hast Rekha AI and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or reliance on any reading, prediction, or content.',
          hi: "सेवा \"जैसी है\" आधार पर, बिना किसी वारंटी के प्रदान की जाती है। कानून द्वारा अनुमत अधिकतम सीमा तक, हस्त रेखा AI और उसके संचालक वेबसाइट के उपयोग या किसी रीडिंग, भविष्यवाणी या सामग्री पर निर्भरता से उत्पन्न किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामी क्षति के लिए उत्तरदायी नहीं होंगे।",
        },
      ],
    },
    {
      h: { en: "Changes to These Terms", hi: "शर्तों में परिवर्तन" },
      p: [
        {
          en: 'We may update these Terms of Service from time to time. Changes take effect when posted on this page with a new "last updated" date. Continued use of the website after changes constitutes acceptance of the updated terms.',
          hi: "हम समय-समय पर इन सेवा शर्तों को अद्यतन कर सकते हैं। परिवर्तन इस पृष्ठ पर नई \"अंतिम अद्यतन\" तिथि के साथ पोस्ट होने पर प्रभावी होंगे। परिवर्तनों के बाद वेबसाइट का निरंतर उपयोग अद्यतन शर्तों की स्वीकृति माना जाएगा।",
        },
      ],
    },
    {
      h: { en: "Contact", hi: "संपर्क" },
      p: [
        {
          en: "For questions about these Terms, contact us at abhijain.technical@gmail.com or through the contact page at https://hastrekhaai.online/contact.",
          hi: "इन शर्तों के बारे में प्रश्नों के लिए abhijain.technical@gmail.com पर या https://hastrekhaai.online/contact संपर्क पृष्ठ के माध्यम से हमसे संपर्क करें।",
        },
      ],
    },
  ],
};

writeFileSync(p, JSON.stringify(legal, null, 1));
console.log("terms added; keys:", Object.keys(legal));
