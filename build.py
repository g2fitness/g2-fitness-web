#!/usr/bin/env python3
"""Builds the G2 Fitness static site into ./public. Run: python3 build.py"""
import html, os, shutil
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "public")
CDN = "https://dgpv43ylujmyh.cloudfront.net/optimized-images/1200x/media/"
# Local file first; falls back to the old image host until you add your own copies to /images.
IMAGES = {
    "logo": ("/images/logo.png", CDN + "a1e4913d-4928-4b74-bb05-e8f4af0d6cf2/1789742323487-a4c056e3df41.jpg"),
    "trevon": ("/images/trevon.jpg", CDN + "5e882027-8425-421d-8b9c-1198807d5ee6/6e194c8257dc4a20-trevon-headshot.jpg"),
    "parisi": ("/images/parisi.jpg", CDN + "5e882027-8425-421d-8b9c-1198807d5ee6/539eb1bb9ed4631e-parisi-black.jpg"),
}
SITE = "https://www.g2fitness.org"
ADDRESS = "2470 Daniells Bridge Rd, Bldg 100, Ste B1, Athens, GA"
IG = "https://www.instagram.com/_g2_fitness/"
FB = "https://www.facebook.com/G2CoachTre"

NAV = [("HOME", "/"), ("ABOUT", "/about/"), ("GYM MEMBERSHIPS", "/professional-fitness/"),
       ("ATHLETIC TRAINING", "/training/"), ("TEAMS", "/team-training/"), ("PRICES", "/memberships/"),
       ("SCHEDULE", "/schedule/")]

SEPARATE = ("Gym membership does not automatically include athletic training. Athletic enrollment does "
            "not automatically provide independent gym access. Youth training is supervised.")
RECOVERY = ("24/7 controlled gym access and the Recovery Room: cold plunges, an infrared light therapy booth, "
            "complete percussion therapy and complete compression therapy.")
UNLIMITED = ("Unlimited weekly attendance at scheduled sessions within your assigned program. No class booking "
             "is required. Age-appropriate placement, class capacity and the published calendar apply.")
FOUNDING = ("First 40 group memberships across the four programs. Nine-month initial commitment; founding rate "
            "locked for 12 paid months with continuous membership. Initial evaluation included. No initiation "
            "fee or stacked discounts.")
PEAK_RULES = ("Book every PEAK session. Give at least 48 hours notice to cancel or reschedule and retain your "
              "visit credit. Late cancellations and no-shows use one visit. Unused monthly visits expire except "
              "approved makeups. The ten-visit package expires 90 days after paid service activation. If G2 "
              "cancels, your credit is restored and a makeup or applicable prorate is offered.")
NOTICE = ("Complimentary January 2027 previews: dates announced separately. Training begins February 1, 2027, "
          "subject to approved opening readiness. Enrollment opens November 15, 2026.")

e = html.escape


def img(key, alt, cls=""):
    local, remote = IMAGES[key]
    return (f'<img src="{local}" alt="{e(alt)}" class="{cls}" loading="lazy" '
            f'onerror="this.onerror=null;this.src=\'{remote}\'">')


def btn(label, href, kind="primary", enroll=None):
    data = f' data-enroll="{enroll}"' if enroll else ""
    return f'<a class="btn btn-{kind}" href="{href}"{data}>{e(label)}</a>'


def hero(eyebrow, title, text, buttons, accent=None, photo=False):
    t = e(title)
    if accent:
        t = t.replace(e(accent), f'<span class="accent">{e(accent)}</span>')
    copy = (f'<p class="eyebrow pill">{e(eyebrow)}</p><h1>{t}</h1><p class="lead">{e(text)}</p>'
            f'<div class="actions">{"".join(buttons)}</div>')
    if photo:
        return (f'<section class="hero has-photo"><div class="wrap hero-grid"><div class="hero-copy">{copy}</div>'
                '<figure class="hero-media"><img src="/images/hero.png" alt="G2 Fitness front desk with the lit G2 logo and the words Built Through Discipline" '
                'width="1183" height="1024" fetchpriority="high"></figure></div></section>')
    return f'<section class="hero"><div class="wrap">{copy}</div></section>'


def section(eyebrow, title, intro, body, alt=False, sid=""):
    idattr = f' id="{sid}"' if sid else ""
    return f'''<section class="section{' alt' if alt else ''}"{idattr}><div class="wrap">
{f'<p class="eyebrow">{e(eyebrow)}</p>' if eyebrow else ''}{f'<h2>{e(title)}</h2>' if title else ''}
{f'<p class="intro">{e(intro)}</p>' if intro else ''}{body}</div></section>'''


def card(title, text, buttons=(), tag="", price="", extra_cls=""):
    return f'''<article class="card {extra_cls}">{f'<p class="tag">{e(tag)}</p>' if tag else ''}
<h3>{e(title)}</h3>{f'<p class="price">{e(price)}</p>' if price else ''}<p>{e(text)}</p>
<div class="card-actions">{"".join(buttons)}</div></article>'''


def grid(cards, cols=3):
    return f'<div class="grid cols-{cols}">{"".join(cards)}</div>'


