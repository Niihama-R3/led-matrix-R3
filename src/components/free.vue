<template>
 <v-container>
  <v-file-input
   v-model="ImageFile"
   accept="image/*"
   filled
   counter
   @click:append-outer="SendImage"
   append-outer-icon="mdi-send"
   label="Image File Input">
  </v-file-input>
  <img src="ImageFile">
  <v-card>
   <v-img
    :value="Preview"
    src="http://172.19.210.25/ImageFile.jpg">
   </v-img>
   <v-card-title class="test-h6">
    preview
   </v-card-title>
  </v-card>
  <v-btn
   color="deep-purple accent-4"
   dark
   @click="Preview = !Preview">
   View preview
  </v-btn>
  <span class="display-3 font-weight-light" v-text="ImageFile"></span>
  <span class="display-3 font-weight-light" v-text="Preview"></span>
 </v-container>
</template>

<script>
export default {
  data: () => ({
    ImageFile: [123],
    ImageFile2: 123,
    Preview: false
  }),
  methods: {
    SendImage: function () {
      console.log(this.ImageFile)
      this.axios.post('/api/show/SendImage', {
        Image: this.ImageFile2
      })
        .then((res) => console.log(res.data))
        .catch((e) => alert('AAA' + e.response.status))
    }
  }
}
</script>
