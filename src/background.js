browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  /*   let query = 'https://www.youtube.com/'
  try {
    const visits = await browser.history.getVisits({ url: query })
    console.log(visits)
  } catch (error) {
    console.error(error)
  } */
  console.log({ request, sender, sendResponse })
})
