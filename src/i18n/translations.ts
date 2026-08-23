export type Language = "de" | "en";

export const localeMap: Record<Language, string> = {
  de: "de-DE",
  en: "en-US",
};

interface Translations {
  tabPocketMoney: string;
  tabSavings: string;
  privacyLink: string;

  today: string;
  week: string;

  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingNight: string;
  signOutTooltip: string;
  googleSignInLabel: string;
  noGoogleAccountText: string;
  defaultUserName: string;

  incomeLabel: string;
  startingAmountPlaceholder: string;
  accountBalanceLabel: string;
  piggyBankTitle: string;
  resetTitle: string;
  moveToPiggyBankQuestion: string;
  moveToPiggyBankDescription: string;
  startNewWeekQuestion: string;
  startNewWeekDescription: string;
  expensePlaceholder: string;
  resultLabel: string;
  resultPlaceholder: string;
  checkResultButton: string;
  invalidNumberAlert: string;
  piggyBankToastTitle: string;
  youNowHaveText: string;
  inYourSavingsAccountText: string;

  balanceLabel: string;
  resetButton: string;
  resetAllQuestion: string;
  resetAllDescription: string;
  reasonLabel: string;
  amountLabel: string;
  depositButton: string;
  withdrawButton: string;
  noEntriesText: string;

  yesButton: string;
  noButton: string;

  dateHeader: string;
  invalidDateText: string;
  noDateText: string;
  reasonHeader: string;
  noReasonText: string;
  amountHeader: string;
  deleteAmountQuestion: string;

  searchPlaceholder: string;
  noResultsText: string;
  previousButton: string;
  nextButton: string;
}

export const translations: Record<Language, Translations> = {
  de: {
    tabPocketMoney: "Taschengeld",
    tabSavings: "Spardose",
    privacyLink: "Datenschutz",

    today: "Heute",
    week: "Woche",

    greetingMorning: "Guten Morgen",
    greetingAfternoon: "Guten Nachmittag",
    greetingEvening: "Guten Abend",
    greetingNight: "Gute Nacht",
    signOutTooltip: "Abmelden",
    googleSignInLabel: "Mit Google anmelden",
    noGoogleAccountText: "Kein Google-Konto? Registriere dich",
    defaultUserName: "Benutzer",

    incomeLabel: "Einkommen",
    startingAmountPlaceholder: "Startbetrag?",
    accountBalanceLabel: "Kontonstand",
    piggyBankTitle: "Sparschwein",
    resetTitle: "Reset",
    moveToPiggyBankQuestion: "Möchtest du das Geld in dein Sparschwein tun?",
    moveToPiggyBankDescription:
      "Deine wöchentliche Ausgabenliste wird gelöscht und der aktuelle Kontostand auf 0 gesetzt.",
    startNewWeekQuestion: "Möchtest du in die neue Woche starten?",
    startNewWeekDescription:
      "Deine aktuelle Ausgabenliste und dein Einkommen werden auf den Anfangsstand zurückgesetzt.",
    expensePlaceholder: "Ausgaben",
    resultLabel: "Ergebnis",
    resultPlaceholder: "Wie viel bleibt?",
    checkResultButton: "Ergebnis prüfen",
    invalidNumberAlert: "Gib bitte eine gültige Zahl ein.",
    piggyBankToastTitle: "Das Geld ist im Sparschwein gelandet!",
    youNowHaveText: "Du hast jetzt",
    inYourSavingsAccountText: "in deinem Sparkonto!",

    balanceLabel: "Kontostand",
    resetButton: "RESET",
    resetAllQuestion: "Möchtest du wirklich alles zurücksetzen?",
    resetAllDescription:
      "Deine Kontostand wird auf 0 gesetezt und alle Einträge werden gelöscht.",
    reasonLabel: "Zweck",
    amountLabel: "Betrag",
    depositButton: "+ Einzahlen",
    withdrawButton: "- Entnehmen",
    noEntriesText: "Keine Einträge vorhanden.",

    yesButton: "Ja",
    noButton: "Nein",

    dateHeader: "Datum",
    invalidDateText: "Ungültiges Datum",
    noDateText: "Kein Datum",
    reasonHeader: "Zweck",
    noReasonText: "Kein Zweck",
    amountHeader: "Betrag",
    deleteAmountQuestion: "Möchtest du diesen Betrag löschen?",

    searchPlaceholder: "Such nach Zweck oder Betrag . . .",
    noResultsText: "Keine Ergebnisse.",
    previousButton: "Vorherige",
    nextButton: "Nächste",
  },
  en: {
    tabPocketMoney: "Pocket Money",
    tabSavings: "Piggy Bank",
    privacyLink: "Privacy Policy",

    today: "Today",
    week: "Week",

    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    greetingNight: "Good night",
    signOutTooltip: "Sign out",
    googleSignInLabel: "Sign in with Google",
    noGoogleAccountText: "No Google account? Sign up",
    defaultUserName: "User",

    incomeLabel: "Income",
    startingAmountPlaceholder: "Starting amount?",
    accountBalanceLabel: "Balance",
    piggyBankTitle: "Piggy bank",
    resetTitle: "Reset",
    moveToPiggyBankQuestion: "Do you want to put the money into your piggy bank?",
    moveToPiggyBankDescription:
      "Your weekly expense list will be cleared and the current balance will be set to 0.",
    startNewWeekQuestion: "Do you want to start the new week?",
    startNewWeekDescription:
      "Your current expense list and income will be reset to the starting state.",
    expensePlaceholder: "Expense",
    resultLabel: "Result",
    resultPlaceholder: "How much is left?",
    checkResultButton: "Check result",
    invalidNumberAlert: "Please enter a valid number.",
    piggyBankToastTitle: "The money has landed in the piggy bank!",
    youNowHaveText: "You now have",
    inYourSavingsAccountText: "in your savings account!",

    balanceLabel: "Balance",
    resetButton: "RESET",
    resetAllQuestion: "Do you really want to reset everything?",
    resetAllDescription:
      "Your balance will be set to 0 and all entries will be deleted.",
    reasonLabel: "Reason",
    amountLabel: "Amount",
    depositButton: "+ Deposit",
    withdrawButton: "- Withdraw",
    noEntriesText: "No entries yet.",

    yesButton: "Yes",
    noButton: "No",

    dateHeader: "Date",
    invalidDateText: "Invalid date",
    noDateText: "No date",
    reasonHeader: "Reason",
    noReasonText: "No reason",
    amountHeader: "Amount",
    deleteAmountQuestion: "Do you want to delete this amount?",

    searchPlaceholder: "Search by reason or amount . . .",
    noResultsText: "No results.",
    previousButton: "Previous",
    nextButton: "Next",
  },
};

