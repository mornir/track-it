<template>
  <div>
    <form @submit="addURL">
      <h1>Options</h1>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Options',
  data() {
    return {
      urls: [],
    }
  },
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
