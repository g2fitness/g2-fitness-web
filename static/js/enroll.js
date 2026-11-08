/* G2 Fitness — online enrollment (regular gym memberships)
   Documents below are the approved CPD-2026-10-11-v2 forms, populated with the buyer's selections.
   Do not edit document wording here without matching the approved version. */
(function () {
  "use strict";

  var VERSION = "CPD-2026-10-11-v2";
  var SELLER = "G2 Fitness L.C.";
  var ADDRESS = "2470 Daniells Bridge Rd, Bldg 100, Ste B1, Athens, GA 30606";
  var EMAIL = "coachtre@g2fitness.org";
  var PHONE = "404-940-3455";
  var OWNER = "Trevon Allen, Owner, G2 Fitness L.C.";
  var CALENDAR_CONFIRMED = "Trevon Allen, Owner — confirmed November 8, 2026";
  var ACTIVATION_CUTOFF = new Date("2027-02-01T00:00:00-05:00");

  var PLANS = {
    "gym-strength-fitness-founding": { name: "G2 Fitness Strength & Fitness Membership", tier: "Founding", rate: 139, regular: 159, coached: false },
    "gym-strength-fitness-regular": { name: "G2 Fitness Strength & Fitness Membership", tier: "Regular", rate: 159, regular: 159, coached: false },
    "gym-coached-strength-founding": { name: "G2 Fitness Coached Strength Membership", tier: "Founding", rate: 199, regular: 229, coached: true },
    "gym-coached-strength-regular": { name: "G2 Fitness Coached Strength Membership", tier: "Regular", rate: 229, regular: 229, coached: true }
  };
  var MODALITIES = ["Cold plunge", "Infrared booth", "Percussion", "Compression"];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return "$" + n.toLocaleString("en-US"); }
  function blank(v, placeholder) { return v ? "<b>" + esc(v) + "</b>" : '<span class="blank">' + (placeholder || "to be completed") + "</span>"; }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function stamp(d) {
    return d.toLocaleString("en-US", { timeZone: "America/New_York", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit", timeZoneName: "short" });
  }
  function dateOnly(d) { return d.toLocaleDateString("en-US", { timeZone: "America/New_York", year: "numeric", month: "long", day: "numeric" }); }
  function orderId() {
    var d = new Date(), chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "";
    var arr = new Uint32Array(6); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(arr) : arr.forEach(function (_, i) { arr[i] = Math.random() * 1e9; });
    for (var i = 0; i < 6; i++) s += chars[arr[i] % chars.length];
    var ymd = d.toLocaleDateString("en-CA", { timeZone: "America/New_York" }).replace(/-/g, "");
    return "G2-" + ymd + "-" + s;
  }
  function age(dob) {
    var b = new Date(dob + "T12:00:00"), n = new Date();
    var a = n.getFullYear() - b.getFullYear();
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
    return a;
  }
  function fmtDob(dob) { if (!dob) return ""; var p = dob.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }

  /* ---------- derived order values ---------- */
  function order(st) {
    var p = PLANS[st.plan];
    var o = {
      plan: p, initial: p.rate + 50,
      planRate: p.name + " — " + p.tier + " " + money(p.rate) + "/month",
      period: "February 1, 2027 through February 28, 2027 (if activation occurs as targeted; an opening delay postpones the service period to actual approved activation)",
      foundingMonths: p.tier === "Founding" ? "12" : "",
      foundingEnd: p.tier === "Founding" ? "January 31, 2028 (twelfth paid month, if February 1, 2027 activation and continuous enrollment)" : "",
      renewalAfter: p.tier === "Founding" ? money(p.regular) : "",
      visits: p.coached
        ? "Regular gym 24/7 controlled access and Recovery Room, plus two coached strength sessions weekly on the selected gym calendar (Tuesday 8:00–8:50 PM and Saturday 12:00–12:50 PM)"
        : "Regular gym 24/7 controlled access and Recovery Room; no purchased coached sessions",
      enrollDate: st.signedAt ? dateOnly(st.signedAt) : dateOnly(new Date())
    };
    return o;
  }

  /* ---------- documents ---------- */
  function header(st) {
    var buyer = st.name ? st.name + ", " + st.street + ", " + st.city + ", " + st.state + " " + st.zip + ", " + st.phone + ", " + st.email : "";
    return '<p>Seller and operator: ' + SELLER + ' Facility and mailing address for cancellation: ' + ADDRESS + '. Cancellation email: ' + EMAIL + '. Phone: ' + PHONE + '. All fields must be completed and all unused options marked Not selected before signature.</p>' +
      '<p>Buyer full name, address, phone and email: ' + blank(buyer, "your details") + '. Participant name and date of birth: ' + blank(st.name ? st.name + ", " + fmtDob(st.dob) + " (buyer is the participant)" : "", "your name and date of birth") + '. If participant is under 18, the buyer must be an adult parent/legal guardian; the separate guardian consent must identify that participant. Contract ID and version: ' + blank(st.id ? st.id + " / " + VERSION : "", "assigned when you sign") + '.</p>';
  }

  function docA(st) {
    var o = order(st), p = o.plan;
    return '<section class="doc" id="doc-a"><h2>Regular gym membership agreement</h2>' + header(st) +
      '<h3>Buyer cancellation notice</h3>' +
      '<p class="strong">You (the buyer) have seven business days to cancel this contract. To cancel, mail or hand deliver a letter to the following address: G2 Fitness L.C., 2470 Daniells Bridge Rd, Bldg 100, Ste B1, Athens, GA 30606.</p>' +
      '<p>Do not sign this contract if there are any blank spaces above. In the event optional services are offered, be sure that any options you have not selected are lined through or that it is otherwise indicated that you have not selected these options. It is recommended that you send your cancellation notice by registered or certified mail, return receipt requested, in order to prove that you did cancel. If you do hand deliver your cancellation, be sure to get a signed statement from an official of the spa, acknowledging your cancellation.</p>' +
      '<p>To be effective, your cancellation must be postmarked by midnight, or hand delivered by midnight on the applicable deadline identified here, and must include all contract forms, membership cards, and any and all other documents and evidence of membership previously delivered to you.</p>' +
      '<p>Enrollment status: <b>Presale</b>. Fully operational: <b>Not selected</b>. PRESALE CANCELLATION DEADLINE: Seven business days following the date the facility becomes fully operational and available for use. G2 Fitness will notify the buyer of the specific calendar deadline when that occurs. FULLY OPERATIONAL ENROLLMENT DEADLINE: <b>Not selected</b>. Business days means regular business days of operation under Georgia law. G2 Fitness will apply the counting method confirmed with CPD and identify the applicable deadline; 24/7 access will not be used to shorten a statutory cancellation right.</p>' +
      '<p>G2 Fitness additionally accepts cancellation through the authenticated account or the monitored cancellation email above and provides a receipt. These additional methods do not remove your statutory mail or hand-delivery rights. A missing paper item does not permit indefinite denial of cancellation; G2 Fitness will follow applicable notice and document-return requirements. Digital credentials are deactivated rather than physically returned.</p>' +
      '<p>For timely statutory cancellation, G2 Fitness provides a full refund of payments and cancels evidence of indebtedness, without a refund processing fee or document-preparation deduction. Complimentary January previews carry no charge or cancellation deduction. Refund and debt-cancellation deadlines required by law control. This policy does not restrict other mandatory refunds.</p>' +
      '<h3>Selected gym membership</h3>' +
      '<table><tr><th>Plan</th><th>Founding monthly</th><th>Regular monthly</th></tr><tr><td>G2 Fitness Strength &amp; Fitness Membership</td><td>$139</td><td>$159</td></tr><tr><td>G2 Fitness Coached Strength Membership</td><td>$199</td><td>$229</td></tr></table>' +
      '<p>Selected plan and rate: <b>' + esc(o.planRate) + '</b>. Membership term: month-to-month. Initial service period: <b>February 1, 2027</b> through <b>February 28, 2027</b> (if activation occurs as targeted). Founding price protection: ' + (o.foundingMonths ? '<b>12</b>' : '<b>Not selected</b>') + ' paid months of continuous enrollment (required only for a founding selection; otherwise mark Not selected). Founding protection end date: <b>' + (o.foundingEnd ? esc(o.foundingEnd) : "Not selected") + '</b>. Renewal rate after founding protection: <b>' + (o.renewalAfter ? esc(o.renewalAfter) : "Not selected") + '</b> per month. No nine-month athlete commitment applies to regular gym membership. The selected Order and Payment Authorization states the first charge, recurring charge, annual fee and minimum initial obligation.</p>' +
      '<p>Both gym plans include personal, nontransferable 24/7 controlled gym access and Recovery Room access including cold plunges, infrared light therapy booth, complete percussion therapy and complete compression therapy. Coached Strength also includes two coached strength sessions per week on the published gym-coaching calendar. These are regular gym memberships; athletic programs, PEAK and Team Training require separate enrollment.</p>' +
      '<p>Annual app access-credential charge: $50 collected with the initial gym payment at enrollment for the first access year beginning at service activation; renews every 12 months from activation while enrolled. Initial totals before disclosed tax: founding Strength &amp; Fitness $189; regular Strength &amp; Fitness $209; founding Coached Strength $249; regular Coached Strength $279. Later monthly charges are the selected rate; annual renewal is separate. No test-integration or complimentary-preview fee applies. No athlete-only annual credential fee applies.</p>' +
      '<h3>Activation and payment authorization</h3>' +
      '<p>Presale enrollment is planned to open November 15, 2026, after required written approvals. Initial payment is collected upon enrollment. Paid service begins February 1, 2027, subject to actual approved readiness. Complimentary January previews do not consume purchased visits or start paid terms or founding protection.</p>' +
      '<p>For presale enrollment before February 1, 2027, the initial payment prepays the first service month, or the selected one-time package/evaluation. All presale receipts are deposited into the required escrow account and held until authorized release. No second first-month payment is due February 1. Monthly recurring payments begin March 1, 2027, if service starts February 1. An opening delay postpones paid service periods, visit validity and renewals until actual approved activation, with advance notice and statutory cancellation/refund rights preserved. The initial payment remains prepaid; it is not deferred until opening.</p>' +
      '<p>For enrollment on or after February 1, 2027, initial payment is collected at enrollment; the selected order identifies the service start and next monthly charge. For later starts, renewal occurs one month after actual activation and monthly thereafter (last day of a shorter month). One-time packages and evaluations do not renew. Before signing, the buyer sees the exact payment due now, next charge, service period and total commitment.</p>' +
      '<p>I authorize the secure payment processor to charge the selected disclosed amounts to my designated payment method, including applicable tax only if separately identified, until cancellation takes effect. No undisclosed late, returned-payment, replacement or initiation fee is authorized. G2 Fitness will give written notice of a failed payment and a reasonable opportunity to update payment; access may be suspended until resolved. Disputed amounts and consumer rights remain subject to law. Revoking payment authorization does not itself cancel lawful contractual obligations, and cancellation does not authorize future charges beyond amounts legally owed.</p>' +
      '<h3>Facility use and access</h3>' +
      '<p>Independent unstaffed gym access is limited to approved adult members age 18 or older under this agreement. Athletes and minors receive no independent access through athletic enrollment. Access remains disabled until agreements, identity check, orientation and readiness clearance are complete. App credentials are personal: no sharing, tailgating, propping doors, admitting unauthorized guests or lending a phone for entry. Report a lost device or compromised account promptly. Free emergency egress must remain available.</p>' +
      '<p>Staff are not present at all hours. App access, cameras or logs do not guarantee live monitoring, rescue or uninterrupted connectivity. Call 911 in an emergency; identify the posted facility address. Know the exits, AED and emergency instructions. Follow equipment instruction, use safety stops and suitable spotting, report damage, and stop if unsafe. No alcohol/drugs, abusive conduct, weapons contrary to posted lawful rules, or unauthorized personal training. G2 Fitness may restrict unsafe activities or equipment.</p>' +
      '<p>Recovery Room inclusion does not guarantee every modality is available unattended. Use requires the separate risk acknowledgment, orientation, applicable age eligibility and manufacturer limits. Cold plunges and the infrared booth are available only during approved staffed periods. Percussion and compression use follows the posted operating instructions. These are recovery services, not medical treatment. G2 Fitness will address a material benefit reduction under the statutory change rights.</p>' +
      '<h3>Cancellation and suspension</h3>' +
      '<p>Subject to statutory rights above, month-to-month cancellation takes effect 30 calendar days after written notice. Any charge covering time after the effective end is prorated/refunded as legally required; G2 Fitness does not extend the notice indefinitely to a later billing cycle. A renewal annual fee is not charged if its renewal date occurs after the effective termination. Statutory cancellation, disability, death, closure, material service changes and nonperformance override ordinary notice restrictions. Holds require a separate written request and decision before billing changes; no automatic medical disclosure to third parties.</p>' +
      '<p>G2 Fitness may suspend access immediately for an imminent safety/security risk and investigate promptly; termination for misconduct requires written reasons and lawful treatment of unearned fees. Property damage caused by proven intentional or negligent member conduct may be charged only through a lawful separately substantiated claim, not automatic penalties. G2 Fitness does not waive liability it cannot legally waive or retain all prepaid money as punishment.</p>' +
      statutory() +
      '<h3>Agreement and signatures</h3>' +
      '<p>This agreement includes every page and only the attachments identified by title and version in the selected Order and Payment Authorization. Each attachment is supplied for review before signing and included in the signed copy. Unseen website terms are not incorporated. Changes to price, term, benefits or liability provisions require legally appropriate notice and assent; statutory rights prevail. Georgia law applies subject to mandatory consumer protections. An unenforceable clause is severed only if lawful and the remainder can function without defeating the agreement’s purpose. No performance result is guaranteed.</p>' +
      '<ul class="sig">' +
      '<li>Buyer signature: ' + sig(st.signature) + ' Date/time: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '</li>' +
      '<li>Adult participant signature if different: <b>Not applicable — buyer is the participant</b></li>' +
      '<li>Guardian signature if applicable: <b>Not applicable</b></li>' +
      '<li>G2 Fitness acceptance: ' + blank(st.signedAt && OWNER + " (electronic acceptance)", "recorded when you sign") + ' Date/time: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '</li>' +
      '<li>Complete signed agreement and attachments delivered: ' + blank(st.signedAt && "Yes", "Yes, when you sign") + '</li>' +
      '<li>Separate payment authorization signed: ' + blank(st.paySignature && st.signedAt ? "Yes" : "", "Yes, when you sign") + '</li></ul>' +
      '<p class="docfoot">G2 Fitness | 01 | ' + VERSION + ' | Regular Gym Agreement A (4 pages)</p></section>';
  }

  function statutory() {
    return '<h3>Additional statutory rights</h3>' +
      '<p>You (the buyer) may cancel this agreement within 30 days from the time you knew or should have known of any substantial change in the services or programs available at the time you joined. Substantial changes include, but are not limited to, changing from being coed to being exclusively for one sex or vice versa. To cancel, send written notice of your cancellation to the address provided in this contract for sending a notice of cancellation. The best way to cancel is by keeping a photocopy and sending the cancellation by registered or certified mail, return receipt requested.</p>' +
      '<p>If you become totally and permanently disabled during your membership term, you may cancel this contract. The health spa is entitled to a reasonable predetermined fee in such event, in addition to an amount equal to the value of the services made available for use. Under this G2 Fitness agreement, the predetermined fee is $0. G2 Fitness may request reasonable evidence and will calculate earned amounts and refunds as required by law.</p>' +
      '<p>If you have a history of heart disease, you should consult a physician before joining a spa.</p>' +
      '<p>If you should die during the membership term or any renewal term, your estate may cancel the contract. The health spa is entitled to a reasonable predetermined fee in such event, in addition to an amount computed by dividing the total cost of your membership by the total number of months of the membership and multiplying the result by the number of months expired in the membership term. Reasonable proof of death may be required under this paragraph. Under this G2 Fitness agreement, the predetermined fee is $0.</p>' +
      '<p>Under this contract, no further payments shall be due to anyone, including any purchaser of any note associated with or contained in this contract, in the event the health spa at which the contract is entered into ceases operation and fails to offer an alternate location, substantially similar, within ten miles.</p>' +
      '<p class="notice-label">NOTICE</p><p class="notice">State law requires that we inform you that should you (the buyer) choose to pay for any part of this agreement in advance, be aware that you are paying for future services and may be risking loss of your money in the event this health spa ceases to conduct business. Health spas do not post a bond, and no other protections may be provided to you should you choose to pay in advance.</p>' +
      '<p>This warning does not eliminate mandatory refunds or presale escrow protections. Unearned prepaid amounts receive the refund treatment required by Georgia law. No clause permits G2 Fitness to keep payment for services it cancels or fails to provide.</p>';
  }

  function sig(name) { return name ? '<b class="esig">/s/ ' + esc(name) + '</b> <span class="esig-note">(typed electronic signature)</span>' : '<span class="blank">your typed signature</span>'; }
  function ini(v) { return v ? '<b class="esig">' + esc(v) + '</b>' : '<span class="blank">initials</span>'; }

  function docF(st) {
    var o = order(st), p = o.plan;
    var row = function (a, b) { return "<tr><td>" + a + "</td><td>" + b + "</td></tr>"; };
    return '<section class="doc" id="doc-f"><h2>Order summary and separate payment authorization</h2>' +
      '<p>' + SELLER + ' | ' + ADDRESS + ' | ' + EMAIL + ' | ' + PHONE + '</p>' +
      '<p>Complete this attachment for the selected agreement before any signature. Mark unused options Not selected. The buyer reviews the complete agreement and every identified attachment before signing the agreement and this separate payment authorization. Version ' + VERSION + '.</p>' +
      '<h3>Buyer and selected service</h3>' +
      '<p>Order ID: ' + blank(st.id, "assigned when you sign") + ' Buyer name: ' + blank(st.name, "your name") + '<br>Participant name and DOB: ' + blank(st.name && st.name + ", " + fmtDob(st.dob), "your name and date of birth") + ' Guardian name and relationship, if applicable: <b>Not selected</b><br>Team organization and authorized payer, if applicable: <b>Not selected</b></p>' +
      '<table><tr><th>Order field</th><th>Selected value</th></tr>' +
      row("Agreement title and version", "<b>Regular Gym Agreement A / " + VERSION + "</b>") +
      row("Plan and program assigned", "<b>" + esc(p.name) + "</b>; athletic program Not selected") +
      row("Pricing tier and monthly amount", "<b>" + p.tier + " " + money(p.rate) + "/month</b>") +
      row("Enrollment date and service activation date", "<b>" + esc(o.enrollDate) + " / February 1, 2027 target or later actual approved activation</b>") +
      row("Initial commitment and initial end date", "<b>Month-to-month / February 28, 2027 if February 1 activation</b>") +
      row("Founding protection duration and end date", "<b>" + (o.foundingMonths ? "12 paid months of continuous enrollment / " + esc(o.foundingEnd) : "Not selected") + "</b>") +
      row("Monthly renewal amount and renewal term", "<b>" + money(p.rate) + " month-to-month" + (o.foundingMonths ? "; " + money(p.regular) + " after founding protection" : "") + "</b>") +
      row("Visits or session entitlement", "<b>" + esc(o.visits) + "</b>") +
      row("Cancellation deadline and presale status", "<b>Presale: seven business days after fully operational availability; G2 Fitness will notify you of the calendar deadline</b>") +
      row("Included evaluation or separate $75 evaluation", "<b>Not selected</b>") + "</table>" +
      '<p>Regular gym is month-to-month. Group founding and standard nine-month plans have nine paid months; three-month plans have three; Flex is month-to-month. PEAK monthly plans have a three-month initial term. The PEAK 10-visit package is $500 for ten visits, paid at enrollment and valid 90 days from actual approved service activation with no automatic renewal. Team Training has a three-month initial term at $2,000/month. A standalone evaluation is $75 for one 60-minute service, with no automatic renewal.</p>' +
      '<h3>Charges and authorization</h3><table><tr><th>Billing field</th><th>Required amount or date</th></tr>' +
      row("Initial payment at enrollment", "<b>" + money(o.initial) + "</b>; collected at enrollment; deposited into presale escrow") +
      row("Enrollment payment date", "<b>" + esc(o.enrollDate) + "</b>; payment taken upon enrollment") +
      row("First membership or package amount", "<b>" + money(p.rate) + "</b>") +
      row("First annual credential fee", "<b>$50 regular gym</b>") +
      row("Separately disclosed tax", "<b>No tax</b>") +
      row("Total first charge", "<b>" + money(o.initial) + "</b>") +
      row("Next recurring charge date and amount", "<b>March 1, 2027 for February 1 start; " + money(p.rate) + "</b>") +
      row("Annual credential renewal date", "<b>February 1, 2028 / $50 if still enrolled</b>") +
      row("Minimum initial obligation including required fees", "<b>" + money(o.initial) + "</b>") +
      row("Renewal price after founding protection", "<b>" + (o.renewalAfter ? esc(o.renewalAfter) + "/month" : "Not selected") + "</b>") + "</table>" +
      '<p>Collect the initial payment at enrollment. For February 1, 2027 service activation, it covers February and monthly renewals begin March 1, 2027. No duplicate first-month charge occurs February 1. Opening delays defer service periods and renewals, not initial payment; notify the buyer and preserve statutory refund rights. Presale receipts go to the required escrow account until authorized release. January previews do not use paid credits. Later starts renew monthly from activation. The secure processor stores payment credentials; this form collects no full card or bank details.</p>' +
      '<p>I authorize G2 Fitness L.C., through its secure payment processor, to charge only the amounts and dates disclosed above to my selected payment method. Recurring authorization applies only to a selected recurring plan and its disclosed annual credential fee. No undisclosed penalty or additional service is authorized. Statutory cancellation and refunds control. Revoking payment authorization is separate from cancelling the service agreement; G2 Fitness will not charge beyond amounts legally owed.</p>' +
      '<p>Payment authorization choice: <b>Authorize selected recurring payments</b>. Authorize selected one-time payment: <b>Not selected</b>.<br>Payer signature: ' + sig(st.paySignature) + ' Date/time: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '<br>Processor payment-method token/reference, excluding full account details: ' + blank(st.id && "Stored by Stripe; linked to Order ID " + st.id, "assigned at payment") + '</p>' +
      '<h3>Attachments and receipt</h3>' +
      '<p>List every incorporated attachment supplied to this buyer. Identify its title, version and page count. A blank row is marked Not selected; no later website policy is silently substituted.</p>' +
      '<table><tr><th>Document or attachment</th><th>Version and pages</th><th>Included</th></tr>' +
      '<tr><td>Selected membership or training agreement</td><td><b>' + VERSION + ' / 4</b></td><td><b>Yes</b></td></tr>' +
      '<tr><td>This Order and Payment Authorization</td><td><b>' + VERSION + ' / 3</b></td><td><b>Yes</b></td></tr>' +
      '<tr><td>Adult Waiver and Recovery Acknowledgment</td><td><b>' + VERSION + ' / 2</b></td><td><b>Yes</b></td></tr>' +
      '<tr><td>Parent Guardian Consent</td><td><b>Not selected</b></td><td><b>No</b></td></tr>' +
      '<tr><td>Service Rules and Calendar</td><td><b>' + VERSION + ' / 3</b></td><td><b>Yes</b></td></tr>' +
      '<tr><td>Team Roster and Consent Log</td><td><b>Not selected</b></td><td><b>No</b></td></tr>' +
      '<tr><td>Other expressly agreed attachment</td><td><b>Not selected</b></td><td><b>No</b></td></tr></table>' +
      '<p>I confirm that the complete selected agreement and every attachment listed Yes were available to review before signature. I acknowledge the selected price, term, cancellation rights and separate payment authorization. This acknowledgment does not waive any statutory right.</p>' +
      '<ul class="sig"><li>Buyer acknowledgment signature: ' + sig(st.signature && st.ack ? st.signature : "") + ' Date/time: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '</li>' +
      '<li>Adult participant or guardian acknowledgment, if different: <b>Not applicable — buyer is the participant</b></li>' +
      '<li>Secure signed-copy delivery timestamp: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '</li>' +
      '<li>Customer account document ID and receipt ID: ' + blank(st.id && st.id + "; payment receipt issued by Stripe at payment", "assigned when you sign") + '</li>' +
      '<li>G2 Fitness acceptance timestamp: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '</li></ul>' +
      '<p>The complete signed agreement and attachments are delivered immediately through the authenticated checkout confirmation and member account in a printable/downloadable format. A receipt or a link to changing website terms is not the signed agreement. If delivery fails, execution completion is held for correction and the customer is supplied the full signed copy securely.</p>' +
      '<p class="docfoot">G2 Fitness | 06 | ' + VERSION + ' | Order and Payment Authorization F (3 pages)</p></section>';
  }

  function docC(st) {
    var p = PLANS[st.plan];
    var mods = st.modalities && st.modalities.length ? st.modalities.join(", ") + (st.modalities.length < 4 ? "; " + MODALITIES.filter(function (m) { return st.modalities.indexOf(m) < 0; }).join(", ") + ": Not selected" : "") : (st.modalitiesNone ? "None" : "");
    return '<section class="doc" id="doc-c"><h2>Adult participation waiver and recovery acknowledgment</h2>' + header(st) +
      '<p>Complete for each adult participant before gym, coaching, evaluation, preview, team or recovery participation. A payment signature alone is not this waiver. This release applies only as permitted by law; it does not eliminate statutory contract or refund rights.</p>' +
      '<h3>Activities and risks</h3>' +
      '<p>I voluntarily choose the activities identified in my enrollment, including weights, racks, cardio equipment, turf, sleds, sprinting, jumping, agility, strength coaching, evaluations and authorized Recovery Room use. Risks include falls, collisions, dropped weights, equipment misuse or malfunction, overexertion, muscle/ligament injury, fractures, head/spinal injury, cardiac events, infection, disability and death. My condition, the conduct of others, supervision errors or delayed assistance may contribute. I may stop or decline an activity.</p>' +
      '<p>24/7 controlled access can include periods without staff, supervision, a spotter or immediate help. I understand that entry credentials, access logs and cameras do not mean a person is watching or will respond. I will use activities suitable for my skill, follow safety devices and avoid training I cannot perform safely without assistance. I will call 911, not rely on the app for emergency rescue.</p>' +
      '<p>Cold plunges involve cold shock, breathing difficulty, fainting, cardiac stress, slips and drowning risk. Infrared booth use involves heat exposure, burns, dehydration and fainting. Percussion and compression devices can cause pain, bruising, skin irritation or other injury if used incorrectly. These services are not medical diagnosis, treatment or a guarantee of recovery. I will follow manufacturer and staff instructions, time/temperature/pressure limits, screening and hygiene rules; I will stop if symptoms occur. I will not use recovery while impaired or contrary to medical advice. I will use staffed-only modalities only when authorized staff are available.</p>' +
      '<h3>Health and emergency acknowledgment</h3>' +
      '<p>If I have a history of heart disease, I should consult a physician before joining a spa. I will provide accurate relevant safety information, report symptoms or changes, and seek clinician advice when appropriate. G2 Fitness coaches do not provide medical clearance or replace medical care. I authorize staff to contact emergency services and my emergency contact if necessary; treatment decisions remain with qualified responders and clinicians. I am responsible for my own emergency-care expenses only to the extent lawfully owed, without releasing any nonwaivable claim against G2 Fitness.</p>' +
      '<h3>Express release of ordinary negligence</h3>' +
      '<p class="strong">TO THE FULLEST EXTENT PERMITTED BY GEORGIA LAW, I RELEASE G2 Fitness L.C., TREVON ALLEN, AND ITS OWNERS, EMPLOYEES AND AUTHORIZED COACHES FROM MY CLAIMS FOR PERSONAL INJURY, DEATH OR PROPERTY DAMAGE ARISING FROM MY VOLUNTARY PARTICIPATION OR AUTHORIZED FACILITY USE, INCLUDING CLAIMS CAUSED BY THEIR ORDINARY NEGLIGENCE IN INSTRUCTION, SUPERVISION, EQUIPMENT USE, FACILITY CONDITIONS OR RESPONSE TO AN INCIDENT. THIS DOES NOT RELEASE GROSS NEGLIGENCE, RECKLESS OR INTENTIONAL MISCONDUCT, FRAUD, OR ANY LIABILITY OR RIGHT THAT CANNOT LAWFULLY BE RELEASED.</p>' +
      '<p>I knowingly assume the inherent and disclosed activity risks. I accept responsibility for following rules and for losses caused by my own unlawful or unsafe conduct to the extent legally established. I do not agree to indemnify G2 Fitness for its own negligence or pay its defense costs merely for asserting a lawful claim. This waiver is not a guarantee that every court will enforce it.</p>' +
      '<h3>Account security and privacy</h3>' +
      '<p>I will keep my app account and access credential private, report loss or compromise, and not admit unauthorized persons. I understand appropriately posted cameras and access logs may be used for security under the privacy notice; cameras must not be used in private changing/restroom areas. This acknowledgment is not promotional photo consent. Marketing image permission is optional and separate.</p>' +
      '<h3>Signature and separate acknowledgments</h3>' +
      '<ul class="sig"><li>Participant name and DOB: ' + blank(st.name && st.name + ", " + fmtDob(st.dob), "your name and date of birth") + ' Emergency contact and phone: ' + blank(st.ecName && st.ecName + ", " + st.ecPhone, "emergency contact") + '</li>' +
      '<li>Activities selected: <b>Gym' + (p.coached ? ", Coached Strength" : "") + '</b>. ' + (p.coached ? "" : "Coached Strength, ") + 'Athletic, Evaluation, Team and January preview: <b>Not selected</b>.</li>' +
      '<li>Recovery modalities selected: ' + blank(mods, "your selection") + '</li>' +
      '<li>Initials for ordinary-negligence release: ' + ini(st.iniRelease) + '</li>' +
      '<li>Initials for unattended gym risks, if applicable: ' + ini(st.iniUnattended) + '</li>' +
      '<li>Initials for selected recovery risks, if applicable: ' + (st.modalitiesNone ? "<b>Not applicable — no recovery modality selected</b>" : ini(st.iniRecovery)) + '</li>' +
      '<li>Adult signature: ' + sig(st.waiverAttest ? st.signature : "") + ' Date/time: ' + blank(st.signedAt && stamp(st.signedAt), "recorded when you sign") + '</li></ul>' +
      '<p>I am at least 18, have read this entire waiver, understand that I am relinquishing certain legal rights, and have had an opportunity to ask questions. Georgia law governs to the extent applicable. Invalid provisions are severed only where lawful. My electronic signature records the exact version I reviewed; I receive a complete copy.</p>' +
      '<p class="docfoot">G2 Fitness | 03 | ' + VERSION + ' | Adult Waiver and Recovery Acknowledgment C (2 pages)</p></section>';
  }

  function docG(st) {
    var p = PLANS[st.plan];
    var cal = p.coached
      ? "Calendar selection and effective service period: <b>Coached Strength gym sessions, Tuesday 8:00–8:50 PM and Saturday 12:00–12:50 PM; effective February 1, 2027 or later actual approved activation</b>. Owner confirmation of this calendar: <b>" + CALENDAR_CONFIRMED + "</b>. Athletic, PEAK and Team calendars: <b>Not selected</b>; the remaining calendar is reference information, not a purchased coaching service."
      : "Calendar selection and effective service period: <b>Not selected</b>. This regular Strength &amp; Fitness selection includes no coached training calendar. Athletic, PEAK, Team and Coached Strength calendars: <b>Not selected</b>. The calendar below is reference information, not a purchased coaching service.";
    return '<section class="doc" id="doc-g"><h2>Service rules and school year calendar</h2>' +
      '<p>' + SELLER + ' | ' + ADDRESS + ' | ' + EMAIL + ' | ' + PHONE + '</p>' +
      '<p>This attachment describes service eligibility, capacity, operating rules and the calendar selected with the agreement. It does not authorize additional fees or override statutory cancellation or refund rights. Only the services purchased in the selected agreement apply.</p>' +
      '<h3>Regular gym membership and recovery</h3>' +
      '<p>Regular gym memberships provide 24/7 controlled access for approved adults age 18 or older after orientation, signed forms and activation. Credentials are delivered through the member app using the planned Avigilon integration. Credentials may not be shared. Athletic enrollment does not include independent gym entry or Recovery Room access.</p>' +
      '<p>Both regular gym plans include cold plunges, infrared light therapy booth, complete percussion therapy and complete compression therapy. Cold plunges and the infrared booth require approved staffed periods, screening and orientation. Follow manufacturer limits, sanitation and staff instructions; stop for pain, dizziness or other concerning symptoms. Coached Strength includes two coached strength sessions weekly on the selected gym calendar. It is not an unlimited coached-training plan.</p>' +
      '<h3>Athletic program eligibility and visits</h3><table><tr><th>Program</th><th>Eligibility and entitlement</th></tr>' +
      '<tr><td>Basic Strength</td><td>Middle school; elementary participation is excluded. Unlimited visits within the assigned program only.</td></tr>' +
      '<tr><td>Total Performance</td><td>Middle school. Unlimited visits within the assigned program only.</td></tr>' +
      '<tr><td>Elite Sports Performance</td><td>High school. Unlimited visits within the assigned program only.</td></tr>' +
      '<tr><td>Advanced Strength</td><td>High school. Unlimited visits within the assigned program only.</td></tr>' +
      '<tr><td>PEAK</td><td>All ages by evaluation, in age-compatible groups. Purchased visit limits apply; booking required.</td></tr>' +
      '<tr><td>Team Training</td><td>All grade levels with age/readiness-compatible programming. Eight contracted sessions monthly; not unlimited.</td></tr></table>' +
      '<p>All athlete accounts are assigned to Trevon Allen until changed in writing. Each training session has up to 16 total athlete spaces. PEAK availability is up to 16 regardless of coach count. Team Training retains two qualified coaches for full delivery. Group members do not need individual session reservations. PEAK sessions and evaluations require appointments. Capacity management must preserve meaningful purchased access.</p>' +
      '<h3>School year service calendar</h3><p>' + cal + '</p>' +
      '<table><tr><th>Day</th><th>5 PM</th><th>6 PM</th><th>7 PM</th><th>8 PM</th></tr>' +
      '<tr><td>Monday</td><td>Total Performance</td><td>Elite Sports Performance</td><td>Basic Strength</td><td>PEAK</td></tr>' +
      '<tr><td>Tuesday</td><td>Basic Strength</td><td>Advanced Strength</td><td>Elite Sports Performance</td><td>Coached Strength gym</td></tr>' +
      '<tr><td>Wed</td><td>Total Performance</td><td>Elite Sports Performance</td><td>Basic Strength</td><td>Evaluation 8–9 PM</td></tr>' +
      '<tr><td>Thursday</td><td>Basic Strength</td><td>Advanced Strength</td><td>Elite Sports Performance</td><td>PEAK</td></tr>' +
      '<tr><td>Friday</td><td>Team A</td><td>Team B</td><td>PEAK</td><td>PEAK</td></tr></table>' +
      '<p>Training blocks are 5:00–5:50, 6:00–6:50, 7:00–7:50 and 8:00–8:50 PM. Ten minutes separates consecutive training groups. Evaluations are 60 minutes. Saturday: evaluation 9:00–10:00 AM; Team A 10:00–10:50 AM; Team B 11:00–11:50 AM; Coached Strength gym 12:00–12:50 PM. All Saturday sessions end before 1 PM. Sunday has no coached sessions; approved regular gym access remains 24/7.</p>' +
      '<p>Team selection, team holidays and team makeups: <b>Not selected</b>. Holidays, fifth-week exclusions and makeups for the purchased period: <b>None</b>.</p>' +
      '<h3>Booking conduct and participant safety</h3>' +
      '<p>PEAK and Team cancellations/rescheduling require at least 48 hours’ notice to preserve the visit/session, subject to emergency exceptions and mandatory refund rights. A late PEAK cancellation/no-show uses one credit; a late Team cancellation may use one scheduled session. Neither adds a monetary penalty. G2 Fitness cancellations restore the credit/session and provide a feasible makeup or applicable refund. Evaluations require 48 hours’ notice to reschedule; no additional evaluation no-show fee applies.</p>' +
      '<p>PEAK monthly unused credits expire at the monthly service-period end except approved makeups and mandatory refund rights. The ten-visit package is paid at enrollment; its 90-day validity begins at actual approved service activation, not a November presale payment. G2 Fitness-created scheduling failures do not shorten paid entitlements.</p>' +
      '<p>Minors require an adult guardian’s agreement signature, separate youth consent, screening, emergency contacts and authorized pickup details before attendance. A coach, sponsor or team payer cannot sign on behalf of all guardians. Youth are supervised during their scheduled training and handoff; the facility is not general child care. No minor receives independent unstaffed gym access. At age 18, execute the adult participation form before continued attendance.</p>' +
      '<p>Follow equipment instruction, safety stops and spotting requirements. Report damage or unsafe conditions. No credential sharing, tailgating, propped entry doors, unauthorized guests, abusive conduct, impairment by alcohol/drugs or unauthorized personal training. Access restrictions for safety remain subject to lawful fee/refund treatment. Cameras and access logs do not guarantee live monitoring or rescue.</p>' +
      '<p>In an emergency call 911 and identify 2470 Daniells Bridge Rd, Bldg 100, Ste B1, Athens, GA 30606. Know the exits, AED and emergency instructions. Emergency egress must remain available independently of billing, the app or access credentials. Provide relevant health and emergency-contact updates through approved business channels. No promotional image use without separate optional consent.</p>' +
      '<p class="docfoot">G2 Fitness | 07 | ' + VERSION + ' | Service Rules and Calendar G (3 pages)</p></section>';
  }

  function bundle(st) { return docA(st) + docF(st) + docC(st) + docG(st); }

  /* ---------- standalone signed copy ---------- */
  var DOC_CSS = "body{font:15px/1.55 Arial,Helvetica,sans-serif;color:#111;background:#fff;max-width:820px;margin:24px auto;padding:0 20px}h1{font-size:22px}h2{font-size:20px;margin:28px 0 8px;border-top:2px solid #111;padding-top:16px}h3{font-size:16px;margin:18px 0 6px}table{border-collapse:collapse;width:100%;margin:8px 0 12px;font-size:14px}td,th{border:1px solid #bbb;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eee}.strong{font-weight:700}.notice-label{font:700 19px Arial;margin:14px 0 4px}.notice{font:700 19px/1.4 Arial}.sig{list-style:none;padding:0}.sig li{margin:6px 0}.esig{font-family:'Brush Script MT','Segoe Script',cursive;font-size:18px}.esig-note{font-size:12px;color:#555}.docfoot{font-size:12px;color:#555}.meta{background:#f4f4f4;border:1px solid #ccc;padding:12px 14px;font-size:13px}@media print{.noprint{display:none}h2{page-break-before:always}h2:first-of-type{page-break-before:auto}}";
  function standalone(st, hash) {
    return "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>G2 Fitness signed agreement " + st.id + "</title><style>" + DOC_CSS + "</style></head><body>" +
      "<h1>G2 Fitness — signed membership agreement and attachments</h1>" +
      "<div class='meta'>Order ID: <b>" + st.id + "</b><br>Signed: <b>" + stamp(st.signedAt) + "</b><br>Documents: Regular Gym Agreement A, Order and Payment Authorization F, Adult Waiver C, Service Rules and Calendar G — version " + VERSION + "<br>Document fingerprint (SHA-256): <code>" + hash + "</code><br><span class='noprint'><button onclick='window.print()'>Print / Save as PDF</button></span></div>" +
      bundle(st) + "</body></html>";
  }

  async function sha256(text) {
    if (!window.crypto || !crypto.subtle) return "unavailable";
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  /* ---------- page wiring ---------- */
  var st = { plan: null, modalities: [] };
  var root = $("#enroll-app");
  if (!root) return;

  function readForm() {
    var f = $("#enroll-form");
    ["name", "dob", "email", "phone", "street", "city", "state", "zip", "ecName", "ecPhone", "iniRelease", "iniUnattended", "iniRecovery", "signature", "paySignature"].forEach(function (k) {
      var el = f.elements[k]; if (el) st[k] = el.value.trim();
    });
    st.modalities = $$("input[name=modality]:checked").map(function (c) { return c.value; });
    st.modalitiesNone = $("#mod-none").checked;
    st.ack = $("#ack").checked; st.waiverAttest = $("#waiver-attest").checked; st.payAuth = $("#pay-auth").checked;
  }

  function renderSummary() {
    var o = order(st), p = o.plan;
    $("#summary").innerHTML =
      "<div class='sum-row'><span>Plan</span><b>" + esc(p.name.replace("G2 Fitness ", "")) + " — " + p.tier + "</b></div>" +
      "<div class='sum-row'><span>Due today (Feb 2027 + $50 annual access credential)</span><b>" + money(o.initial) + "</b></div>" +
      "<div class='sum-row'><span>Then monthly, starting March 1, 2027</span><b>" + money(p.rate) + "</b></div>" +
      (p.tier === "Founding" ? "<div class='sum-row'><span>Founding rate locked</span><b>12 paid months, then " + money(p.regular) + "</b></div>" : "") +
      "<div class='sum-row'><span>Service begins</span><b>February 1, 2027*</b></div>" +
      "<div class='sum-row'><span>Commitment</span><b>Month-to-month, 30 days' notice</b></div>" +
      "<p class='fine'>*Or the later approved opening date. Today's payment is held in a state-required escrow account until opening. You have seven business days after the facility becomes fully operational to cancel for a full refund.</p>";
  }

  function renderDocs() { $("#docs").innerHTML = bundle(st); }

  function choosePlan(key) {
    if (!PLANS[key]) return;
    st.plan = key;
    $$(".plan-opt").forEach(function (el) { el.classList.toggle("on", el.dataset.plan === key); el.setAttribute("aria-pressed", el.dataset.plan === key); });
    $("#enroll-steps").hidden = false;
    renderSummary(); renderDocs();
    try { history.replaceState(null, "", "?plan=" + key); } catch (e) {}
  }

  function validate() {
    readForm();
    var errs = [];
    if (!st.plan) errs.push("Choose a membership.");
    ["name", "dob", "email", "phone", "street", "city", "state", "zip", "ecName", "ecPhone"].forEach(function (k) { if (!st[k]) errs.push("Complete every field in “Your details”."); });
    if (st.dob && age(st.dob) < 18) errs.push("Regular gym membership is for adults 18 or older. Contact G2 about athletic programs for younger athletes.");
    if (st.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(st.email)) errs.push("Enter a valid email address.");
    if (!st.modalities.length && !st.modalitiesNone) errs.push("Choose your recovery modalities, or “None”.");
    if (!st.iniRelease || !st.iniUnattended || (!st.modalitiesNone && !st.iniRecovery)) errs.push("Type your initials in each waiver box.");
    if (!st.waiverAttest) errs.push("Confirm the waiver statement.");
    if (!st.ack) errs.push("Confirm you reviewed the complete agreement and attachments.");
    if (!st.payAuth || !st.paySignature) errs.push("Check the payment authorization and type your name.");
    if (!st.signature) errs.push("Type your full name to sign the agreement.");
    var n = function (s) { return (s || "").toLowerCase().replace(/\s+/g, " ").trim(); };
    if (st.signature && n(st.signature) !== n(st.name)) errs.push("Your agreement signature must match your full name exactly.");
    if (st.paySignature && n(st.paySignature) !== n(st.name)) errs.push("Your payment authorization signature must match your full name exactly.");
    return errs.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  async function submit(ev) {
    ev.preventDefault();
    var errs = validate(), box = $("#errors");
    if (errs.length) { box.innerHTML = "<b>Almost there:</b><ul>" + errs.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>"; box.hidden = false; box.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    box.hidden = true;
    var btn = $("#sign-btn"); btn.disabled = true; btn.textContent = "Signing…";
    st.id = orderId(); st.signedAt = new Date();
    var html = standalone(st, "pending");
    var plain = (function () { var d = document.createElement("div"); d.innerHTML = bundle(st); return d.textContent.replace(/\s+/g, " ").trim(); })();
    var hash = await sha256(plain);
    html = standalone(st, hash);
    var o = order(st);
    var data = {
      "form-name": "enrollment", order_id: st.id, document_version: VERSION, document_sha256: hash,
      plan_key: st.plan, plan_name: o.plan.name, tier: o.plan.tier, monthly_rate: money(o.plan.rate), initial_payment: money(o.initial),
      buyer_name: st.name, dob: st.dob, email: st.email, phone: st.phone, street: st.street, city: st.city, state: st.state, zip: st.zip,
      emergency_contact: st.ecName, emergency_phone: st.ecPhone,
      recovery_modalities: st.modalitiesNone ? "None" : st.modalities.join(", "),
      initials_release: st.iniRelease, initials_unattended: st.iniUnattended, initials_recovery: st.modalitiesNone ? "N/A" : st.iniRecovery,
      agreement_signature: st.signature, payment_signature: st.paySignature, waiver_attested: "Yes", documents_reviewed: "Yes",
      signed_at: st.signedAt.toISOString(), signed_at_local: stamp(st.signedAt), user_agent: navigator.userAgent,
      signed_document: plain
    };
    var ok = true;
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      try {
        var r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });
        ok = r.ok;
      } catch (e) { ok = false; }
    }
    if (!ok) {
      st.id = null; st.signedAt = null; btn.disabled = false; btn.textContent = "Sign agreement";
      box.innerHTML = "<b>We couldn't save your signed agreement.</b> Please check your connection and try again. Nothing has been charged."; box.hidden = false; return;
    }
    store("g2_signed_" + st.id, html); store("g2_last_order", st.id);
    showSigned(html, hash);
  }

  function showSigned(html, hash) {
    renderDocs();
    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var pay = ((window.G2_LINKS || {})[st.plan] || "").trim();
    var payUrl = pay ? pay + (pay.indexOf("?") > -1 ? "&" : "?") + "prefilled_email=" + encodeURIComponent(st.email) + "&client_reference_id=" + encodeURIComponent(st.id) : "";
    $("#enroll-steps").hidden = true; $("#plan-pick").hidden = true;
    var done = $("#signed"); done.hidden = false;
    done.innerHTML = "<div class='signed-card'><p class='eyebrow'>STEP 2 OF 2</p><h2>Signed. Your copy is ready.</h2>" +
      "<p>Order ID <b>" + st.id + "</b> · signed " + esc(stamp(st.signedAt)) + "</p>" +
      "<div class='actions'><a class='btn btn-ghost' href='" + url + "' download='G2-Fitness-Agreement-" + st.id + ".html'>Download signed agreement</a>" +
      "<button class='btn btn-ghost' type='button' id='print-btn'>Print / Save as PDF</button></div>" +
      (payUrl
        ? "<p>Next, pay " + money(order(st).initial) + " securely with Stripe. Your monthly " + money(order(st).plan.rate) + " payments begin March 1, 2027.</p><div class='actions'><a class='btn btn-primary' href='" + payUrl + "'>Continue to secure payment</a></div>"
        : "<p>Online payment for this plan opens shortly. G2 Fitness will email you a secure payment link for " + money(order(st).initial) + ".</p>") +
      "<p class='fine'>Keep your signed copy. Document fingerprint: <code>" + hash.slice(0, 16) + "…</code></p></div>";
    $("#print-btn").addEventListener("click", function () { var w = window.open(url, "_blank"); if (w) w.addEventListener("load", function () { w.print(); }); });
    done.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // completion page (after Stripe)
  var complete = $("#enroll-complete");
  if (complete) {
    var id = load("g2_last_order"), html = id && load("g2_signed_" + id);
    if (html) {
      var u = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      $("#complete-copy").innerHTML = "<p>Order ID <b>" + esc(id) + "</b></p><div class='actions'><a class='btn btn-ghost' href='" + u + "' download='G2-Fitness-Agreement-" + esc(id) + ".html'>Download signed agreement</a></div>";
    }
    return;
  }

  // init
  if (new Date() >= ACTIVATION_CUTOFF) {
    root.innerHTML = "<div class='signed-card'><h2>Online presale enrollment has closed.</h2><p>Please contact G2 Fitness to enroll.</p><a class='btn btn-primary' href='/sign-up/#contact'>Contact G2</a></div>";
    return;
  }
  $$(".plan-opt").forEach(function (el) { el.addEventListener("click", function () { choosePlan(el.dataset.plan); }); });
  $("#enroll-form").addEventListener("input", function () { readForm(); if (st.plan) { renderDocs(); } $("#errors").hidden = true; });
  $("#mod-none").addEventListener("change", function () { if (this.checked) $$("input[name=modality]").forEach(function (c) { c.checked = false; }); $("#ini-recovery-wrap").hidden = this.checked; });
  $$("input[name=modality]").forEach(function (c) { c.addEventListener("change", function () { if (c.checked) { $("#mod-none").checked = false; $("#ini-recovery-wrap").hidden = false; } }); });
  $("#enroll-form").addEventListener("submit", submit);
  $("#review-print").addEventListener("click", function () {
    var w = window.open("", "_blank"); if (!w) return;
    w.document.write("<!doctype html><html><head><meta charset='utf-8'><title>G2 Fitness agreement for review</title><style>" + DOC_CSS + "</style></head><body><h1>G2 Fitness — agreement and attachments (for review, unsigned)</h1>" + bundle(st) + "</body></html>");
    w.document.close();
  });
  var want = new URLSearchParams(location.search).get("plan");
  if (want && PLANS[want]) choosePlan(want);
})();