export type TranslationKey = keyof Translations;

// Canonical weekday values are stored in German (also used as Firestore data keys).
// This map only translates how they are displayed.
export const weekdayLabels: Record<Language, Record<string, string>> = {
  de: {
    Montag: "Montag",
    Dienstag: "Dienstag",
    Mittwoch: "Mittwoch",
    Donnerstag: "Donnerstag",
    Freitag: "Freitag",
    Samstag: "Samstag",
    Sonntag: "Sonntag",
  },
  en: {
    Montag: "Monday",
    Dienstag: "Tuesday",
    Mittwoch: "Wednesday",
    Donnerstag: "Thursday",
    Freitag: "Friday",
    Samstag: "Saturday",
    Sonntag: "Sunday",
  },
};

// The saving log stores the reason of auto-generated entries (e.g. the weekly
// pocket-money transfer) as German text, the same way weekday values are
// stored. This only translates how known reasons are displayed.
export const reasonLabels: Record<Language, Record<string, string>> = {
  de: {
    Taschengeld: "Taschengeld",
  },
  en: {
    Taschengeld: "Pocket money",
  },
};

export const errorMessages: Record<Language, string[]> = {
  de: [
    "Ups, das war leider nicht ganz richtig. Versuch es doch nochmal!",
    "Deine Berechnung stimmt nicht ganz. Denk nochmal nach und probier es erneut!",
    "Fast richtig, aber noch nicht ganz. Gib dir einen Moment und versuch’s nochmal!",
    "Das Ergebnis passt noch nicht. Probier es einfach nochmal in Ruhe!",
    "Huch, da hat sich ein kleiner Fehler eingeschlichen. Versuch es doch nochmal!",
    "Nicht schlimm, das war ein guter Versuch! Versuch es einfach noch einmal!",
    "Deine Berechnung ist leider nicht korrekt. Versuch es nochmal, du kannst das!",
    "Das Ergebnis ist noch nicht richtig. Versuch’s nochmal, ich glaube an dich!",
    "Schade, das war knapp daneben. Versuch es nochmal, du schaffst das!",
    "Deine Antwort ist leider falsch. Aber kein Problem, probier es einfach noch einmal!",
  ],
  en: [
    "Oops, that wasn't quite right. Give it another try!",
    "Your calculation isn't quite right. Think it through again and try once more!",
    "Almost right, but not quite. Take a moment and try again!",
    "The result isn't quite right yet. Just take your time and try again!",
    "Oops, a little mistake crept in there. Give it another try!",
    "No worries, that was a good try! Just give it another go!",
    "Your calculation isn't correct. Try again, you can do this!",
    "The result isn't right yet. Try again, I believe in you!",
    "Too bad, that was close. Try again, you can do it!",
    "Your answer is wrong, unfortunately. But no problem, just try again!",
  ],
};

export const praiseMessages: Record<Language, string[]> = {
  de: [
    "Super gemacht, das war genau richtig!",
    "Klasse, du hast die Aufgabe perfekt gelöst!",
    "Richtig gerechnet, das war spitze!",
    "Toll, du hast das wunderbar gelöst!",
    "Fantastisch, deine Antwort ist absolut korrekt!",
    "Bravo, du bist ein Mathe-Champion!",
    "Ausgezeichnet! Deine Berechnung stimmt!",
    "Wow, das war richtig gut! Weiter so!",
    "Du hast das großartig gemacht, alles richtig!",
    "Herzlichen Glückwunsch, das Ergebnis ist perfekt!",
  ],
  en: [
    "Great job, that was exactly right!",
    "Awesome, you solved the task perfectly!",
    "Correctly calculated, that was great!",
    "Wonderful, you solved that beautifully!",
    "Fantastic, your answer is absolutely correct!",
    "Bravo, you're a math champion!",
    "Excellent! Your calculation is correct!",
    "Wow, that was really good! Keep it up!",
    "You did that great, all correct!",
    "Congratulations, the result is perfect!",
  ],
};