def steps(items):
    out = "".join(f'<li><span class="num">{i:02d}</span><h3>{e(t)}</h3><p>{e(d)}</p></li>'
                  for i, (t, d) in enumerate(items, 1))
    return f'<ol class="steps">{out}</ol>'


def faq(items):
    return '<div class="faq">' + "".join(
        f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in items) + "</div>"


def founder(text, title="MEET TREVON ALLEN", eyebrow="THE G2 STANDARD"):
    return f'''<section class="section founder"><div class="wrap split">
<div><p class="eyebrow">{e(eyebrow)}</p><h2>{e(title)}</h2><p>{e(text)}</p></div>
<div class="photo">{img("trevon", "Trevon Allen, founder of G2 Fitness")}</div></div></section>'''


def pillars(sub, items):
    return section("", "DEVELOPMENT. PROGRESSION. LONGEVITY.", sub, steps(items), alt=True)


def parisi(extra=""):
    return f'''<section class="section parisi"><div class="wrap center">
<p class="eyebrow">G2 FITNESS — OFFICIAL PARISI SPEED SCHOOL AFFILIATE</p>
{img("parisi", "Parisi Speed School", "parisi-logo")}{extra}</div></section>'''


def follow():
    return f'''<section class="section follow"><div class="wrap center">
<h2>KEEP YOUR STANDARD HIGH. FOLLOW G2.</h2><div class="actions center">
{btn("Instagram", IG, "ghost")}{btn("Facebook", FB, "ghost")}</div></div></section>'''


def path_cta(first=("Explore Gym Memberships", "/professional-fitness/")):
    return f'''<section class="section cta"><div class="wrap center">
<p class="eyebrow">DEVELOPMENT. PROGRESSION. LONGEVITY.</p><h2>FIND YOUR G2 PATH.</h2>
<p class="intro">{e(SEPARATE)}</p><div class="actions center">
{btn(first[0], first[1])}{btn("View Membership Prices", "/memberships/", "ghost")}</div></div></section>'''


