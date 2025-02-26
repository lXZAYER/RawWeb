document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');

  chrome.storage.local.get(['enabled'], (result) => {
    const enabled = result.enabled ?? false;
    updateUI(enabled);

    button.addEventListener('click', () => {
      const newState = !enabled;
      chrome.storage.local.set({ enabled: newState }, () => {
        updateUI(newState);
        chrome.runtime.sendMessage({ action: 'toggle', state: newState });
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.reload(tabs[0].id);
        });
      });
    });
  });

  function updateUI(enabled) {
    button.textContent = enabled ? 'Disable RawWeb' : 'Enable RawWeb';
    button.style.backgroundColor = enabled ? '#dc3545' : '#007aff';
    statusText.textContent = enabled 
      ? 'Blocking CSS & JavaScript\nPage will reload automatically'
      : 'Allowing CSS & JavaScript\nPage will reload automatically';
  }
});