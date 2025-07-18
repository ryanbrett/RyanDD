const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const tokenKey = 'admin-token';

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = loginForm.token.value.trim();
    if (!token) return;
    // Save token in localStorage and redirect
    localStorage.setItem(tokenKey, token);
    window.location.href = '/admin/editor.html';
  });
}

const editorTextarea = document.getElementById('editor');
const fileSelect = document.getElementById('file-select');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');

if (editorTextarea && fileSelect && saveBtn) {
  const editor = CodeMirror.fromTextArea(editorTextarea, {
    mode: 'htmlmixed',
    lineNumbers: true,
    lineWrapping: true,
  });

  const loadFile = async () => {
    const file = fileSelect.value;
    const res = await fetch(`/${file}`);
    const html = await res.text();
    editor.setValue(html);
  };

  fileSelect.addEventListener('change', loadFile);
  window.addEventListener('DOMContentLoaded', loadFile);

  saveBtn.addEventListener('click', async () => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return alert('Not logged in.');

    const file = fileSelect.value;
    const content = editor.getValue();

    const res = await fetch('/api/save-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, file, content })
    });

    const result = await res.json();
    saveStatus.textContent = result.message || 'Saved!';
    saveStatus.style.color = res.ok ? 'green' : 'red';
  });
}
