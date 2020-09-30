<template>
  <div>
    <p>{{ defaultText }}</p>
    <p>{{ date }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      date: 0
    }
  },
  async mounted() {
    console.log('hello')
    browser.extension.getBackgroundPage().console.log({ history: this.date })

    //browser.runtime.sendMessage({})

    /*     chrome.extension.getBackgroundPage().console.log(browser.history)
    function handleVisits(visits) {
      c onst length = visits.length
      console.log(visits[length - 1])

      const date = new Date(visits[length - 1].visitTime)
      chrome.extension.getBackgroundPage().console.log(date)
      this.date = date
    }
 */
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage('extName')
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
