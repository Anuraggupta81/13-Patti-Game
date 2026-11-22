/**
 * Text of the Privacy Notice and Terms of Use. Copied from:
 *   13_Patti_Privacy_Notice.pdf and 13_Patti_Terms_of_Use.pdf (Version 1.0, 22 November 2026).
 * Change the text here only together with the PDFs. Bump LEGAL_VERSION when either changes,
 * so players are asked to accept again.
 */

export const LEGAL_VERSION = '1.0';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  effective: string;
  intro: string[];
  sections: LegalSection[];
}

export const PRIVACY_NOTICE: LegalDocument = {
  title: 'Privacy Notice',
  subtitle: '13 Patti',
  effective: 'Effective date: 22 November 2026 | Version 1.0',
  intro: [
    'This Privacy Notice explains how VG Tech Consulting PTY LTD (ABN 89 689 058 795) ("we", "us", "our") handles personal information when you play 13 Patti (the "Game"). We handle personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles and, for players in India, the Digital Personal Data Protection Act, 2023 (see section 12).',
    'The Game is a free card game played for entertainment with virtual chips only. It is available only in Australia and India, to players aged 18 or over. You can read this notice at any time from the Game\'s Settings > Privacy Notice menu.',
  ],
  sections: [
    {
      heading: '1. The short version',
      bullets: [
        'You play as a guest. We do not ask for your name, email address, phone number or any account details.',
        'Your chips, settings and progress are stored on your device, not on our servers.',
        'The Game shows ads provided by Google AdMob. Google collects some device information to show and measure ads.',
        'We do not sell personal information, and no real money is ever involved in the Game.',
      ],
      paragraphs: [
        'Because the Game has no accounts, you play anonymously. We only learn who you are if you choose to contact us.',
      ],
    },
    {
      heading: '2. Information we collect',
      paragraphs: [
        '2.1 Information stored on your device. Your virtual chip balance, game progress, statistics and settings (such as sound and language) are stored only on your device. We cannot see this information. It is deleted when you clear the Game\'s data or uninstall the Game. The Game has no accounts and does not ask you for any personal information.',
        '2.2 Information collected for advertising. When the Game shows ads, our advertising partner Google AdMob collects information from your device, including:',
      ],
      bullets: [
        'your device\'s advertising ID (a resettable identifier provided by Android);',
        'your IP address and approximate location derived from it (country or city, not precise location);',
        'device type, operating system, language and app version; and',
        'how you interact with ads (for example, which ads were shown or tapped).',
      ],
    },
    {
      heading: '2.2 (continued)',
      paragraphs: [
        'Google uses this information to show, measure and improve ads and to prevent fraud, under Google\'s own Privacy Policy (policies.google.com/privacy). We do not receive your advertising ID or any information that identifies you; we receive only summary reports, such as how many ads were shown.',
        '2.3 Information you send us. If you contact us (for example at vgtechconsultingptyltd@gmail.com), we receive your email address and anything you include in your message. We use it only to respond to you.',
        '2.4 What we do not collect. The Game does not collect your name, contacts, photos, precise location, payment details or any information from your camera or microphone. The Game has no chat or messaging feature, and does not use crash-reporting or analytics tools.',
      ],
    },
    {
      heading: '3. How we use information',
      bullets: [
        'to run the Game and keep your progress on your device;',
        'to show ads, which keep the Game free (through Google AdMob);',
        'to respond to your questions and requests; and',
        'to comply with the law.',
      ],
      paragraphs: [
        'We do not use information to make automated decisions about you, and we do not use it to encourage real-money gambling.',
      ],
    },
    {
      heading: '4. Ads and your choices',
      bullets: [
        'Consent: when you first open the Game, we ask for your choice about personalised ads. You can change it at any time in Settings > Ad preferences.',
        'Non-personalised ads: if you do not consent, you will still see ads, but they will not be based on your interests.',
        'Reset or delete your advertising ID: on Android, go to Settings > Google > Ads (or Settings > Privacy > Ads) to reset or delete it. Deleting it stops apps from using it for personalised ads.',
        'No gambling ads: we configure AdMob to block ads for gambling, betting and real-money gaming.',
      ],
    },
    {
      heading: '5. Age restriction',
      paragraphs: [
        'The Game is only for people aged 18 or over, because it simulates a card game played with chips. We ask you to confirm your age when you first open the Game. The Game is not directed to children, and our ad settings tell Google that the Game is not intended for children. If you believe a child is using the Game, please contact us.',
      ],
    },
    {
      heading: '6. Who we share information with',
      bullets: [
        'Google (AdMob), which provides the Game\'s ads;',
        'Google Play, which distributes the Game and provides download and crash statistics to us under Google\'s terms; and',
        'government authorities or law enforcement, where required or authorised by law.',
      ],
      paragraphs: ['We do not sell or rent personal information.'],
    },
    {
      heading: '7. Information processed outside Australia and India',
      paragraphs: [
        'Google processes advertising information in the United States and other countries where it operates. Google is bound by its own privacy commitments and data processing terms. Overseas laws may differ from Australian and Indian law. Under the Privacy Act, we take reasonable steps to make sure our providers handle information consistently with the Australian Privacy Principles.',
      ],
    },
    {
      heading: '8. Security',
      paragraphs: [
        'Information sent between the Game and our providers is encrypted in transit. Because your game data stays on your device, please keep your device secure, for example with a screen lock. No system is completely secure, but we and our providers take reasonable steps to protect information.',
        'If a data breach involving personal information we hold is likely to result in serious harm, we will notify affected people and the Office of the Australian Information Commissioner under the Notifiable Data Breaches scheme. For players in India, we will notify affected people and the Data Protection Board of India as required by the DPDP Act and Rules.',
      ],
    },
    {
      heading: '9. How long information is kept',
      bullets: [
        'On your device: until you clear the Game\'s data or uninstall the Game;',
        'Advertising data: kept by Google under its retention policies (see policies.google.com/technologies/retention); and',
        'Emails you send us: kept for up to 7 years after your request has been dealt with, so we have a record of it, then deleted.',
      ],
    },
    {
      heading: '10. Your rights',
      paragraphs: [
        'You can ask us for access to, or correction or deletion of, personal information we hold about you. Because we do not hold an account or your contact details, in most cases we hold no personal information that identifies you. You can delete all Game data at any time by clearing the Game\'s data or uninstalling it, and manage advertising data using your advertising ID settings (section 4) and your Google account. We will respond to requests within 30 days.',
      ],
    },
    {
      heading: '11. Complaints',
      paragraphs: [
        'Please contact us first at vgtechconsultingptyltd@gmail.com. We will acknowledge your complaint within 7 days and aim to resolve it within 30 days. If you are not satisfied, you can complain to:',
      ],
      bullets: [
        'Australia: the Office of the Australian Information Commissioner - www.oaic.gov.au, phone 1300 363 992; or',
        'India: the Data Protection Board of India, after first using the grievance process in section 12.',
      ],
    },
    {
      heading: '12. Additional information for players in India',
      paragraphs: [
        'For players in India, we are the "Data Fiduciary" under the Digital Personal Data Protection Act, 2023 and its Rules, as they come into force. In addition to the rest of this notice:',
      ],
      bullets: [
        'Consent: where consent is needed (for example for personalised ads), we ask for it clearly before processing, and you can withdraw it as easily as you gave it, in Settings > Ad preferences;',
        'Your rights: you can ask for a summary of your personal information, its correction or erasure, and nominate another person to exercise your rights; and you have the right to grievance redressal;',
        'Children: the Game is for players aged 18 or over, and we do not knowingly process the personal information of children or track or target ads at them;',
        'Responses: we will respond to requests and grievances within 90 days;',
        'Language: you can ask for this notice in any language listed in the Eighth Schedule to the Constitution of India; and',
        'Your duties: when contacting us, you must provide accurate information, must not impersonate anyone, and must not make false or frivolous complaints.',
      ],
    },
    {
      heading: '12. (continued)',
      paragraphs: ['Grievance Officer, VG Tech Consulting PTY LTD\nEmail: vgtechconsultingptyltd@gmail.com'],
    },
    {
      heading: '13. Changes to this notice',
      paragraphs: [
        'We may update this notice. The latest version is always available in the Game, in Settings > Privacy Notice. If we make significant changes, we will tell you in the Game before they take effect.',
      ],
    },
    {
      heading: '14. Contact us',
      paragraphs: [
        'VG Tech Consulting PTY LTD\nAddress: 25 Carnegie Road, Point Cook, Victoria 3030, Australia\nEmail: vgtechconsultingptyltd@gmail.com',
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocument = {
  title: 'Terms of Use',
  subtitle: '13 Patti',
  effective: 'Effective date: 22 November 2026 | Version 1.0',
  intro: [
    'These Terms of Use ("Terms") apply to 13 Patti (the "Game"), provided by VG Tech Consulting PTY LTD (ABN 89 689 058 795) ("we", "us", "our"). When you first open the Game, we ask you to confirm that you are 18 or over and to accept these Terms and our Privacy Notice. By accepting, or by continuing to play, you agree to them. If you do not agree, please do not play. You can read these Terms at any time from the Game\'s Settings > Terms of Use menu.',
  ],
  sections: [
    {
      heading: '1. Entertainment only: no real money',
      paragraphs: ['The Game is a free card game played for entertainment only. It is not gambling.'],
      bullets: [
        'The Game uses virtual chips. Virtual chips have no monetary value.',
        'Virtual chips cannot be bought, sold, transferred, exchanged or redeemed for money, prizes, goods, services or anything else of value, inside or outside the Game.',
        'No stake is paid to play, and there are no cash or other real-world prizes.',
        'Winning in the Game does not mean you would win at real-money gambling.',
      ],
      // Paragraphs after the list
    },
    {
      heading: '1. (continued)',
      paragraphs: [
        'The Game is designed as an online social game played for entertainment. It is not intended to be an online money game under India\'s Promotion and Regulation of Online Gaming Act, 2025, or an interactive gambling service under Australia\'s Interactive Gambling Act 2001, and must not be used as one.',
        'The Game does not link to, promote or encourage real-money gambling.',
      ],
    },
    {
      heading: '2. Who can play',
      bullets: [
        'You must be 18 years or older.',
        'You must be located in Australia or India. The Game is not offered in other countries.',
        'You must not play where doing so would break any law that applies to you.',
      ],
    },
    {
      heading: '3. Your licence to play',
      paragraphs: [
        'We give you a personal, non-exclusive, non-transferable, revocable licence to download the Game and play it on devices you own or control, for your own non-commercial entertainment. All rights not expressly granted are reserved.',
      ],
    },
    {
      heading: '4. Virtual chips and game data',
      bullets: [
        'Your chips, progress and settings are stored on your device. They will be lost if you clear the Game\'s data, uninstall the Game or change devices, and we cannot recover them.',
        'We may give, reset, adjust or remove virtual chips where reasonably necessary, for example to balance the Game, fix errors or deal with a breach of these Terms.',
        'Virtual chips are licensed to you for use in the Game only; you do not own them.',
      ],
    },
    {
      heading: '5. Fair play',
      paragraphs: ['You must not:'],
      bullets: [
        'sell, trade or offer virtual chips or game progress for money or anything of value, or use the Game as part of any betting or wager, inside or outside the Game;',
        'use cheats, bots, automation, modified versions of the Game or any software that interferes with it;',
        'copy, modify, reverse engineer or decompile the Game, except as allowed by law;',
        'use the Game for any unlawful purpose; or',
        'remove or obscure any notices, ads or age warnings in the Game.',
      ],
    },
    {
      heading: '6. Ads',
      paragraphs: [
        'The Game is free because it shows ads provided by Google AdMob. Ads are provided by third parties, and we are not responsible for the products or services they promote. We configure the Game to block ads for gambling, betting and real-money gaming. Your choices about personalised ads are explained in our Privacy Notice.',
      ],
    },
    {
      heading: '7. Play responsibly',
      paragraphs: [
        'The Game is meant to be fun. Take regular breaks. If you are worried about gambling, or about the time you spend playing games, free and confidential help is available:',
      ],
      bullets: [
        'Australia: Gambling Help Online - www.gamblinghelponline.org.au, phone 1800 858 858 (24/7);',
        'India: Tele-MANAS mental health helpline - phone 14416 (24/7).',
      ],
    },
    {
      heading: '8. Intellectual property',
      paragraphs: [
        'We (or our licensors) own all rights in the Game, including its software, design, artwork, sounds and content. "13 Patti" is a traditional card game; our version of it, and its look and content, are our property. The Game may include third-party software (such as Google\'s advertising software), which is provided under its own licence terms. If you send us feedback or suggestions, we may use them without any obligation to you.',
      ],
    },
    {
      heading: '9. Updates and availability',
      paragraphs: [
        'We may update, change, suspend or discontinue the Game, or any feature, where reasonably necessary (for example to fix problems, improve the Game, or comply with the law or Google Play\'s requirements). Where practical, we will give you notice in the Game before a significant change or before discontinuing the Game. Some updates may be required to keep playing. We do not guarantee the Game will always be available or error-free.',
      ],
    },
    {
      heading: '10. Consumer law',
      paragraphs: [
        'Nothing in these Terms excludes, restricts or modifies any right or remedy, guarantee, warranty or condition under the Australian Consumer Law or any other law that cannot lawfully be excluded. Players in India also keep any rights under the Consumer Protection Act, 2019 that cannot be excluded.',
      ],
    },
    {
      heading: '11. Disclaimer and limitation of liability',
      paragraphs: [
        'To the maximum extent permitted by law and subject to section 10, the Game is provided free of charge, "as is" and "as available". We exclude all implied warranties, and we are not liable for any indirect or consequential loss, or for any loss of virtual chips or game progress. Our total liability to you in connection with the Game is limited to the greater of the amount you paid us in the 12 months before the claim arose and AUD 100.',
      ],
    },
    {
      heading: '12. Ending your use',
      paragraphs: [
        'You can stop playing at any time by uninstalling the Game. We may stop providing the Game to you if you break these Terms. Sections 1, 8, 10, 11, 14 and 16 continue to apply after you stop playing.',
      ],
    },
    {
      heading: '13. Changes to these Terms',
      paragraphs: [
        'We may update these Terms. The latest version is always available in the Game, in Settings > Terms of Use. If we make significant changes, we will tell you in the Game before they take effect. If you keep playing after that, you accept the updated Terms.',
      ],
    },
    {
      heading: '14. Governing law and disputes',
      paragraphs: [
        'These Terms are governed by the laws of Victoria, Australia, and the courts there have non-exclusive jurisdiction. If you are a consumer in India, you also keep the benefit of any mandatory protections of Indian law and may bring proceedings in Indian courts or consumer forums where that law allows.',
        'If you have a problem with the Game, please contact us first. We will try to resolve it with you in good faith within 30 days. This does not limit any right you have to go to a court, consumer forum or regulator.',
      ],
    },
    {
      heading: '15. Google Play',
      paragraphs: [
        'The Game is distributed through Google Play, and the Google Play Terms of Service also apply. These Terms are between you and us, not Google, and Google is not responsible for the Game or its support.',
      ],
    },
    {
      heading: '16. General',
      bullets: [
        'Whole agreement: these Terms and our Privacy Notice are the whole agreement between you and us about the Game.',
        'Severability: if any part of these Terms is invalid or unenforceable, it will be read down or removed, and the rest continues to apply.',
        'No waiver: if we do not enforce a right straight away, we can still enforce it later.',
        'Transfer: you cannot transfer your rights under these Terms. We may transfer ours to someone who takes over the Game, if your rights are not reduced.',
        'Events outside our control: we are not responsible for delays or failures caused by events beyond our reasonable control.',
      ],
    },
    {
      heading: '17. Contact us',
      paragraphs: [
        'VG Tech Consulting PTY LTD\nAddress: 25 Carnegie Road, Point Cook, Victoria 3030, Australia\nEmail: vgtechconsultingptyltd@gmail.com',
      ],
    },
  ],
};
