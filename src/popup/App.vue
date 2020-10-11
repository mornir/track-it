<template>
  <div class="px-4 py-6 text-xl text-gray-800 whitespace-no-wrap bg-gray-200">
    <button @click="openOptionsPage">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        class="w-8 h-8"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
    <p class="mb-6 font-light">
      Last visit
      <b class="block font-black font-blackish">{{ abstinenceDuration }}</b>
    </p>

    <p class="font-light">
      Longest streak
      <b class="block font-black font-blackish">{{ longestStreak }}</b>
    </p>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns'
import { getLatestVisitedSite } from '@/utils/getHistoryFunctions.js'
import mixin from '@/utils/mixin.js'

export default {
  mixins: [mixin],
  name: 'Popup',
  data() {
    return {
      latestVisitSites: [],
      latestVisitSite: {},
      latestVisitDate: null,
      abstinenceDuration: '',
      urls: [],
      longestStreak: '',
      streakFromDate: '',
    }
  },
  async mounted() {
    this.urls = await this.getURLListfromStorage()

    if (this.urls.length === 0) {
      this.abstinenceDuration = 'No URLs'
      return
    }

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

    const { firstTimestamp, secondTimestamp } = await this.getLongestStreak(
      this.urls
    )

    this.longestStreak = formatDistance(
      new Date(firstTimestamp),
      new Date(secondTimestamp)
    )
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage('extName')
    },
  },
  methods: {
    openOptionsPage() {
      browser.runtime.openOptionsPage()
    },
  },
}
</script>
