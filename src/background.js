browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log({ request, sender, sendResponse })
})
