<template>
  <div
    class="px-4 pt-4 pb-4 text-xl text-gray-800 whitespace-no-wrap bg-gray-200"
  >
    <button
      @click="openOptionsPage"
      class="block mb-2 ml-auto"
      v-if="!isListEmpty"
    >
      <SettingsIcon class="w-6 h-6" />
    </button>
    <div v-if="!isListEmpty">
      <p class="mb-6 font-light">
        Last visit
        <b class="block font-black font-blackish">{{ abstinenceDuration }}</b>
      </p>
      <p class="font-light" v-if="longestStreak">
        Longest streak
        <b class="block font-black font-blackish">{{ longestStreak }}</b>
      </p>
    </div>
    <div v-else>
      <button
        @click="openOptionsPage"
        class="px-4 py-1 text-lg text-white bg-blackish hover:bg-gray-700 focus:hover:bg-gray-700"
      >
        Start by adding websites to track
      </button>
    </div>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns'
import {
  getLatestVisitTime,
  getLongestStreak,
} from '@/utils/getHistoryFunctions.js'
import SettingsIcon from '@/assets/svg/settings.svg'
import mixin from '@/utils/mixin.js'

export default {
  name: 'Popup',
  mixins: [mixin],
  components: {
    SettingsIcon,
  },
  data() {
    return {
      abstinenceDuration: '',
      urls: [],
      longestStreak: '',
      streakFromDate: '',
    }
  },
  async mounted() {
    this.urls = await this.getURLListfromStorage()

    if (this.urls.length === 0) {
      this.abstinenceDuration = ''
      return
    }

    const urlsPromises = this.urls.map(url =>
      browser.history.getVisits({
        url,
      })
    )

    try {
      /** Last Visit **/

      const results = await Promise.all(urlsPromises)
      const latestVisitTime = getLatestVisitTime(results)

      if (!latestVisitTime) {
        this.abstinenceDuration = 'History is empty'
        return
      }

      this.abstinenceDuration = formatDistance(
        new Date(latestVisitTime),
        new Date(),
        { addSuffix: true }
      )

      /** Longest Streak **/

      const streak = getLongestStreak(results)

      if (!streak) {
        this.longestStreak = 'Not enough data'
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
    isListEmpty() {
      return this.urls.length === 0
    },
  },
  methods: {
    openOptionsPage() {
      browser.runtime.openOptionsPage()
    },
  },
}
</script>
