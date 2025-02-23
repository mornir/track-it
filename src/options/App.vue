<template>
  <div class="min-h-screen bg-gray-200 text-blackish" style="width: 395px">
    <div class="px-4 pt-4 pb-6">
      <section class="mb-8">
        <h1 class="sr-only">Options</h1>
        <form @submit.prevent="addURL">
          <h2 class="mb-2 text-2xl ">Tracked URLs</h2>
          <div class="flex">
            <input
              type="url"
              required
              v-model="url"
              class="flex-1 px-2 text-base border-t-2 border-l-2 border-blackish focus:outline-none"
              placeholder="Type the complete URL"
            />
            <button
              type="submit"
              class="px-4 py-1 text-lg text-white bg-blackish hover:bg-gray-700 focus:hover:bg-gray-700"
            >
              Add
            </button>
          </div>
        </form>
        <ul
          class="h-64 overflow-auto bg-gray-200 border-b-2 border-l-2 border-r-2 border-blackish"
        >
          <li
            v-for="url in urls"
            :key="url"
            class="flex py-1 odd:bg-gray-300 even:bg-gray-100"
          >
            <button @click="deleteURL(url)" class="mx-2">
              <DeleteIcon class="w-4 h-4 hover:text-red-600" />
            </button>
            <span class="text-base italic whitespace-no-wrap">{{
              removeProtocol(url)
            }}</span>
          </li>
        </ul>
        <div v-if="error">
          <p class="mt-4 text-lg">Yikes! An error occured:</p>
          <pre class="break-words">{{ error }}</pre>
          <p>
            <a
              href="https://github.com/mornir/track-it/issues/new"
              class="underline"
              >Report the error
            </a>
          </p>
        </div>
      </section>
      <section class="mb-8">
        <h2 class="mb-2 text-2xl">Longest Streak</h2>
        <div v-if="longestStreak">
          <p class="text-lg">
            Between {{ streakFromDate }} and now, your longest streak started on
            {{ start.day }} the
            <b class="whitespace-no-wrap">{{ start.date }}</b> at
            {{ start.time }} and ended on {{ end.day }} the
            <b class="whitespace-no-wrap">{{ end.date }}</b>
            at {{ end.time }}
          </p>
          <p class="mb-2 text-lg">
            It lasted for
            <b class="whitespace-no-wrap">{{ longestStreak }}</b
            >.
          </p>
          <p class="inline-flex items-center text-base">
            <InfoIcon class="w-4 h-4 mr-1" />
            <a
              class="italic underline"
              target="_blank"
              rel="noopener"
              href="https://github.com/mornir/track-it#calculation-of-the-longest-streak"
              >How is the longest streak is calculated?</a
            >
          </p>
        </div>
        <p v-else class="text-lg">No streak recorded yet</p>
      </section>
      <section>
        <h2 class="mb-2 text-2xl">About this extension</h2>

        <p class="text-lg">
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://github.com/mornir/track-it"
            >See the code on GitHub</a
          >
        </p>

        <p class="text-lg">
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://github.com/mornir/track-it/issues/new"
            >Report bugs or propose new features</a
          >
        </p>

        <p class="text-lg">
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://www.flaticon.com/authors/bqlqn"
            >Clock icon by bqlqn</a
          >
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { getLongestStreak } from '@/utils/getHistoryFunctions.js'
import { formatDistance, format } from 'date-fns'
import mixin from '@/utils/mixin.js'

import DeleteIcon from '@/assets/svg/delete.svg'
import InfoIcon from '@/assets/svg/info.svg'

export default {
  name: 'Options',
  mixins: [mixin],
  components: {
    DeleteIcon,
    InfoIcon,
  },
  data() {
    return {
      url: '',
      urls: [],
      error: null,
      longestStreak: '',
      streakFromDate: '',
      start: {
        time: '',
        date: '',
        day: '',
      },
      end: {
        time: '',
        date: '',
        day: '',
      },
    }
  },
  async mounted() {
    try {
      this.urls = await this.getURLListfromStorage()

      const urlsPromises = this.urls.map(url =>
        browser.history.getVisits({
          url,
        })
      )

      const results = await Promise.all(urlsPromises)

      const streak = getLongestStreak(results)

      if (!streak) {
        this.longestStreak = ''
        return
      }

      const { firstTimestamp, secondTimestamp, startOfRecording } = streak

      const startDate = new Date(firstTimestamp)
      const endDate = new Date(secondTimestamp)

      this.streakFromDate = format(new Date(startOfRecording), 'dd.MM.yyyy')
      this.start.day = format(startDate, 'iiii')
      this.end.day = format(endDate, 'iiii')

      this.start.date = format(startDate, 'do LLLL yyyy')
      this.end.date = format(endDate, 'do LLLL yyyy')

      this.start.time = format(startDate, 'h:mm aaaa')
      this.end.time = format(endDate, 'h:mm aaaa')

      this.longestStreak = formatDistance(startDate, endDate)
    } catch (error) {
      console.error(error)
      this.longestStreak = ''
      this.error = error
    }
  },
  methods: {
    addURL() {
      this.urls.unshift(this.url)
      this.url = ''
      this.saveURLListtoStorage()
    },
    deleteURL(url) {
      this.urls = this.urls.filter(item => item !== url)
      this.saveURLListtoStorage()
    },
    saveURLListtoStorage() {
      try {
        browser.storage.local.set({ urls: this.urls })
      } catch (error) {
        console.error(error)
        this.error = error
      }
    },
    removeProtocol(url) {
      return url.split('//')[1]
    },
  },
}
</script>
