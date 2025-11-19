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

showToast('ابزارچی آماده است!');