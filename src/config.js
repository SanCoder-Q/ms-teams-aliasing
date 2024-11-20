const onClick = () => {
  let chatMap = {};
  Array.from(document.getElementsByTagName('input'))
    .filter(input => input.dataset.chat)
    .forEach(input => { chatMap[input.dataset.chat] = input.value});
  console.log('Writing chatMap ...', chatMap);
  chrome.storage.local.set({ chatMap });
  chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
    if (tab && tab.url.includes("https://teams.microsoft.com/v2")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["update.js"]
      });
    }
  });
}

const createButton = () => {
  const button = document.createElement('div');
  button.setAttribute('class', 'button');
  button.innerText = 'Save';
  button.onclick = onClick;
  return button;
};

chrome.storage.local.get(["chats", "chatMap"], ({ chats, chatMap }) => {
  console.log("Data retrieved from chrome.storage:", chats);
  if (chats && chats.length > 0) {
    document.getElementById('root').appendChild(createButton());
    const rows = chats.map(chat => {
      const row = document.createElement('div');
      row.setAttribute('class', 'row');
      const label = document.createElement('label');
      label.innerText = chat + ': ';
      row.appendChild(label);
      const input = document.createElement('input');
      input.setAttribute('value', chatMap[chat] || chat);
      input.setAttribute('data-chat', chat);
      row.appendChild(input);
      return row;
    });
    rows.forEach(row => document.getElementById('root').appendChild(row));
    document.getElementById('root').appendChild(createButton());
  } else {
    document.getElementById('root').appendChild(document.createTextNode('No chats found.'));
  }
});
