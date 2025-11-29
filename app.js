const $ = (id) => document.getElementById(id);

function showToast(text) {
  const t = document.createElement('div');
  t.textContent = text;
  t.style.position = 'fixed';
  t.style.right = '20px';
  t.style.bottom = '20px';
  t.style.padding = '14px 24px';
  t.style.background = 'linear-gradient(90deg,#00ff9d,#ff6bc8)';
  t.style.color = 'black';
  t.style.borderRadius = '16px';
  t.style.boxShadow = '0 10px 40px rgba(0,0,0,0.6)';
  t.style.zIndex = '9999';
  t.style.fontWeight = '700';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// لودر رو محو کن
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  $('loader').style.opacity = '0';
  setTimeout(() => $('loader').remove(), 800);
});

// ورود/ثبت‌نام
let currentUser = localStorage.getItem('tools.currentUser') || null;

function updateAuthUI() {
  const authBox = $('auth-container');
  if (currentUser) {
    authBox.style.display = 'none';
    if (!$('user-welcome')) {
      const div = document.createElement('div');
      div.id = 'user-welcome';
      div.innerHTML = `<span style="color:#00ff9d;font-size:20px;font-weight:700">سلام ${currentUser} !</span>`;
      div.style.margin = '20px 0';
      document.querySelector('header').after(div);
    }
  } else {
    authBox.style.display = 'block';
    const w = $('user-welcome');
    if (w) w.remove();
  }
}

function login() {
  const user = $('login-username').value.trim();
  const pass = $('login-password').value;
  if (localStorage.getItem('tools.user.' + user) === pass) {
    currentUser = user;
    localStorage.setItem('tools.currentUser', user);
    showToast('خوش آمدی!');
    updateAuthUI();
  } else {
    showToast('نام کاربری یا رمز اشتباه');
  }
}

function signup() {
  const user = $('signup-username').value.trim();
  const pass = $('signup-password').value;
  if (!user || !pass) return showToast('همه فیلدها را پر کن');
  if (localStorage.getItem('tools.user.' + user)) return showToast('این نام قبلاً ثبت شده');
  localStorage.setItem('tools.user.' + user, pass);
  showToast('ثبت‌نام شد! حالا وارد شو');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('tools.currentUser');
  showToast('خروج موفق');
  updateAuthUI();
}

$('login-btn-local')?.addEventListener('click', login);
$('signup-btn-local')?.addEventListener('click', signup);
$('go-to-login')?.addEventListener('click', () => { $('signup-form').style.display = 'none'; $('login-form').style.display = 'block'; });
$('go-to-signup')?.addEventListener('click', () => { $('login-form').style.display = 'none'; $('signup-form').style.display = 'block'; });

updateAuthUI();

// QR
$('generate-qr')?.addEventListener('click', () => {
  const text = $('qr-input').value.trim();
  if (!text) return showToast('متن بنویس');
  const canvas = $('qr-canvas');
  QRCode.toCanvas(canvas, text, { width: 300, color: { dark: '#00ff9d', light: '#0b1420' } });
  showToast('QR آماده شد!');
});

$('download-qr')?.addEventListener('click', () => {
  if (!currentUser) return showToast('اول وارد شو');
  const a = document.createElement('a');
  a.href = $('qr-canvas').toDataURL();
  a.download = 'qr.png';
  a.click();
  showToast('دانلود شد');
});

// لینک کوتاه
$('create-short')?.addEventListener('click', () => {
  const url = $('short-url-input').value.trim();
  if (!url) return showToast('لینک بنویس');
  const slug = Math.random().toString(36).substring(2, 8);
  const shortUrl = `https://abzarchi.vercel.app/s/${slug}`;
  $('short-result').innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
  showToast('لینک کوتاه ساخته شد!');
});

$('copy-short')?.addEventListener('click', () => {
  navigator.clipboard.writeText($('short-result').textContent);
  showToast('کپی شد');
});

