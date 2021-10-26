<template>
  <v-btn
   elevation="2"
   @click="test">
   Flowing Line
  </v-btn>
</template>

<script>
export default {
  methods: {
    test: function () {
      this.axios.post('/api/show/FlowingLine', {
        text: 'Flowing Line'
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    }
  }
}
</script>
