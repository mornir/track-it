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
          <p>Yikes! An error occured:</p>
          <pre>{{ error }}</pre>
          <p>
            You can report the error here:
            <a href="https://github.com/mornir/track-it/issues/new"
              >https://github.com/mornir/track-it/issues/new</a
            >
          </p>
        </div>
      </section>
      <section class="mb-8">
        <h2 class="mb-2 text-2xl">Longest Streak</h2>
        <p class="text-lg">
          Between
          <span title="earliest entry in your browsing history"
            >{{ streakFromDate }}<InfoIcon class="inline-block w-4 h-4"
          /></span>
          and now, your longest streak started on {{ dayOfWeek.start }} the
          <b class="whitespace-no-wrap">{{ startDate }}</b> at
          {{ startTime }} and ended on {{ dayOfWeek.end }} the
          <b class="whitespace-no-wrap">{{ endDate }}</b>
          at {{ endTime }}.
        </p>
        <p class="mb-2 text-lg">
          It lasted for
          <b class="whitespace-no-wrap">{{ longestStreak }}</b
          >.
        </p>
      </section>
      <section>
        <h2 class="mb-2 text-2xl">About this extension</h2>

        <p class="text-lg">
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://github.com/mornir/track-it"
            title="bqlqn"
            >See the code on GitHub</a
          >
        </p>

        <p class="text-lg">
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://github.com/mornir/track-it/issues/new"
            title="bqlqn"
            >Report bugs or propose new features</a
          >
        </p>

        <p class="text-lg">
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://www.flaticon.com/authors/bqlqn"
            title="bqlqn"
            >Clock icon by bqlqn</a
          >
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { formatDistance, format } from 'date-fns'
import mixin from '@/utils/mixin.js'

import DeleteIcon from '@/assets/svg/delete.svg'
import InfoIcon from '@/assets/svg/info.svg'

export default {
  mixins: [mixin],
  name: 'Options',
  components: {
    DeleteIcon,
    InfoIcon,
  },
  data() {
    return {
      url: '',
      error: null,
      urls: [],
      longestStreak: '',
      streakFromDate: '',
      startDayOfWeek: '',
      dayOfWeek: {
        start: '',
        end: '',
      },
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }
  },
  async mounted() {
    this.urls = await this.getURLListfromStorage()
    const {
      firstTimestamp,
      secondTimestamp,
      startOfRecording,
    } = await this.getLongestStreak(this.urls)

    this.streakFromDate = format(new Date(startOfRecording), 'dd.MM.yyyy')
    this.dayOfWeek.start = format(new Date(firstTimestamp), 'iiii')
    this.dayOfWeek.end = format(new Date(secondTimestamp), 'iiii')

    this.startDate = format(new Date(firstTimestamp), 'eo LLLL yyyy')
    this.endDate = format(new Date(secondTimestamp), 'eo LLLL yyyy')

    this.startTime = format(new Date(firstTimestamp), 'h:m')
    this.endTime = format(new Date(secondTimestamp), 'h:m')

    this.longestStreak = formatDistance(
      new Date(firstTimestamp),
      new Date(secondTimestamp)
    )
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
      }
    },
    removeProtocol(url) {
      return url.split('//')[1]
    },
  },
}
</script>