// پسورد
$('generate-password')?.addEventListener('click', () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let pass = '';
  for (let i = 0; i < 18; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
  $('password-output').value = pass;
  navigator.clipboard.writeText(pass);
  showToast('رمز ساخته و کپی شد!');
});

// JSON
$('format-json')?.addEventListener('click', () => {
  try {
    const obj = JSON.parse($('json-input').value);
    $('json-output').innerHTML = JSON.stringify(obj, null, 2).replace(/("([^"]+)":)/g, '<span class="json-key">$1</span>');
    showToast('فرمت شد');
  } catch { showToast('JSON اشتباه است'); }
});

$('download-json')?.addEventListener('click', () => {
  if (!currentUser) return showToast('اول وارد شو');
  const content = $('json-output').textContent || $('json-input').value;
  const blob = new Blob([content], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'json.json';
  a.click();
  showToast('دانلود شد');
});

$('clear-json')?.addEventListener('click', () => { $('json-input').value = ''; $('json-output').innerHTML = ''; showToast('پاک شد'); });

// Base64
$('to-base64')?.addEventListener('click', () => {
  const text = $('base64-input').value;
  $('base64-output').textContent = btoa(unescape(encodeURIComponent(text)));
  showToast('به Base64 تبدیل شد');
});

$('from-base64')?.addEventListener('click', () => {
  try {
    $('base64-output').textContent = decodeURIComponent(escape(atob($('base64-input').value)));
    showToast('دیکد شد');
  } catch { showToast('Base64 نامعتبر'); }
});

$('copy-base64')?.addEventListener('click', () => {
  navigator.clipboard.writeText($('base64-output').textContent);
  showToast('کپی شد');
});

// ایمیل
$('check-email')?.addEventListener('click', () => {
  const email = $('email-check').value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $('email-result').textContent = valid ? '✅ معتبر' : '❌ نامعتبر';
  $('email-result').style.color = valid ? '#00ff9d' : '#ff6bc8';
});

// ====== JWT Decoder ======
document.getElementById('decode-jwt')?.addEventListener('click', () => {
  const token = document.getElementById('jwt-input').value.trim();
  const headerEl = document.getElementById('jwt-header');
  const payloadEl = document.getElementById('jwt-payload');
  const errorEl = document.getElementById('jwt-error');
  const copyBtn = document.getElementById('copy-jwt');

  headerEl.textContent = '';
  payloadEl.textContent = '';
  errorEl.style.display = 'none';
  copyBtn.disabled = true;

  if (!token) return;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('توکن نامعتبر است');

    const decode = (str) => JSON.stringify(JSON.parse(atob(str.padEnd(str.length + (4 - str.length % 4) % 4, '='))), null, 2);

    headerEl.textContent = 'Header:\n' + decode(parts[0]);
    payloadEl.textContent = 'Payload:\n' + decode(parts[1]);

    // رنگ JSON
    [headerEl, payloadEl].forEach(el => {
      el.innerHTML = el.textContent
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
        .replace(/: null/g, ': <span class="json-null">null</span>');
    });

    copyBtn.disabled = false;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(JSON.stringify({
        header: JSON.parse(atob(parts[0].padEnd(parts[0].length + (4 - parts[0].length % 4) % 4, '='))),
        payload: JSON.parse(atob(parts[1].padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')))
      }, null, 2));
      copyBtn.textContent = 'کپی شد!';
      setTimeout(() => copyBtn.textContent = 'کپی JSON', 2000);
    };

  } catch (e) {
    errorEl.textContent = 'خطا: ' + e.message;
    errorEl.style.display = 'block';
  }
});

document.getElementById('clear-jwt')?.addEventListener('click', () => {
  document.getElementById('jwt-input').value = '';
  document.getElementById('jwt-header').textContent = '';
  document.getElementById('jwt-payload').textContent = '';
  document.getElementById('jwt-error').style.display = 'none';
  document.getElementById('copy-jwt').disabled = true;
});

// ====== Regex Tester ======
document.getElementById('test-regex')?.addEventListener('click', () => {
  const pattern = document.getElementById('regex-pattern').value.trim();
  const text = document.getElementById('regex-text').value;
  const resultEl = document.getElementById('regex-result');

  if (!pattern) {
    resultEl.innerHTML = '<span style="color:#ff5555;">رجکس رو وارد کن!</span>';
    return;
  }

  try {
    const regex = new RegExp(pattern, 'g');
    const matches = [...text.matchAll(regex)];
    
    if (matches.length === 0) {
      resultEl.innerHTML = '<span style="color:#ff79c6;">هیچ تطابقی پیدا نشد 😔</span>';
      return;
    }

    let output = `<span style="color:#00ff9d;font-weight:bold;">${matches.length} تطابق پیدا شد!</span><br><br>`;
    matches.forEach((match, i) => {
      output += `<div style="background:#0a1a2e;padding:8px;margin:5px 0;border-radius:8px;">
        <strong style="color:#8be9fd;">Match ${i+1}:</strong> <span style="color:#ffb366;">"${match[0]}"</span>
        ${match.index !== undefined ? `<small style="color:#94a8cc;"> (شروع در کاراکتر ${match.index})</small>` : ''}
      </div>`;
    });
    
    resultEl.innerHTML = output;
  } catch (e) {
    resultEl.innerHTML = `<span style="color:#ff5555;">خطا در رجکس: ${e.message}</span>`;
  }
});

document.getElementById('clear-regex')?.addEventListener('click', () => {
  document.getElementById('regex-pattern').value = '';
  document.getElementById('regex-text').value = '';
  document.getElementById('regex-result').innerHTML = '';
});

// ====== Timestamp Converter ======
document.getElementById('convert-unix')?.addEventListener('click', () => {
  const input = document.getElementById('unix-input').value.trim();
  const output = document.getElementById('datetime-output');
  const copyBtn = document.getElementById('copy-timestamp');

  if (!input || isNaN(input)) {
    output.value = 'عدد معتبر وارد کن!';
    return;
  }

  const date = new Date(parseInt(input) * 1000);
  const persianDate = date.toLocaleDateString('fa-IR');
  const time = date.toLocaleTimeString('fa-IR');
  
  output.value = `${persianDate} - ${time}`;
  copyBtn.disabled = false;
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(output.value);
    copyBtn.textContent = 'کپی شد!';
    setTimeout(() => copyBtn.textContent = 'کپی', 2000);
  };
});

