import { getLongestStreak } from './getHistoryFunctions.js'

export default {
  methods: {
    async getLongestStreak(urls) {
      const urlsPromises = urls.map(url =>
        browser.history.getVisits({
          url,
        })
      )

      try {
        const results = await Promise.all(urlsPromises)
        return getLongestStreak(results)
      } catch (error) {
        console.error(error)
      }
    },
    async getURLListfromStorage() {
      try {
        const { urls } = await browser.storage.local.get()
        return Array.isArray(urls) ? urls : []
      } catch (error) {
        console.error(error)
      }
    },
  },
}
