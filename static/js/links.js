/*
  G2 FITNESS — CHECKOUT LINKS
  ---------------------------
  Paste each Stripe Payment Link (https://buy.stripe.com/...) between the quotes.
  These are used ONLY by the online enrollment page (/enroll/), after the member has signed.
  A plan left blank still lets people sign; they're told G2 will email a payment link.

  "member-login" is the Stripe customer portal link. It shows MEMBER LOGIN in the menu.
*/
window.G2_LINKS = {
  "member-login": "https://billing.stripe.com/p/login/28E3cv1sM6WoeH30RC3ZK00",

  // Regular gym memberships ($X today = first month + $50 credential; monthly from March 1, 2027)
  "gym-strength-fitness-founding": "",   // $189 today, then $139/mo
  "gym-strength-fitness-regular": "",    // $209 today, then $159/mo
  "gym-coached-strength-founding": "",   // $249 today, then $199/mo
  "gym-coached-strength-regular": ""     // $279 today, then $229/mo

  // Athletic, PEAK and Team links get added here when their enrollment pages are built.
};
