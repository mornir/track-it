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
import {
  getLatestVisitedSite,
  getLongestStreak,
} from '@/utils/getHistoryFunctions.js'

export default {
  name: 'Popup',
  data() {
    return {
      urls: [
        'https://www.koreus.com/',
        'https://www.letemps.ch/',
        'https://tailwindcss.com/',
      ],
      latestVisitSites: [],
      latestVisitSite: {},
      latestVisitDate: null,
      abstinenceDuration: null,
      streakFromDate: 0,
      longestStreak: 0,
    }
  },
  async mounted() {
    const urlsPromises = this.urls.map(url =>
      browser.history.search({
        text: url,
        maxResults: 1,
        startTime: 0,
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
      console.error(error)
    }
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage('extName')
    },
  },
  methods: {
    async getLongestStreak() {
      const urlsPromises = this.urls.map(url =>
        browser.history.getVisits({
          url,
        })
      )

      try {
        const results = await Promise.all(urlsPromises)
        const { firstTimestamp, secondTimestamp, startDate } = getLongestStreak(
          results
        )
        this.streakFromDate = format(new Date(startDate), 'dd.MM.yyyy')
        this.longestStreak = formatDistance(
          new Date(firstTimestamp),
          new Date(secondTimestamp)
        )
      } catch (error) {
        console.error(error)
      }
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
