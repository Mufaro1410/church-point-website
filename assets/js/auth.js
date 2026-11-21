(function () {
  var C = window.SUPABASE_CONFIG || {}, URL_ = C.url, KEY = C.anonKey;
  var $ = function (i) { return document.getElementById(i); };
  var ok = $('success-message'), bad = $('error-message'), txt = $('error-text');
  function show(el, t) { ok.classList.remove('show'); bad.classList.remove('show'); if (t && txt) txt.textContent = t; el.classList.add('show'); }
  if (!URL_ || URL_.indexOf('__') === 0 || !KEY) { var f = document.querySelector('form'); if (f) f.hidden = true; show(bad, 'This page is not configured yet. Please contact support.'); return; }

  var reset = $('reset-form');
  if (reset) reset.addEventListener('submit', function (e) {
    e.preventDefault(); var b = reset.querySelector('button'); b.disabled = true;
    fetch(URL_ + '/auth/v1/recover', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: KEY }, body: JSON.stringify({ email: $('reset-email').value.trim() }) })
      .then(function (r) { if (r.ok) { reset.reset(); show(ok); } else return r.json().then(function (j) { show(bad, j.msg || 'Could not send the link. Please try again.'); }); })
      .catch(function () { show(bad, 'Network error. Please check your connection.'); })
      .then(function () { b.disabled = false; });
  });

  var upd = $('update-password-form');
  if (upd) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-target]'), function (b) {
      b.addEventListener('click', function () { var i = $(b.getAttribute('data-target')); i.type = i.type === 'password' ? 'text' : 'password'; b.textContent = i.type === 'password' ? 'Show' : 'Hide'; });
    });
    var token = new URLSearchParams(location.hash.substring(1)).get('access_token');
    if (!token) { upd.hidden = true; show(bad, 'This reset link is invalid or has expired. Please request a new one.'); return; }
    upd.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = $('new-password').value, c = $('confirm-password').value;
      if (p !== c) return show(bad, 'Passwords do not match.');
      if (p.length < 8) return show(bad, 'Use at least 8 characters.');
      var b = upd.querySelector('button[type=submit]'); b.disabled = true; b.textContent = 'Updating…';
      fetch(URL_ + '/auth/v1/user', { method: 'PUT', headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + token }, body: JSON.stringify({ password: p }) })
        .then(function (r) {
          if (r.ok) { upd.reset(); upd.hidden = true; show(ok); setTimeout(function () { location.href = (window.SITE && SITE.adminUrl) || '/'; }, 3000); }
          else return r.json().then(function (j) { show(bad, j.msg || 'Could not update the password. Request a new link and try again.'); b.disabled = false; b.textContent = 'Update password'; });
        })
        .catch(function () { show(bad, 'Network error. Please check your connection.'); b.disabled = false; b.textContent = 'Update password'; });
    });
  }
})();
