<template>
  <div id="app">
    <button @click="speechTest">hi</button>
    <br>
    <div v-if="key === ''">
      <button @click="makeID">genkey</button>
      <input type="text" v-model="key"/>
    </div>

    <div v-else >
      {{key}}
    </div>
    <button @click="joinRoom()">connect</button>
    <div v-if="player === 2" >
      {{word}} <br>
      {{howTo}} <br> <br><br>
      {{showText}} <br>
      {{showText2}}
    </div>

  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      showText: '',
      showText2: '',
      key: '',
      word: '',
      howTo: '',
      player: ''
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
    },
    genRoom (data) {
      this.key = data.id
      this.joinRoom()
    },
    players (data) {
      if (data === -1) {
        alert('More players')
      } else {
        this.word = data.word.word
        this.howTo = data.word.example
        this.player = data.player
      }
    }
  },
  methods: {
    makeID () {
      this.$socket.emit('genRoom')
    },
    joinRoom () {
      var vm = this
      this.$socket.emit('subscribe', {room: vm.key})

      // socket.on('conversation private post', function(data) {
      //     //display data.message
      // })
    },
    test () {
      this.$socket.emit('set', 'test')
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
