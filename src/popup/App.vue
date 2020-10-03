<template>
  <div class="text-xl">
    <p>{{ defaultText }}</p>
    <p>Abstinence: {{ abstinenceDuration }}</p>
    <button @click="getLongestStreak">Compute longest streak</button>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns'
import getLatestVisitedSite from '@/utils/getLatestVisitedSite.js'

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
      console.log(results)

      this.latestVisitSite = getLatestVisitedSite(results)

      if (!this.latestVisitSite) {
        this.abstinenceDuration = 'History is empty'
        return
      }

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
    async getLongestStreak() {
      const urlsPromises = this.urls.map(url =>
        browser.history.getVisits({
          url,
        })
      )
      const results = await Promise.all(urlsPromises)
      const visitItems = results.flat()
      console.log(visitItems)
      const timestamps = visitItems
        .map(item => item.visitTime)
        .sort((a, b) => a - b)

      let streak = 0
      for (let i = 0; i < timestamps.length; i++) {
        const diff = timestamps[i + 1] - timestamps[i]
        if (diff > streak) {
          console.log(diff)
          streak = diff
        }
      }

      // 3862340281.322754
      console.log(streak)
    },
  },
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
