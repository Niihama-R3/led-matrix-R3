<template>
 <div>
  <v-btn
   elevation="2"
   @click="test">
   Flowing Line
  </v-btn>
  <v-toolbar-title>
   <span class="subhaeding">Number of Line</span>
  </v-toolbar-title>
  <span class="display-3 font-weight-light" v-text="Line_Num"></span>
  <v-slider min="1" max="10" v-model="Line_Num"></v-slider>
 </div>
</template>

<script>
export default {
  data: () => ({
    Line_Num: 1
  }),
  methods: {
    test: function () {
      this.axios.post('/api/show/FlowingLine', {
        Line_Num: this.Line_Num
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    }
  }
}
</script>
