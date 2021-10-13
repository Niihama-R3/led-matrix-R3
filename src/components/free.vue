<template>
 <v-container>
  <v-file-input
   v-model="ImageFile"
   accept="image/*"
   filled
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
    Preview: false
  }),
  async mounted () {
    console.log('mounted')
    this.$watch('ImageFile', function () {
      this.axios.post('/api/update/ImageFile', {
        ImageFile: this.ImageFile
      })
        .then((res) => console.log('DoneImageFile' + res.data))
        .catch((e) => alert(e))
    })
    this.loading = false
  }
}
</script>