def layout(path, title, desc, body, extra_js=""):
    canonical = SITE + path
    nav = "".join(f'<li><a href="{h}"{" aria-current=page" if h == path else ""}>{l}</a></li>' for l, h in NAV)
    logo_local, logo_remote = IMAGES["logo"]
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{canonical}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="G2 Fitness">
<meta property="og:image" content="{SITE}{logo_local}"><meta name="twitter:card" content="summary">
<link rel="icon" href="{logo_local}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css"></head><body>
<div class="announce">{e(NOTICE)}</div>
<header class="site-header"><div class="wrap bar">
<a class="brand" href="/">{img("logo", "G2 Fitness")}</a>
<button class="menu-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
<nav id="nav"><ul>{nav}<li class="login-item"><a href="#" data-enroll="member-login" class="login-link" hidden>MEMBER LOGIN</a></li></ul>
{btn("CONTACT G2", "/sign-up/#contact", "contact small")}</nav></div></header>
<main>{body}</main>
<footer class="site-footer"><div class="wrap fgrid">
<div><a class="brand" href="/">{img("logo", "G2 Fitness")}</a><h2>G2 Fitness</h2><p>Development. Progression. Longevity.</p>{btn("CONTACT G2", "/sign-up/#contact", "primary small")}</div>
<div><h3>Explore G2</h3><ul><li><a href="/">Home</a></li><li><a href="/about/">About</a></li><li><a href="/professional-fitness/">Gym Memberships</a></li><li><a href="/training/">Athletic Training</a></li><li><a href="/team-training/">Team Training</a></li></ul></div>
<div><h3>Plan Your Training</h3><ul><li><a href="/memberships/">Membership Prices</a></li><li><a href="/schedule/">Proposed Schedule</a></li><li><a href="/sign-up/">Evaluation Information</a></li></ul></div>
<div><h3>Find G2</h3><address>{e(ADDRESS)}</address><p><a href="{FB}">Facebook</a> · <a href="{IG}">Instagram</a></p></div>
</div><div class="wrap legal"><p>© 2026 G2 Fitness. All rights reserved.</p></div></footer>
<script src="/js/links.js"></script><script src="/js/site.js"></script>{extra_js}</body></html>'''


# ---------------- Pages ----------------
PROGRAMS = [
    ("Basic Strength", "Middle school only. Movement quality, bodyweight control and progressive strength.", "/training/"),
    ("Total Performance", "Middle school. Acceleration, deceleration, multidirectional movement and foundational strength.", "/training/"),
    ("Elite Sports Performance", "High school. Advanced speed, power and strength for sport.", "/training/"),
    ("Advanced Strength", "High school. Progressive strength loading after movement competency and readiness are demonstrated.", "/training/"),
    ("PEAK", "All ages by evaluation. Individualized semi-private training, with age-compatible groups and a maximum of 16 athletes per session, regardless of coach count.", "/training/"),
    ("Team Training", "All grade levels. Coached development for school, club and travel teams.", "/team-training/"),
]

GYM_PLANS = [
    ("G2 Strength & Fitness Membership", "gym-strength-fitness", "$139/month founding",
     f"Founding $139/month; regular $159/month. Includes {RECOVERY} Applicable $50 annual access credential. Due at enrollment: $189 founding or $209 regular (first month plus credential). Athletic training is separate. No athlete evaluation or class booking required."),
    ("G2 Coached Strength Membership", "gym-coached-strength", "$199/month founding",
     f"Founding $199/month; regular $229/month. Includes {RECOVERY} Plus two coached strength sessions each week (Tuesday 8:00 PM and Saturday 12:00 PM). Applicable $50 annual access credential. Due at enrollment: $249 founding or $279 regular (first month plus credential). Athletic training is separate. No athlete evaluation or class booking required."),
]


def gym_cards():
    return grid([card(n, t, [btn("Enroll Now", f"/enroll/?plan={k}-founding"),
                             btn("Ask a Question", "/sign-up/#contact", "ghost")], "GYM MEMBERSHIP", p)
                 for n, k, p, t in GYM_PLANS], 2)


def home():
    b = hero("G2 FITNESS / ATHENS, GA", "YOUR GYM. YOUR G2. YOUR DEVELOPMENT.",
             "G2 Fitness in Athens, Georgia offers regular gym memberships and separate athletic training programs. "
             f"Join the gym with {RECOVERY} Or explore coached athletic development for athletes and teams.",
             [btn("Explore Gym Memberships", "/professional-fitness/"), btn("Explore Athletic Training", "/training/", "ghost")],
             accent="YOUR G2.", photo=True)
    b += founder("Trevon Allen is the owner and founder of G2 Fitness, a veteran, and a performance coach. His approach "
                 "combines disciplined coaching with purposeful progression in strength, speed, and athletic development "
                 "to help athletes and adults build lasting capability. Development. Progression. Longevity.")
    b += section("G2 FITNESS", "Gym Memberships and Athletic Training", SEPARATE, grid([
        card("Gym Memberships", RECOVERY, [btn("Explore Gym Memberships", "/professional-fitness/")]),
        card("Middle & High School Athletes", "Readiness-based placement in four athlete group programs. " + UNLIMITED,
             [btn("Explore Athletic Training", "/training/")])], 2), alt=True)
    b += section("G2 FITNESS", "Explore Our Athletic Programs",
                 "Six distinct offerings. Gym membership and athletic enrollment are separate.",
                 grid([card(n, t, [btn(f"Explore {n}", h, "ghost")]) for n, t, h in PROGRAMS]))
    b += pillars("The G2 foundation.", [
        ("Development", "Build strength, speed, movement quality and consistent training habits."),
        ("Progression", "Advance with purposeful programming, attention to detail and accountability."),
        ("Longevity", "Develop capabilities that support growth beyond the next workout or season.")])
    b += follow()
    b += section("G2 FITNESS", "Official Parisi Speed School Affiliate",
                 "Purposeful speed, strength and movement development for athletes at G2 Fitness.", grid([
                     card("Athlete Evaluation", "$75 for a 60-minute appointment; included for eligible founding group members.",
                          [btn("Evaluation Information", "/sign-up/")]),
                     card("School-Year Training", "Complimentary January 2027 previews: dates announced separately. Training begins "
                          "February 1, 2027, subject to approved opening readiness. Enrollment opens November 15, 2026.",
                          [btn("View School-Year Schedule", "/schedule/")])], 2), alt=True)
    b += parisi() + path_cta()
    return layout("/", "Gym Memberships & Athletic Training in Athens | G2 Fitness",
                  "Explore G2 Fitness gym memberships with 24/7 access and Recovery Room services, plus separate athletic development for athletes and teams in Athens, Georgia.", b)


def about():
    b = hero("G2 FITNESS / ATHENS, GA", "A PURPOSE. A LASTING STANDARD.", "Meet Trevon Allen and the philosophy behind G2 Fitness.",
             [btn("Explore Athletic Training", "/training/"), btn("View Membership Prices", "/memberships/", "ghost")])
    b += founder("Trevon Allen is the owner and founder of G2 Fitness, a veteran, and a performance coach. His approach combines "
                 "disciplined coaching with purposeful progression in strength, speed, and athletic development to help athletes "
                 "and adults build lasting capability. Train with intention, progress with purpose, and build something that lasts. "
                 "Trevon is a Certified Parisi Speed Coach, NASM Certified Personal Trainer and NASM Youth Exercise Specialist. "
                 "G2 Fitness is an Official Parisi Speed School Affiliate.")
    b += pillars("The foundation of G2 Fitness.", [
        ("Development", "Build movement quality, strength and confidence."),
        ("Progression", "Advance when competency and readiness are demonstrated."),
        ("Longevity", "Develop habits and capabilities that support long-term growth.")])
    b += section("G2 FITNESS", "For Parents", "Youth training is supervised. Athletic membership does not include independent 24/7 gym access.", grid([
        card("Readiness-Based Placement", "Evaluation guides age-appropriate program placement. Coach-approved changes update the assigned program.", [btn("Evaluation Information", "/sign-up/")]),
        card("Supervised Youth Training", "Middle school and high school programs develop athletes in appropriate training groups.", [btn("Explore Programs", "/training/")]),
        card("Progress Reviews", "Review progress every 8–12 weeks and adjust development priorities.", [btn("View School-Year Schedule", "/schedule/")])]))
    b += follow() + parisi() + path_cta()
    return layout("/about/", "Meet Trevon Allen | G2 Fitness Athens",
                  "Meet G2 Fitness founder Trevon Allen and learn about supervised youth development, readiness-based placement and Parisi Speed School affiliation.", b)


def gym():
    b = hero("G2 FITNESS / ATHENS, GA", "GYM MEMBERSHIPS.", f"Join the G2 Fitness gym with {RECOVERY}",
             [btn("Enroll in a Gym Membership", "#plans"), btn("Compare Memberships", "/memberships/", "ghost")])
    b += section("GYM MEMBERSHIPS", "Gym Memberships", "Regular G2 Fitness gym membership. Athletic training is enrolled separately.", gym_cards(), sid="plans")
    b += section("G2 FITNESS", "Your Gym. Your Recovery.", "Included in both regular gym plans.", grid([
        card("Controlled Access", "24/7 controlled gym access following eligibility checks and onboarding."),
        card("Recovery Room", "Cold plunges, an infrared light therapy booth, complete percussion therapy and complete compression therapy."),
        card("Coached Strength", "Choose G2 Coached Strength Membership to add two coached strength sessions per week. No individual class reservation is required.")]), alt=True)
    b += section("", "How Gym Enrollment Works", "No athlete performance evaluation is required.", steps([
        ("Compare Your Plans", "Select G2 Strength & Fitness Membership or G2 Coached Strength Membership."),
        ("Enroll and Sign Online", "Enroll from November 15, 2026. Your first month plus the $50 annual access credential is paid at enrollment and held in escrow until opening; monthly payments begin March 1, 2027."),
        ("Complete Onboarding", "Verify eligibility and complete onboarding and waivers. Review the applicable $50 annual access credential.")]))
    b += path_cta()
    return layout("/professional-fitness/", "Gym Memberships in Athens | G2 Fitness",
                  "Choose G2 Strength & Fitness or G2 Coached Strength. Both include 24/7 controlled gym access and Recovery Room services.", b)


def training():
    b = hero("G2 FITNESS / ATHENS, GA", "Develop the Athlete Behind the Sport.", "Strength. Speed. Power. Movement. Official Parisi Speed School Affiliate.",
             [btn("Evaluation Information", "/sign-up/"), btn("View School-Year Schedule", "/schedule/", "ghost")])
    b += section("G2 FITNESS", "Athletic Training", SEPARATE,
                 grid([card(n, t, [btn("View Prices", "/memberships/#" + n.lower().replace(" ", "-"), "ghost")]) for n, t, _ in PROGRAMS]))
    b += founder("Trevon Allen brings disciplined coaching to strength, speed and athletic development. Certified Parisi Speed Coach, "
                 "NASM Certified Personal Trainer and NASM Youth Exercise Specialist.", "A COACH. A PLAN. A PURPOSE.", "COACHING WITH INTENTION")
    b += section("", "Your Athletic Training Pathway", "Enrollment opens November 15, 2026.", steps([
        ("Review the Evaluation", "Initial evaluation: $75 for a 60-minute appointment, included for an eligible founding group member."),
        ("Complete Intake and Placement", "Complete athlete/guardian profiles, intake and waivers. G2 assigns an age- and readiness-appropriate program."),
        ("Enroll", "Choose your program and term on the prices page, or contact G2 to discuss your athlete and the appropriate program.")]), alt=True)
    b += section("GOOD TO KNOW", "Attendance and Program Access", "Clear expectations before you enroll.", faq([
        ("Do athlete groups need class bookings?", UNLIMITED),
        ("Can I attend another group program?", "Access is limited to your assigned program. Coach-approved placement changes update that assignment."),
        ("Who can join PEAK?", "All ages by evaluation, in age-compatible groups. PEAK is individualized semi-private training with no more than 16 athletes per session, regardless of coach count."),
        ("What is included with founding membership?", FOUNDING)]))
    b += parisi() + path_cta(("Explore Athletic Training", "/training/"))
    return layout("/training/", "Athletic Training & Parisi Affiliate in Athens | G2 Fitness",
                  "Explore middle school and high school development, all-ages PEAK and Team Training at G2 Fitness, an Official Parisi Speed School Affiliate.", b)


TEAM_TEXT = ("Eight coached 50-minute sessions per month; up to 16 athletes across two coaches. Three-month term; $6,000 minimum. "
             "Team screening included. Assigned team blocks confirmed in the agreement.")


def teams():
    b = hero("G2 FITNESS / ATHENS, GA", "DEVELOP YOUR TEAM.", "Coached development for school, club and travel teams across all grade levels.",
             [btn("Request Team Information", "/sign-up/?interest=Team+Training#contact"), btn("Request a Custom Team Quote", "/sign-up/?interest=Team+Training#contact", "ghost")])
    b += section("TEAM TRAINING", "Team Training", "One standard offer. Team athletes follow the agreed schedule without individual reservations.",
                 grid([card("G2 Team Training", TEAM_TEXT, [btn("Request Team Information", "/sign-up/?interest=Team+Training#contact")], "TEAM TRAINING", "$2,000/team/month")], 1))
    b += section("G2 FITNESS", "Custom Team Options", "Larger rosters, off-site delivery and travel are quoted separately.", grid([
        card("Custom Delivery", "Tell G2 your roster size, location and travel needs.", [btn("Request a Custom Team Quote", "/sign-up/?interest=Team+Training#contact")]),
        card("Flexible Funding", "School, club, booster, parent fundraising and sponsor funding options are available to discuss.", [btn("Discuss Team Funding", "/sign-up/?interest=Team+Training#contact")])], 2), alt=True)
    b += section("G2 FITNESS", "How Team Enrollment Works", "An authorized organizer manages one roster and a single payer.", grid([
        card("Team Screening", "Included with the standard offer.", [btn("View Schedule", "/schedule/", "ghost")]),
        card("Assigned Training Blocks", "Eight coached 50-minute sessions monthly, confirmed in your team agreement. No individual athlete booking.", [btn("View Schedule", "/schedule/", "ghost")]),
        card("Three-Month Commitment", "$2,000 monthly; $6,000 minimum. Up to 16 athletes with two coaches.", [btn("View Membership Prices", "/memberships/", "ghost")])]))
    b += section("", "Request Team Information", "Contact G2 about the standard offer or a custom quote.", steps([
        ("Choose the Offer", "Select the standard team offer or request a custom quote for exceptions."),
        ("Complete Team Onboarding", "The authorized organizer supplies the roster and completes the agreement with assigned team blocks."),
        ("Confirm Next Steps", "G2 will confirm the team agreement, assigned blocks, start date and payment.")]), alt=True)
    b += path_cta(("Explore Athletic Training", "/training/"))
    return layout("/team-training/", "Team Training in Athens | G2 Fitness",
                  "G2 coached team training: eight sessions monthly, up to 16 athletes across two coaches, $2,000 per month with a three-month commitment.", b)


# name, middle/high label, founding, 9mo, 3mo, flex prices, 9-month founding min, 9-month min, 3-month min
ATHLETE = [
    ("Basic Strength", "Middle school only.", 149, 159, 209, 259, "$1,341", "$1,431", "$627"),
    ("Total Performance", "Middle school.", 179, 189, 239, 289, "$1,611", "$1,701", "$717"),
    ("Elite Sports Performance", "High school.", 199, 209, 259, 309, "$1,791", "$1,881", "$777"),
    ("Advanced Strength", "High school, readiness-based.", 179, 189, 239, 289, "$1,611", "$1,701", "$717"),
]


def slug(s):
    return s.lower().replace(" ", "-").replace("&", "and")


def prices():
    b = hero("G2 FITNESS / ATHENS, GA", "MEMBERSHIPS AND TRAINING.",
             "Compare gym memberships and separate athletic training programs. Enrollment opens November 15, 2026. "
             "Your first month is paid at enrollment and held in a state-required escrow account until opening. Paid service begins February 1, 2027 or the later approved activation date; monthly payments begin March 1, 2027.",
             [btn("Ask G2 a Question", "/sign-up/#contact"), btn("View School-Year Schedule", "/schedule/", "ghost")])
    b += section("GYM MEMBERSHIPS", "Gym Memberships", SEPARATE, gym_cards())
    alt = True
    for n, lvl, f, m9, m3, fx, fmin, m9min, m3min in ATHLETE:
        s = slug(n)
        cards = [
            card(f"{n} — Founding", f"{lvl} {UNLIMITED} Initial 9-month minimum: {fmin}. {FOUNDING}",
                 [btn("Request Enrollment", "/sign-up/?interest=" + quote(n) + "#contact")], "ATHLETIC TRAINING", f"${f}/month", "featured"),
            card(f"{n} — 9-Month", f"{lvl} {UNLIMITED} Initial 9-month minimum: {m9min}.",
                 [btn("Request Enrollment", "/sign-up/?interest=" + quote(n) + "#contact")], "ATHLETIC TRAINING", f"${m9}/month"),
            card(f"{n} — 3-Month", f"{lvl} {UNLIMITED} Initial 3-month minimum: {m3min}.",
                 [btn("Request Enrollment", "/sign-up/?interest=" + quote(n) + "#contact")], "ATHLETIC TRAINING", f"${m3}/month"),
            card(f"{n} — Flex", f"{lvl} {UNLIMITED} 30 days written notice to terminate; no fixed-term total.",
                 [btn("Request Enrollment", "/sign-up/?interest=" + quote(n) + "#contact")], "ATHLETIC TRAINING", f"${fx}/month"),
        ]
        b += section(f"{n.upper()} MEMBERSHIPS", f"{n} Memberships",
                     "Athletic Training Memberships. Term length changes price and commitment, not attendance allowance.",
                     grid(cards, 4), alt=alt, sid=s)
        alt = not alt
    b += section("PEAK — ALL AGES BY EVALUATION", "PEAK — All Ages by Evaluation",
                 "Individualized semi-private training in age-compatible groups. Maximum 16 athletes per session, regardless of coach count.", grid([
                     card("PEAK 8 Visits", "Eight visits per month. Three-month initial term; $1,197 minimum. Booking required; maximum 16 athletes per session, regardless of coach count.",
                          [btn("Request Enrollment", "/sign-up/?interest=PEAK#contact")], "ALL AGES BY EVALUATION", "$399/month"),
                     card("PEAK 12 Visits", "Twelve visits per month. Three-month initial term; $1,647 minimum. Booking required; maximum 16 athletes per session, regardless of coach count.",
                          [btn("Request Enrollment", "/sign-up/?interest=PEAK#contact")], "ALL AGES BY EVALUATION", "$549/month"),
                     card("PEAK 10-Visit Package", "Ten prepaid visits. Expires 90 days after paid service activation. Booking required; age-compatible groups and maximum 16 athletes per session, regardless of coach count.",
                          [btn("Request Enrollment", "/sign-up/?interest=PEAK#contact")], "ALL AGES BY EVALUATION", "$500/one-time")]), alt=alt, sid="peak")
    b += section("TEAM TRAINING", "Team Training", "All grade levels. Team screening included.",
                 grid([card("G2 Team Training", TEAM_TEXT, [btn("Request Team Information", "/sign-up/?interest=Team+Training#contact")], "TEAM TRAINING", "$2,000/team/month")], 1),
                 alt=not alt, sid="team-training")
    b += section("GOOD TO KNOW", "Membership and Presale Terms", "Clear expectations before you enroll.", faq([
        ("How do gym and athletic memberships differ?", SEPARATE),
        ("What is the founding group offer?", FOUNDING),
        ("When does enrollment open and billing begin?", "Enrollment opens November 15, 2026. Your initial payment (the first month, plus the $50 annual access credential for regular gym "
         "memberships, or the one-time package or evaluation) is collected at enrollment and deposited into a state-required presale escrow account "
         "until opening. It prepays your first service month; there is no second charge on February 1. Paid service begins February 1, 2027 or the "
         "later approved activation date, and monthly payments begin March 1, 2027. You may cancel for a full refund within seven business days after "
         "the facility becomes fully operational. January previews are complimentary and do not start paid commitments or use paid credits."),
        ("How do cancellation and renewal work?", "Flex requires 30 days written notice. Commitment plans renew monthly after the initial term unless "
         "30 days notice is given. Founding rate locks require continuous membership. Membership holds and early termination are separate "
         "from appointment cancellation policies; ask staff to review an exception before purchase."),
        ("What are the PEAK booking rules?", PEAK_RULES),
        ("What does the annual credential cover?", "The $50 annual access credential applies only to regular gym memberships, at paid activation "
         "and every 12 months afterward. No credential fee applies to athlete-only programs, complimentary previews or test provisioning.")]))
    return layout("/memberships/", "Gym & Athletic Training Membership Prices | G2 Fitness",
                  "Compare G2 gym memberships, athlete group programs, all-ages PEAK and Team Training. Review monthly prices, commitments and founding offers.", b)


def schedule():
    pending = ("The previous proposed times are being replaced by a sequential calendar. Final times will be posted after coach "
               "confirmation. Training lasts 50 minutes with ten-minute transitions; evaluations last 60 minutes.")
    soon = card("Updated times pending confirmation", "No class reservations are open yet. Saturday coached activities will be "
                "between 9 AM and 1 PM; January preview dates will be announced separately.", tag="COMING SOON")
    b = hero("G2 FITNESS / ATHENS, GA", "SCHOOL-YEAR SCHEDULE.",
             "An updated sequential training calendar is being reviewed by Coach Tre. Final times will be posted after confirmation. "
             "Training begins February 1, 2027, subject to approved opening readiness. Complimentary January preview dates will be "
             "announced separately. All times will be Athens local time (America/New_York).",
             [btn("Explore Athletic Training", "/training/"), btn("View Membership Prices", "/memberships/", "ghost")])
    for i, t in enumerate(["Group Training Calendar", "PEAK and Evaluation Appointments", "Weekend Training Calendar"]):
        b += section("SCHEDULE CONFIRMATION PENDING", t, pending, grid([soon], 1), alt=i % 2 == 1)
    b += section("GOOD TO KNOW", "Attendance and Calendar Rules", "Clear expectations before you enroll.", faq([
        ("Do group athletes reserve classes?", UNLIMITED),
        ("How are PEAK visits handled?", PEAK_RULES),
        ("How do teams attend?", "Teams use eight contracted sessions per month and their assigned schedule. Athletes do not make individual reservations."),
        ("What about closures and fifth weeks?", "Holiday closures, makeup dates and fifth-week exceptions will be published before the affected training period. Team allocation remains eight sessions per month."),
        ("When are Saturday sessions?", "All Saturday activities begin at or after 9 AM and finish by 1 PM. No Saturday evening evaluation appointments.")]), alt=True)
    return layout("/schedule/", "Proposed School-Year Training Schedule | G2 Fitness",
                  "View the proposed G2 Fitness school-year schedule in Athens, Georgia. Group training, PEAK, team blocks and athlete evaluations.", b)


INTERESTS = ["G2 Strength & Fitness Membership", "G2 Coached Strength Membership", "Basic Strength", "Total Performance",
             "Elite Sports Performance", "Advanced Strength", "PEAK", "Team Training", "Athlete Evaluation", "Other question"]


def contact():
    opts = "".join(f"<option>{e(i)}</option>" for i in INTERESTS)
    form = f'''<form class="contact-form" name="contact" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact"><p class="hp"><label>Leave blank <input name="bot-field"></label></p>
