const enableRules = {
  id: 1,
  priority: 1,
  action: { type: 'block' },
  condition: { urlFilter: '.*', resourceTypes: ['script', 'stylesheet'] }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    updateRules(request.state);
  }
});

async function updateRules(enabled) {
  const currentRules = await chrome.declarativeNetRequest.getSessionRules();
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: currentRules.map(rule => rule.id),
    addRules: enabled ? [enableRules] : []
  });

  chrome.storage.local.set({ enabled });
}

// Ensure settings persist after restart
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled'], (result) => {
    updateRules(result.enabled || false);
  });
});
