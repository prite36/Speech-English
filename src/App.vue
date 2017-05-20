<template>
  <div id="app">
    <button @click="speechTest">hi</button>
    <br>
    <button @click="makeId">genkey</button>
    <input type="text" v-model="key"/>
    <button @click="joinRoom">connect</button>
    {{showText}} <br>
    {{showText2}}
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      showText: '',
      showText2: '',
      key: ''
    }
  },
  sockets: {
    connect () {
      console.log('socket connected')
    },
    yourLevel (val) {
      this.showText = val
    },
    rivalLevel (val) {
      this.showText2 = val
    }
  },
  methods: {
    joinRoom () {
      var vm = this
      this.$socket.emit('subscribe', vm.key)

      // socket.on('conversation private post', function(data) {
      //     //display data.message
      // })
    },
    test () {
      this.$socket.emit('set', 'test')
    },
    makeId () {
      var text = ''
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      this.key = text
      return this.key
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
        vm.$socket.emit('get', {
          room: vm.key,
          message: event.results[0][0].transcript
        })
        // vm.$socket.emit('get', event.results[0][0].transcript)
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
