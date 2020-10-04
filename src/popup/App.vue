<template>
  <div class="px-4 py-6 text-xl text-gray-800 whitespace-no-wrap bg-gray-200">
    <p class="mb-6 font-light">
      Abstinence <span class="block font-black">{{ abstinenceDuration }}</span>
    </p>

    <p class="font-light">
      Longest streak <span class="block font-black">{{ longestStreak }}</span>
    </p>
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
      abstinenceDuration: '',
      streakFromDate: 0,
      longestStreak: '',
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

    this.getLongestStreak()
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
    openOptionsPage() {
      browser.runtime.openOptionsPage()
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Chivo:wght@300;900&display=swap');

body {
  font-family: 'Chivo', sans-serif;
  /*min-width: 220px;
  max-width: 500px */
}
</style>
