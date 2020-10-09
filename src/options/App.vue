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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="w-4 h-4 hover:text-red-600"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
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
            >03.08.2020<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="inline-block w-4 h-4"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              /></svg
          ></span>
          and now, your longest streak started on Wednesday the
          <b class="whitespace-no-wrap">9th September 2020</b> at 10:32 and
          ended on Thursday the
          <b class="whitespace-no-wrap">12th September 2020</b>
          at 17:55.
        </p>
        <p class="mb-2 text-lg">
          It lasted for
          <b class="whitespace-no-wrap">5 days, 4 hours and 3 minutes</b>.
        </p>
      </section>
      <section>
        <h2 class="mb-2 text-2xl">About this extension</h2>

        <p class="text-lg">
          The code of this extension is open-source on GitHub. Feature requests
          and bug reports can
        </p>

        <p class="text-lg">
          The "logo" of the extension was made by
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://www.flaticon.com/authors/bqlqn"
            title="bqlqn"
            >bqlqn</a
          >
          from
          <a
            class="italic underline"
            target="_blank"
            rel="noopener"
            href="https://www.flaticon.com/"
            title="Flaticon"
          >
            www.flaticon.com</a
          >.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Options',
  data() {
    return {
      urls: [],
      url: '',
      error: null,
    }
  },
  async mounted() {
    this.urls = await this.getURLListfromStorage()
  },
  methods: {
    addURL() {
      this.urls.unshift(this.url)
      this.saveURLListtoStorage()
    },
    deleteURL(url) {
      this.urls = this.urls.filter(item => item !== url)
      this.saveURLListtoStorage()
    },
    async getURLListfromStorage() {
      try {
        const { urls } = await browser.storage.local.get()
        return Array.isArray(urls) ? urls : []
      } catch (error) {
        console.error(error)
      }
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Chivo:wght@300;900&display=swap');

body {
  font-family: 'Chivo', sans-serif;
}
</style>
