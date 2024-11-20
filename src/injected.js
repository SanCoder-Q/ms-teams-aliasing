const update = () => {
  chrome.storage.local.get('chatMap', ({ chatMap }) => {
    console.log('Reading chatMap ...', chatMap);
    if (Object.getOwnPropertyNames(chatMap).length > 0) {
      Array.from(document.getElementsByClassName('chatListItem_mainMedia_header'))
        .filter(_ => _.dataset.tid == 'chat-list-item-title')
        .forEach(chat => {
          chat.innerHTML = chatMap[chat.getAttribute('title')];
        });
    }
  });
}

const load = () => {
  const chats = Array.from(document.getElementsByClassName('chatListItem_mainMedia_header'))
    .filter(_ => _.dataset.tid == 'chat-list-item-title');
  if (chats.length > 0) {
    const chatsNames = chats.map(_ => _.getAttribute('title'));
    chrome.storage.local.set({ chats: chatsNames });
    update();
  } else {
    setTimeout(load, 1000);
  }
}

load();


