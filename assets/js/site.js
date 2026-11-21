(function () {
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // nav
  var burger = $('.burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  }
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  $$('[data-admin]').forEach(function (a) { a.href = S.adminUrl; });
  $$('[data-email]').forEach(function (a) { a.textContent = S.email; a.href = 'mailto:' + S.email; });

  // store buttons
  $$('[data-store]').forEach(function (a) {
    var url = a.getAttribute('data-store') === 'play' ? S.playUrl : S.appStoreUrl;
    if (url) { a.href = url; a.rel = 'noopener'; } else { a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href'); var b = a.querySelector('small'); if (b) b.textContent = 'Coming soon on'; }
  });

  // phone screenshots: if assets/screens/<name>.png exists it replaces the drawn mock
  $$('[data-shot]').forEach(function (box) {
    var img = new Image(); img.className = 'shot'; img.alt = box.getAttribute('data-alt') || 'Church Point app screen'; img.loading = 'lazy';
    img.onload = function () { box.appendChild(img); };
    img.src = 'assets/screens/' + box.getAttribute('data-shot') + '.png';
  });

  // pricing
  var annual = false;
  function fmt(n) { return '$' + n; }
  function renderPlans() {
    $$('[data-plans]').forEach(function (host) {
      var mf = S.annualMonthsFree || 0;
      host.innerHTML = (S.tiers || []).map(function (t) {
        var price = t.price == null ? '<div class="price">Let’s talk</div>' :
          '<div class="price">' + fmt(annual && mf ? Math.round(t.price * (12 - mf) / 12 * 100) / 100 : t.price) + '<small> /month</small></div>';
        var note = t.price == null ? 'Priced to fit your structure' : (annual && mf ? 'Billed yearly: ' + fmt(t.price * (12 - mf)) + ' (' + mf + ' months free)' : 'Billed monthly');
        return '<article class="plan' + (t.popular ? ' pop' : '') + '">' + (t.popular ? '<span class="tag">Most popular</span>' : '') +
          '<h3>' + t.name + '</h3><div class="who">' + t.members + '. ' + t.blurb + '</div>' + price + '<p class="note">' + note + '</p>' +
          '<a class="btn ' + (t.popular ? 'btn-primary' : 'btn-ghost') + '" href="contact.html?plan=' + encodeURIComponent(t.name) + '">' + (t.price == null ? 'Contact us' : 'Request a demo') + '</a></article>';
      }).join('');
    });
  }
  $$('[data-billing]').forEach(function (b) {
    if (!S.annualMonthsFree) { var t = b.closest('.toggle'); if (t) t.hidden = true; return; }
    b.addEventListener('click', function () {
      annual = b.getAttribute('data-billing') === 'yearly';
      $$('[data-billing]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      renderPlans();
    });
  });
  renderPlans();

  // demo form
  var form = $('#demo-form');
  if (form) {
    var plan = new URLSearchParams(location.search).get('plan');
    if (plan && form.plan) form.plan.value = plan;
    var ok = $('#form-ok'), bad = $('#form-bad'), btn = $('button[type=submit]', form);
    if (S.whatsapp) { var w = $('#wa'); if (w) { w.hidden = false; w.href = 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent('Hello, I would like a Church Point demo.'); } }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); ok.classList.remove('show'); bad.classList.remove('show');
      if (form.website.value) return;
      var d = {}; new FormData(form).forEach(function (v, k) { if (k !== 'website') d[k] = String(v).trim(); });
      var body = 'Church: ' + d.church + '\nName: ' + d.name + '\nRole: ' + d.role + '\nPhone/WhatsApp: ' + d.phone + '\nEmail: ' + d.email + '\nMembers: ' + d.members + '\nPlan interest: ' + d.plan + '\nCity/Country: ' + d.place + '\n\n' + d.message;
      var mail = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Church Point demo request: ' + d.church) + '&body=' + encodeURIComponent(body);
      if (!S.formEndpoint) { location.href = mail; ok.textContent = 'Your email app should open with your request ready to send. If it does not, email us at ' + S.email + '.'; ok.classList.add('show'); return; }
      btn.disabled = true;
      fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); ok.textContent = 'Thank you. We have your request and will reply within one working day.'; ok.classList.add('show'); })
        .catch(function () { bad.innerHTML = 'Sorry, that did not send. Please <a href="' + mail + '">email us instead</a>.'; bad.classList.add('show'); })
        .then(function () { btn.disabled = false; });
    });
  }

  // reveal on scroll
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }
})();
