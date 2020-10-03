<template>
  <div class="text-xl">
    <p>{{ defaultText }}</p>
    <p>Abstinence: {{ abstinenceDuration }}</p>
    <button @click="getLongestStreak">Compute longest streak</button>
    <p>Longest streak (since {{ streakFromDate }}): {{ longestStreak }}</p>
  </div>
</template>

<script>
import { formatDistance, format } from 'date-fns'
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
      streakFromDate: 0,
      longestStreak: 0,
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

      this.streakFromDate = format(new Date(timestamps[0]), 'dd.MM.yyyy')

      let streak = {
        diff: 0,
        firstTimestamp: 0,
        secondTimestamp: 0,
      }

      for (let i = 0; i < timestamps.length; i++) {
        const currentTimestamp = timestamps[i]
        const nextTimestamp = timestamps[i + 1]

        const diff = nextTimestamp - currentTimestamp
        if (diff > streak.diff) {
          streak.diff = diff
          streak.firstTimestamp = currentTimestamp
          streak.secondTimestamp = nextTimestamp
        }
      }
      this.longestStreak = formatDistance(
        new Date(streak.firstTimestamp),
        new Date(streak.secondTimestamp)
      )
      // 3862340281.322754
      console.log(this.longestStreak)
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
