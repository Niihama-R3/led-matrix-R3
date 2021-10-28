<template>
 <v-container>
  <v-row justify="space-around">
   <v-btn
    elevation="2"
    @click="test">
    Flowing Line
   </v-btn>
   <div>
    <v-radio-group v-model="Line_Arrow" mandatory>
     <v-radio label="Right to Left" value=0>
     </v-radio>
     <v-radio label="Left to Right" value=1>
     </v-radio>
     <v-radio label="Down to Up" value=2>
     </v-radio>
     <v-radio label="Up to Down" value=3>
     </v-radio>
    </v-radio-group>
   </div>
   <div>
    <v-toolbar-title>
     <span class="subhaeding">Number of Line</span>
    </v-toolbar-title>
    <span class="display-3 font-weight-light" v-text="Line_Num"></span>
    <v-slider min="1" max="10" v-model="Line_Num"></v-slider>
   </div>
   <div>
    <v-toolbar-title>
     <span class="subhaeding">Effect Time</span>
    </v-toolbar-title>
    <span class="display-3 font-weight-light" v-text="Line_Time"></span>
    <v-slider min="20" max="50" v-model="Line_Time"></v-slider>
   </div>
  </v-row>
 </v-container>
</template>

<script>
export default {
  data: () => ({
    Line_Num: 1,
    Line_Time: 20,
    Line_Arrow: 0
  }),
  methods: {
    test: function () {
      this.axios.post('/api/show/FlowingLine', {
        Line_Num: this.Line_Num,
        Line_Time: this.Line_Time,
        Line_Arrow: this.Line_Arrow
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    }
  }
}
</script>
