<template>
  <div>
    <form @submit.prevent="addURL">
      <h1>Options</h1>
      <input type="url" required v-model="url" />
      <button type="submit">Add URL</button>
    </form>
    <ul>
      <li v-for="url in urls" :key="url">
        {{ url }} <button @click="deleteURL(url)">X</button>
      </li>
    </ul>
    <p>Yikes! An error occured:</p>
    <pre>{{ error }}</pre>
    <p>
      You can report the error here:
      <a href="https://github.com/mornir/track-it/issues/new"
        >https://github.com/mornir/track-it/issues/new</a
      >
    </p>
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
  mounted() {
    this.getURLListfromStorage()
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
        if (Array.isArray(urls)) {
          this.urls = urls
        }
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
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Chivo:wght@300;900&display=swap');
/* html {
  width: 400px;
  height: 400px;
}
 */

body {
  font-family: 'Chivo', sans-serif;
  /*min-width: 220px;
  max-width: 500px */
}
</style>
