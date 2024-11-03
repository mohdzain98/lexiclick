(function() {
  // Store reference to the floating div
  let popupDiv = null;

  // Create and append styles to document
  const style = document.createElement('style');
  style.textContent = `
    .dict-popup {
      position: fixed;
      z-index: 999999;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    }
    .dict-popup__close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #666;
      padding: 4px 8px;
    }
    .dict-popup__close:hover {
      color: #333;
    }
    .dict-popup__content {
      margin-top: 8px;
    }
    .dict-popup__section {
      margin-bottom: 12px;
    }
    .dict-popup__title {
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }
    .dict-popup__suggestion {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 12px;
      text-align: center;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);

  // Function to remove popup
  function removePopup() {
    if (popupDiv) {
      popupDiv.remove();
      popupDiv = null;
    }
  }

  // Function to create popup
  function createPopup(x, y) {
    // Remove existing popup if any
    removePopup();

    // Create new popup
    popupDiv = document.createElement('div');
    popupDiv.className = 'dict-popup';
    
    // Position popup
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = x;
    let top = y + 20; // Add some offset from cursor

    // Adjust position to keep within viewport
    if (left + 300 > viewportWidth) {
      left = viewportWidth - 320;
    }
    if (top + 300 > viewportHeight) {
      top = viewportHeight - 320;
    }

    popupDiv.style.left = `${left}px`;
    popupDiv.style.top = `${top}px`;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'dict-popup__close';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', removePopup);
    popupDiv.appendChild(closeButton);

    // Add content container
    const content = document.createElement('div');
    content.className = 'dict-popup__content';
    popupDiv.appendChild(content);

    // Add loading state
    content.textContent = 'Loading...';

    // Append to document
    document.body.appendChild(popupDiv);

    return content;
  }

  // Function to show word definition
  async function showDefinition(word, x, y) {
    const content = createPopup(x, y);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Word not found');
      }

      if (!popupDiv) return; // Check if popup was closed

      const wordData = data[0];
      const meaning = wordData.meanings[0];

      content.innerHTML = `
        <div class="dict-popup__section">
          <div class="dict-popup__title">
            ${word}
            ${wordData.phonetic ? `<span style="color: #666; font-weight: normal">${wordData.phonetic}</span>` : ''}
          </div>
          <div>${meaning.definitions[0].definition}</div>
        </div>
        ${meaning.definitions[0].example ? `
          <div class="dict-popup__section">
            <div class="dict-popup__title">Example:</div>
            <div style="font-style: italic; color: #666">"${meaning.definitions[0].example}"</div>
          </div>
        ` : ''}
        ${meaning.synonyms.length ? `
          <div class="dict-popup__section">
            <div class="dict-popup__title">Synonyms:</div>
            <div>${meaning.synonyms.slice(0, 5).join(', ')}</div>
          </div>
        ` : ''}
        ${meaning.antonyms.length ? `
          <div class="dict-popup__section">
            <div class="dict-popup__title">Antonyms:</div>
            <div>${meaning.antonyms.slice(0, 5).join(', ')}</div>
          </div>
        ` : ''}
        <div class="dict-popup__suggestion">
          For better results, find words using the extension popup ↗
        </div>
      `;
    } catch (error) {
      if (popupDiv) {
        content.innerHTML = `
          <div style="color: #d32f2f; text-align: center; margin-bottom: 16px">
            ${error.message === 'Word not found' ? 'Word not found' : 'Error looking up word'}
          </div>
          <div class="dict-popup__suggestion">
            For better results, find words using the extension popup ↗
          </div>
        `;
      }
    }
  }

  // Handle double click
  function handleDoubleClick(event) {
    const selection = window.getSelection();
    const word = selection.toString().trim();

    if (word) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      showDefinition(
        word,
        event.pageX - window.scrollX,
        event.pageY - window.scrollY
      );
    }
  }

  // Handle click outside
  function handleClickOutside(event) {
    if (popupDiv && !popupDiv.contains(event.target)) {
      removePopup();
    }
  }

  // Handle cleanup on visibility change
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      removePopup();
    }
  });

  // Add event listeners
  document.addEventListener('dblclick', handleDoubleClick);
  document.addEventListener('click', handleClickOutside);

  // Listen for navigation events
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CLEANUP') {
      removePopup();
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  });
})();