let canvas = document.getElementById('canvas');
let propContent = document.getElementById('propContent');
let currentElement = null;
let undoStack = [];
let redoStack = [];
document.querySelectorAll('.element').forEach(el => {
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', e.target.dataset.type);
  });
});
canvas.addEventListener('dragover', e => {
  e.preventDefault();
  canvas.classList.add('drop-highlight');
});
canvas.addEventListener('dragleave', () => {
  canvas.classList.remove('drop-highlight');
});
canvas.addEventListener('drop', e => {
  e.preventDefault();
  canvas.classList.remove('drop-highlight');
  const type = e.dataTransfer.getData('type');
  const newEl = addElement(type);
  selectElement(newEl); 
});
function addElement(type) {
  const el = document.createElement('div');
  el.classList.add('resizable');
  el.addEventListener('click', () => selectElement(el));
  switch(type) {
    case 'heading': el.innerHTML = '<h2>Welcome to My Site</h2>'; break;
    case 'paragraph': el.innerHTML = '<p>This is a paragraph. Edit me!</p>'; break;
    case 'button': el.innerHTML = '<button>Click Me</button>'; break;
    case 'image': el.innerHTML = '<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" width="100%" />'; break;
    case 'divider': el.innerHTML = '<hr />'; break;
  }
  saveState();
  canvas.appendChild(el);
  if (canvas.querySelector('.placeholder-text'))
    canvas.querySelector('.placeholder-text').style.display = 'none';
  return el;
}
function selectElement(el) {
  currentElement = el;
  let html = '';
  if (el.querySelector('h2')) {
    html += `Text: <input id="editText" value="${el.querySelector('h2').innerText}"><br>`;
  } else if (el.querySelector('p')) {
    html += `Text: <input id="editText" value="${el.querySelector('p').innerText}"><br>`;
  } else if (el.querySelector('button')) {
    html += `Button Text: <input id="editText" value="${el.querySelector('button').innerText}"><br>`;
    html += `Link URL: <input id="editLink" value="#">`;
  } else if (el.querySelector('img')) {
    html += `Image URL: <input id="editSrc" value="${el.querySelector('img').src}"><br>`;
  }
  html += `Background Color: <input type="color" id="bgColor" value="#ffffff"><br>`;
  propContent.innerHTML = html;
  if (document.getElementById('editText')) {
    document.getElementById('editText').addEventListener('input', e => {
      if (el.querySelector('h2')) el.querySelector('h2').innerText = e.target.value;
      if (el.querySelector('p')) el.querySelector('p').innerText = e.target.value;
      if (el.querySelector('button')) el.querySelector('button').innerText = e.target.value;
      saveState();
    });
  }
  if (document.getElementById('editSrc')) {
    document.getElementById('editSrc').addEventListener('input', e => {
      el.querySelector('img').src = e.target.value;
      saveState();
    });
  }
  if (document.getElementById('editLink')) {
    document.getElementById('editLink').addEventListener('input', e => {
      el.querySelector('button').onclick = () => window.location = e.target.value;
      saveState();
    });
  }
  document.getElementById('bgColor').addEventListener('input', e => {
    el.style.background = e.target.value;
    saveState();
  });
}
function saveState() {
  undoStack.push(canvas.innerHTML);
  redoStack = [];
}
document.getElementById('undoBtn').addEventListener('click', () => {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    canvas.innerHTML = undoStack[undoStack.length - 1];
  }
});
document.getElementById('redoBtn').addEventListener('click', () => {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.innerHTML = state;
  }
});
document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
document.getElementById('exportBtn').addEventListener('click', () => {
  const html = `
  <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Exported Page</title></head>
  <body>${canvas.innerHTML}</body></html>`;
  const blob = new Blob([html], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.html';
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById('clearCanvasBtn').addEventListener('click', () => {
  canvas.innerHTML = '<p class="placeholder-text">Drag elements here to build your website ✨</p>';
  saveState();
});