document.getElementById('now-timestamp')?.addEventListener('click', () => {
  const now = Math.floor(Date.now() / 1000);
  document.getElementById('unix-input').value = now;
  document.getElementById('convert-unix').click();
});

// ====== URL Encoder / Decoder ======
document.getElementById('encode-url')?.addEventListener('click', () => {
  const input = document.getElementById('url-input').value.trim();
  const output = document.getElementById('url-output');
  const copyBtn = document.getElementById('copy-url');

  if (!input) {
    output.innerHTML = 'چیزی بنویس!';
    return;
  }

  const encoded = encodeURIComponent(input);
  output.innerHTML = encoded;
  copyBtn.disabled = false;
  setupCopy(copyBtn, encoded);
});

document.getElementById('decode-url')?.addEventListener('click', () => {
  const input = document.getElementById('url-input').value.trim();
  const output = document.getElementById('url-output');
  const copyBtn = document.getElementById('copy-url');

  if (!input) {
    output.textContent = 'چیزی بنویس!';
    return;
  }

  try {
    const decoded = decodeURIComponent(input);
    output.innerHTML = decoded;
    copyBtn.disabled = false;
    setupCopy(copyBtn, decoded);
  } catch (e) {
    output.innerHTML = 'خطا: URL نامعتبر';
  }
});

// تابع کمکی برای کپی
function setupCopy(btn, text) {
  btn.onclick = () => {
    navigator.clipboard.writeText(text);
    btn.textContent = 'کپی شد!';
    setTimeout(() => btn.textContent = 'کپی نتیجه', 2000);
  };
}

showToast('ابزارچی آماده است!');