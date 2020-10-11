<template>
  <div
    class="px-4 pt-4 pb-4 text-xl text-gray-800 whitespace-no-wrap bg-gray-200"
  >
    <button @click="openOptionsPage" class="block mb-2 ml-auto">
      <SettingsIcon class="w-6 h-6" />
    </button>
    <p class="mb-6 font-light">
      Last visit
      <b class="block font-black font-blackish">{{ abstinenceDuration }}</b>
    </p>
    <p class="font-light" v-if="longestStreak">
      Longest streak
      <b class="block font-black font-blackish">{{ longestStreak }}</b>
    </p>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns'
import { getLatestVisitedSite } from '@/utils/getHistoryFunctions.js'
import SettingsIcon from '@/assets/svg/settings.svg'
import mixin from '@/utils/mixin.js'

export default {
  mixins: [mixin],
  components: {
    SettingsIcon,
  },
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

      /** Streak **/

      const streak = await this.getLongestStreak(this.urls)

      if (!streak) {
        this.longestStreak = ''
        return
      }

      const { firstTimestamp, secondTimestamp } = streak

      this.longestStreak = formatDistance(
        new Date(firstTimestamp),
        new Date(secondTimestamp)
      )
    } catch (error) {
      this.longestStreak = ''
      console.error(error)
    }
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
