// All lesson content lives here. Add new phrases by copying a line.
const LESSONS = [
  { id: "auto", title: "🛺 Auto", phrases: [
    { kn: "ಇಲ್ಲಿಗೆ ಹೋಗಬೇಕು", tr: "Illige hogabeku", en: "I want to go here", hi: "मुझे यहाँ जाना है" },
    { kn: "ಎಷ್ಟು ಆಗುತ್ತೆ?", tr: "Eshtu aagutte?", en: "How much will it be?", hi: "कितना लगेगा?" },
    { kn: "ಮೀಟರ್ ಹಾಕಿ", tr: "Meter haaki", en: "Please turn on the meter", hi: "मीटर चालू कीजिए" },
    { kn: "ಇಲ್ಲೇ ನಿಲ್ಲಿಸಿ", tr: "Ille nillisi", en: "Stop right here", hi: "यहीं रोकिए" },
    { kn: "ಬಲಕ್ಕೆ ತಿರುಗಿ", tr: "Balakke tirugi", en: "Turn right", hi: "दाएँ मुड़िए" },
    { kn: "ಎಡಕ್ಕೆ ತಿರುಗಿ", tr: "Edakke tirugi", en: "Turn left", hi: "बाएँ मुड़िए" },
    { kn: "ನೇರವಾಗಿ ಹೋಗಿ", tr: "Neravaagi hogi", en: "Go straight", hi: "सीधे जाइए" }
  ]},
  { id: "food", title: "🍽️ Restaurant", phrases: [
    { kn: "ಒಂದು ಕಾಫಿ ಕೊಡಿ", tr: "Ondu kaaphi kodi", en: "One coffee, please", hi: "एक कॉफ़ी दीजिए" },
    { kn: "ನೀರು ಕೊಡಿ", tr: "Neeru kodi", en: "Please give water", hi: "पानी दीजिए" },
    { kn: "ಇದು ಖಾರ ಇದೆಯಾ?", tr: "Idu khaara ideyaa?", en: "Is this spicy?", hi: "क्या यह तीखा है?" },
    { kn: "ಬಿಲ್ ಕೊಡಿ", tr: "Bill kodi", en: "Bill, please", hi: "बिल दीजिए" }
  ]},
  { id: "market", title: "🛒 Market", phrases: [
    { kn: "ಇದು ಎಷ್ಟು?", tr: "Idu eshtu?", en: "How much is this?", hi: "यह कितने का है?" },
    { kn: "ತುಂಬಾ ದುಬಾರಿ", tr: "Tumba dubaari", en: "Too expensive", hi: "बहुत महँगा है" },
    { kn: "ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ", tr: "Swalpa kadime maadi", en: "Reduce the price a little", hi: "थोड़ा कम कीजिए" },
    { kn: "ಒಂದು ಕಿಲೋ ಕೊಡಿ", tr: "Ondu kilo kodi", en: "Give me one kilo", hi: "एक किलो दीजिए" }
  ]},
  { id: "hospital", title: "🏥 Hospital", phrases: [
    { kn: "ನನಗೆ ಜ್ವರ ಇದೆ", tr: "Nanage jvara ide", en: "I have a fever", hi: "मुझे बुखार है" },
    { kn: "ನನಗೆ ತಲೆನೋವು ಇದೆ", tr: "Nanage talenovu ide", en: "I have a headache", hi: "मुझे सिरदर्द है" },
    { kn: "ನನಗೆ ಹೊಟ್ಟೆ ನೋವು ಇದೆ", tr: "Nanage hotte novu ide", en: "I have a stomach ache", hi: "मुझे पेट दर्द है" },
    { kn: "ಡಾಕ್ಟರ್ ಎಲ್ಲಿದ್ದಾರೆ?", tr: "Doctor elliddaare?", en: "Where is the doctor?", hi: "डॉक्टर कहाँ हैं?" }
  ]}
];

// Scripted role-play (works offline, no API key). Each node: what the driver says + your choices.
const ROLEPLAY = {
  start: { kn: "ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?", tr: "Elli hogabeku?", en: "Where do you want to go?",
    choices: [
      { kn: "ಇಲ್ಲಿಗೆ ಹೋಗಬೇಕು", tr: "Illige hogabeku", en: "I want to go here", next: "meter" },
      { kn: "ನೀರು ಕೊಡಿ", tr: "Neeru kodi", en: "Give water (wrong reply!)", next: "wrong" } ] },
  meter: { kn: "ಮೀಟರ್ ಮೇಲೆ ಇಪ್ಪತ್ತು ರೂಪಾಯಿ ಜಾಸ್ತಿ ಕೊಡಿ.", tr: "Meter mele ippattu roopaayi jaasti kodi", en: "Pay 20 rupees over the meter.",
    choices: [
      { kn: "ಮೀಟರ್ ಹಾಕಿ", tr: "Meter haaki", en: "Please turn on the meter", next: "ok" },
      { kn: "ಸರಿ", tr: "Sari", en: "Okay", next: "ok" } ] },
  wrong: { kn: "ಏನು? ಅರ್ಥ ಆಗಲಿಲ್ಲ.", tr: "Enu? Artha aagalilla.", en: "What? I didn't understand.", choices: [ { kn: "ಇಲ್ಲಿಗೆ ಹೋಗಬೇಕು", tr: "Illige hogabeku", en: "I want to go here", next: "meter" } ] },
  ok: { kn: "ಸರಿ, ಕುಳಿತುಕೊಳ್ಳಿ.", tr: "Sari, kulitukolli.", en: "Okay, please sit.", choices: [], end: true }
};
