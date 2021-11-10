<template>
 <v-container>
  <v-text-field
   v-model="text">
  </v-text-field>
  <v-row justify="space-around">
   <v-responsive :aspect-ratio="13/9">
    <div>
     <v-row justify="space-around">
      <v-toolbar-title>
       <span class="subhaeding">String Item</span>
      </v-toolbar-title>
     </v-row>
     <v-row justify="space-around">
      <v-btn
       elevation="2"
       @click="SimpleString">
       Simple
      </v-btn>
     </v-row>
     <v-row justify="space-around">
      <v-btn
       elevation="2"
       @click="FlashString">
       Flash
      </v-btn>
     </v-row>
     <v-row justify="space-around">
      <v-btn
       elevation="2"
       @click="FadeString">
       Fade In/Out
      </v-btn>
     </v-row>
     <v-row justify="space-around">
      <v-toolbar-title>
       <span class="subhaeding">Effect Item</span>
      </v-toolbar-title>
     </v-row>
     <v-row justify="space-around">
      <v-btn
       elevation="2"
       @click="FlowLine">
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
     <v-row justify="space-around">
      <v-btn
       elevation="2"
       @click="FillBoard">
       Filling Board
      </v-btn>
      <div>
       <v-radio-group v-model="Fill_In" mandatory>
        <v-radio label="Flom Right" value=0>
        </v-radio>
        <v-radio label="Flom Left" value=1>
        </v-radio>
        <v-radio label="Flom Down" value=2>
        </v-radio>
        <v-radio label="Flom Up" value=3>
        </v-radio>
       </v-radio-group>
      </div>
      <div>
       <v-radio-group v-model="Fill_Out" mandatory>
        <v-radio label="To Right" value=0>
        </v-radio>
        <v-radio label="To Left" value=1>
        </v-radio>
        <v-radio label="To Down" value=2>
        </v-radio>
        <v-radio label="To Up" value=3>
        </v-radio>
       </v-radio-group>
      </div>
     </v-row>
    </div>
    <v-row justify="space-around">
     <v-btn
      elevation="2"
      @click="ZoomCircle">
      Zoom Circle
     </v-btn>
    </v-row>
   </v-responsive>
   <v-responsive :aspect-ratio="3/9">
    <v-row justify="space-around">
     <v-color-picker dot-size="25" canvas-height="300" swatches-max-height="200" v-model="rgb" show-swatches></v-color-picker>
    </v-row>
   </v-responsive>
  </v-row>
 </v-container>
</template>

<script>
export default {
  data: () => ({
    text: '',
    Line_Num: 1,
    Line_Time: 20,
    Line_Arrow: 0,
    Fill_In: 0,
    Fill_Out: 0,
    rgb: { r: 0, g: 0, b: 255 }
  }),
  methods: {
    SimpleString: function () {
      this.axios.post('/api/show/SimpleString', {
        Text: this.text,
        Color: this.rgb
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    },
    FlashString: function () {
      this.axios.post('/api/show/FlashString', {
        Text: this.text,
        Color: this.rgb
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    },
    FadeString: function () {
      this.axios.post('/api/show/FadeString', {
        Text: this.text,
        Color: this.rgb
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    },
    FlowLine: function () {
      this.axios.post('/api/show/FlowingLine', {
        Line_Num: this.Line_Num,
        Line_Time: this.Line_Time,
        Line_Arrow: this.Line_Arrow,
        Line_Color: this.rgb
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    },
    FillBoard: function () {
      this.axios.post('/api/show/FillingBoard', {
        Fill_In: this.Fill_In,
        Fill_Out: this.Fill_Out,
        Fill_Color: this.rgb
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    },
    ZoomCircle: function () {
      this.axios.post('/api/show/ZoomCircle', {
        Zoom_Color: this.rgb
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    }
  }
}
</script>
