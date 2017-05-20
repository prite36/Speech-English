<template>
  <div id="app">
    <button @click="speechTest">hi</button>
    {{showText}}
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      showText: ''
    }
  },
  sockets: {
    connect () {
      console.log('socket connected')
    },
    get (val) {
      console.log(val)
      console.log('1')
      this.showText = val
    }
  },
  methods: {
    test () {
      this.$socket.emit('set', 'test')
    },
    makeId () {
      var text = ''
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    },
    speechTest () {
      var vm = this
      var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
      recognition.lang = 'th'
      recognition.interimResults = false
      recognition.maxAlternatives = 5
      recognition.start()

      recognition.onresult = function (event) {
        // console.log('You said: ', event.results[0][0].transcript)
        vm.$socket.emit('get', event.results[0][0].transcript)
      }
    }
  },
  mounted () {
    // this.$socket.emit('get', 'id')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
