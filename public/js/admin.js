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

// /api/save-html.js (Vercel serverless function)
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, file, content } = req.body;
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const safeFiles = ['index.html', 'about.html'];
  if (!safeFiles.includes(file)) {
    return res.status(400).json({ message: 'Invalid file path' });
  }

  const filePath = path.join(process.cwd(), 'public', file);

  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return res.status(200).json({ message: 'File saved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save file' });
  }
}
