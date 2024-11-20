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
