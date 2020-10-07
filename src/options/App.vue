<template>
  <div>
    <form @submit="addURL">
      <h1>Options</h1>
      <input type="url" required v-model="url" />
      <button type="submit">Add URL</button>
    </form>
    <ul>
      <li v-for="url in urls" :key="url">
        {{ url }} <button @click="deleteURL(url)">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Options',
  data() {
    return {
      urls: [],
      url: '',
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
    async saveURLListtoStorage() {
      try {
        await browser.storage.local.set(this.urls)
        this.getURLListfromStorage()
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