<div class="row"><label>Name<input name="name" required autocomplete="name"></label>
<label>Email<input type="email" name="email" required autocomplete="email"></label></div>
<div class="row"><label>Phone (optional)<input type="tel" name="phone" autocomplete="tel"></label>
<label>I'm interested in<select name="interest" id="interest"><option value="">Choose one</option>{opts}</select></label></div>
<label>Athlete grade (if applicable)<input name="athlete_grade" placeholder="e.g. 8th grade"></label>
<label>Message<textarea name="message" rows="5" required></textarea></label>
<button class="btn btn-primary" type="submit">Send to G2</button>
<p class="fine">This inquiry does not enroll you or collect payment.</p></form>'''
    b = hero("G2 FITNESS / ATHENS, GA", "CHOOSE YOUR G2 PATH.",
             "Explore gym memberships and separate athletic training programs. Enrollment opens November 15, 2026. Use the form below for questions.",
             [btn("Gym Membership", "/professional-fitness/"), btn("Athletic Training", "/training/", "ghost")])
    b += section("G2 FITNESS", "Explore Your Options", "Compare your options and contact G2 for help.", grid([
        card("Gym Membership", "Compare G2 Strength & Fitness and G2 Coached Strength. No athlete evaluation is required.", [btn("Choose a Gym Plan", "/professional-fitness/")]),
        card("Athletic Training", "Explore athlete groups, PEAK and Team Training. Placement and evaluation requirements depend on the program.", [btn("Explore Athletic Training", "/training/")])], 2))
    b += section("", "Athlete Evaluation Information", "Evaluation: $75 for 60 minutes, included for eligible founding group members.", steps([
        ("Request an Evaluation", "Send the form below and choose “Athlete Evaluation.” G2 will reply with available times once the schedule is confirmed."),
        ("Complete Intake and Waiver", "Athlete/guardian intake, waiver and founding eligibility checks are completed before the appointment."),
        ("Get Your Placement", "G2 assigns an age- and readiness-appropriate program after the evaluation.")]), alt=True)
    b += section("OPTIONAL CONTACT", "QUESTIONS? WE CAN HELP.", "Contact G2 if you need help choosing a path.", form, sid="contact")
    return layout("/sign-up/", "Contact G2 | Gym and Athletic Training Information",
                  "Ask G2 Fitness about gym memberships, athletic programs and evaluations.", b)


def thanks():
    b = hero("G2 FITNESS", "THANK YOU.", "Your message reached G2. Coach Tre will get back to you soon.",
             [btn("Back to Home", "/"), btn("View Membership Prices", "/memberships/", "ghost")])
    return layout("/thanks/", "Thank You | G2 Fitness", "Your message was sent to G2 Fitness.", b)


def notfound():
    b = hero("G2 FITNESS", "PAGE NOT FOUND.", "That page doesn't exist. Try one of these instead.",
             [btn("Home", "/"), btn("Membership Prices", "/memberships/", "ghost")])
    return layout("/404/", "Page Not Found | G2 Fitness", "Page not found.", b)


ENROLL_FIELDS = ["order_id", "document_version", "document_sha256", "plan_key", "plan_name", "tier", "monthly_rate",
                 "initial_payment", "buyer_name", "dob", "email", "phone", "street", "city", "state", "zip",
                 "emergency_contact", "emergency_phone", "recovery_modalities", "initials_release", "initials_unattended",
                 "initials_recovery", "agreement_signature", "payment_signature", "waiver_attested", "documents_reviewed",
                 "signed_at", "signed_at_local", "user_agent"]


def enroll():
    hidden = ('<form name="enrollment" data-netlify="true" netlify-honeypot="bot-field" hidden>'
              '<input name="bot-field">' + "".join(f'<input name="{f}">' for f in ENROLL_FIELDS) +
              '<textarea name="signed_document"></textarea></form>')
    opts = "".join(
        f'<button type="button" class="plan-opt" data-plan="{k}" aria-pressed="false"><span class="tag">{tier}</span>'
        f'<b>{e(name)}</b><span class="po-price">${rate}/mo</span><span class="po-due">${rate + 50} due at enrollment</span></button>'
        for k, name, tier, rate in [
            ("gym-strength-fitness-founding", "Strength & Fitness", "FOUNDING", 139),
            ("gym-strength-fitness-regular", "Strength & Fitness", "REGULAR", 159),
            ("gym-coached-strength-founding", "Coached Strength", "FOUNDING", 199),
            ("gym-coached-strength-regular", "Coached Strength", "REGULAR", 229)])
    mods = "".join(f'<label class="chk"><input type="checkbox" name="modality" value="{m}"> {m}</label>'
                   for m in ["Cold plunge", "Infrared booth", "Percussion", "Compression"])
    b = f'''<section class="section enroll"><div class="wrap" id="enroll-app">
