<template>
  <div>
    <p>{{ defaultText }}</p>
    <p>Abstinence: {{ abstinenceDuration }}</p>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns'

export default {
  name: 'Popup',
  data() {
    return {
      urls: ['https://www.youtube.com/', 'https://github.com/'],
      latestVisitSites: [],
      latestVisitSite: {},
      latestVisitDate: null,
      abstinenceDuration: null,
    }
  },
  async mounted() {
    //browser.runtime.sendMessage({})

    const urlsPromises = this.urls.map(url =>
      browser.history.search({
        text: url,
        maxResults: 1,
      })
    )

    try {
      const results = await Promise.all(urlsPromises)
      this.latestVisitSites = results.flat()
      this.latestVisitSite = this.latestVisitSites.reduce((prev, current) => {
        return prev.lastVisitTime > current.lastVisitTime ? prev : current
      })
      this.latestVisitDate = new Date(this.latestVisitSite.lastVisitTime)
      this.abstinenceDuration = formatDistance(this.latestVisitDate, new Date())
    } catch (error) {
      this.log(error)
    }
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage('extName')
    },
  },
  methods: {
    log(textToLog) {
      browser.extension.getBackgroundPage().console.log(textToLog)
    },
  },
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}

p {
  font-size: 20px;
}
</style>
