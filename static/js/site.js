(function () {
  var links = window.G2_LINKS || {};
  document.querySelectorAll("[data-enroll]").forEach(function (a) {
    var key = a.getAttribute("data-enroll");
    var url = (links[key] || "").trim();
    if (url) {
      a.href = url;
      a.hidden = false;
    } else if (key === "member-login") {
      a.closest("li").remove();
    } else {
      var card = a.closest(".card");
      var name = card ? card.querySelector("h3").textContent : "";
      a.href = "/sign-up/?interest=" + encodeURIComponent(name) + "#contact";
    }
  });

  // Prefill the contact form's interest from ?interest=
  var sel = document.getElementById("interest");
  var want = new URLSearchParams(location.search).get("interest");
  if (sel && want) {
    var match = Array.prototype.find.call(sel.options, function (o) {
      return o.text && want.toLowerCase().indexOf(o.text.toLowerCase()) === 0;
    }) || Array.prototype.find.call(sel.options, function (o) {
      return o.text && want.toLowerCase().indexOf(o.text.toLowerCase().split(" ")[0]) === 0 && o.value !== "";
    });
    if (match) sel.value = match.text;
    var msg = document.querySelector("textarea[name=message]");
    if (msg && !msg.value) msg.value = "I'd like to enroll in / learn more about: " + want;
  }

  // Mobile menu
  var t = document.querySelector(".menu-toggle"), nav = document.getElementById("nav");
  if (t && nav) t.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    t.setAttribute("aria-expanded", open);
  });
})();