<p class="eyebrow pill">GYM MEMBERSHIP ENROLLMENT</p><h1 class="enroll-h">Join G2 Fitness.</h1>
<p class="intro">Choose your membership, review your agreement, sign, then pay securely. About five minutes.</p>
<div id="plan-pick"><h2 class="step-h"><span>1</span> Choose your membership</h2><div class="plan-grid">{opts}</div></div>
<form id="enroll-form" novalidate><div id="enroll-steps" hidden>
<h2 class="step-h"><span>2</span> Your order</h2><div class="sum card" id="summary"></div>
<h2 class="step-h"><span>3</span> Your details</h2><div class="card fields">
<div class="row"><label>Full legal name<input name="name" autocomplete="name" required></label><label>Date of birth<input type="date" name="dob" required></label></div>
<div class="row"><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Mobile phone<input type="tel" name="phone" autocomplete="tel" required></label></div>
<label>Street address<input name="street" autocomplete="street-address" required></label>
<div class="row three"><label>City<input name="city" autocomplete="address-level2" required></label><label>State<input name="state" autocomplete="address-level1" maxlength="2" placeholder="GA" required></label><label>ZIP<input name="zip" autocomplete="postal-code" inputmode="numeric" required></label></div>
<div class="row"><label>Emergency contact name<input name="ecName" required></label><label>Emergency contact phone<input type="tel" name="ecPhone" required></label></div>
<p class="fine">Regular gym membership is for adults 18 or older, enrolling for themselves.</p></div>
<h2 class="step-h"><span>4</span> Review your agreement</h2>
<p class="fine">Your complete agreement and attachments, filled in with your selections. It updates as you type. <button type="button" class="linkbtn" id="review-print">Open full-screen / print</button></p>
<div class="paper" id="docs" tabindex="0" aria-label="Agreement and attachments"></div>
<h2 class="step-h"><span>5</span> Sign</h2><div class="card fields sign">
<p><b>Recovery Room:</b> which recovery services will you use?</p><div class="chk-row">{mods}<label class="chk"><input type="checkbox" id="mod-none"> None</label></div>
<p><b>Waiver initials.</b> Type your initials to acknowledge each section of the Adult Waiver.</p>
<div class="row three"><label>Release of ordinary negligence<input name="iniRelease" maxlength="4" class="ini"></label>
<label>Unattended gym risks<input name="iniUnattended" maxlength="4" class="ini"></label>
<label id="ini-recovery-wrap">Selected recovery risks<input name="iniRecovery" maxlength="4" class="ini"></label></div>
<label class="chk"><input type="checkbox" id="waiver-attest"> I am at least 18, have read the entire waiver, understand that I am relinquishing certain legal rights, and have had an opportunity to ask questions.</label>
<label class="chk"><input type="checkbox" id="ack"> I confirm the complete agreement and every attachment were available for me to review before signing. I acknowledge the price, term, cancellation rights and separate payment authorization.</label>
<label class="chk"><input type="checkbox" id="pay-auth"> I authorize G2 Fitness L.C., through Stripe, to charge the amount due today and the disclosed monthly payments beginning March 1, 2027, as stated in the Order and Payment Authorization.</label>
<div class="row"><label>Payment authorization signature (type your full name)<input name="paySignature" autocomplete="off"></label>
<label>Agreement signature (type your full name)<input name="signature" autocomplete="off"></label></div>
<p class="fine">Typing your name is your electronic signature on the agreement, waiver and payment authorization shown above. You'll get your signed copy immediately.</p>
<div id="errors" class="errors" hidden role="alert"></div>
<button class="btn btn-primary big" id="sign-btn" type="submit">Sign agreement</button></div>
</div></form><div id="signed" hidden></div></div></section>{hidden}'''
    return layout("/enroll/", "Enroll | G2 Fitness", "Enroll in a G2 Fitness gym membership online.", b,
                  '<script src="/js/enroll.js"></script>')


def enroll_complete():
    b = f'''<section class="section enroll"><div class="wrap" id="enroll-complete"><div class="signed-card">
