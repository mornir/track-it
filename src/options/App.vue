<template>
  <div class="min-h-screen bg-gray-200" style="width: 400px">
    <div class="px-4 py-6">
      <h1 class="sr-only">Options</h1>
      <form @submit.prevent="addURL">
        <h2 class="mb-2 text-2xl">Tracked URLs</h2>
        <div class="flex mb-3">
          <input type="url" required v-model="url" class="flex-1 px-1 py-2" />
          <button type="submit" class="px-4 py-2 text-white bg-blackish">
            Add
          </button>
        </div>
      </form>
      <ul>
        <li v-for="url in urls" :key="url">
          <span class="mr-2 text-base italic break-words">{{
            removeProtocol(url)
          }}</span>
          <button @click="deleteURL(url)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-4 h-4"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
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
    </div>
    <div></div>
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
