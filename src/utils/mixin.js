export default {
  methods: {
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