<p class="eyebrow pill">ENROLLMENT COMPLETE</p><h1 class="enroll-h">Welcome to G2 Fitness.</h1>
<p>Your payment went through and your membership is reserved. Stripe has emailed your receipt.</p>
<div id="complete-copy"></div>
<h2 class="step-h">What happens next</h2>
<ol class="next"><li>Your payment is held in the state-required escrow account until opening.</li>
<li>Before opening, G2 will contact you to schedule orientation, verify your identity and set up the member app for 24/7 access.</li>
<li>Paid service begins February 1, 2027 (or the later approved opening date). Your monthly payment begins March 1, 2027.</li>
<li>To cancel, see the cancellation notice in your signed agreement, or email {e("coachtre@g2fitness.org")}.</li></ol>
<div class="actions">{btn("Back to Home", "/")}</div></div></div></section>'''
    return layout("/enroll/complete/", "Enrollment Complete | G2 Fitness", "Your G2 Fitness enrollment is complete.", b,
                  '<script src="/js/enroll.js"></script>')


PAGES = {"index.html": home, "about/index.html": about, "professional-fitness/index.html": gym, "training/index.html": training,
         "team-training/index.html": teams, "memberships/index.html": prices, "schedule/index.html": schedule,
         "sign-up/index.html": contact, "thanks/index.html": thanks, "404.html": notfound,
         "enroll/index.html": enroll, "enroll/complete/index.html": enroll_complete}

if __name__ == "__main__":
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    shutil.copytree(os.path.join(ROOT, "static"), OUT)
    for rel, fn in PAGES.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w") as f:
            f.write(fn())
    print("Built", len(PAGES), "pages into", OUT)
