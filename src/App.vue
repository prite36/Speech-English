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
    <div v-if="player !== 0" >
      {{word}} <br> {{level + 1}} <br>
      {{howTo}} <br> <br><br>
      {{showText}} <br>
      {{showText2}}
    </div>
    <div style="float: left;" v-for="i in stepMe">
      <img v-if="i !== -1" src="../static/images/run.gif" width= "20px" >
      <img v-else src="../static/images/circle.png" width= "20px">
    </div>
    <br>
    <div style="float: left;" v-for="i in stepRival">
      <img v-if="i !== -1 && player === 2" src="../static/images/run.gif" width= "20px" >
      <img v-else-if="i !== -1 && player > 2" src="../static/images/fall.gif" width= "20px" >
      <img v-else src="../static/images/circle.png" width= "20px">
    </div>
    <br>
    God:
    <input type="text"  v-model="testSpeak">
    <button @click="testSend()">OK</button>
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
      player: '',
      testSpeak: '',
      level: 0,
      levelRival: 0,
      stepMe: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      stepRival: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    }
  },
  sockets: {
    connect () {
      console.log('socket connected')
    },
    yourLevel (val) {
      this.showText = val
      this.level = val.level
      this.stepMe[this.level - 1] = -1
      this.stepMe[this.level] = this.level
    },
    rivalLevel (val) {
      this.showText2 = val
      this.levelRival = val.level
      this.stepRival[this.levelRival - 1] = -1
      this.stepRival[this.levelRival] = this.level
    },
    genRoom (data) {
      this.key = data.id
      this.joinRoom()
    },
    players (data) {
      if (data === -1) {
        alert('More players')
      } else {
        this.key = data.key
        this.word = data.word.word
        this.howTo = data.word.example
        this.player = data.player
      }
    }
  },
  methods: {
    leaving () {
      var vm = this
      alert(vm.key)
      if (vm.key !== '') {
        vm.$socket.emit('remove', {room: vm.key})
      }
    },
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
        var stat = vm.checkWord(event.results[0][0].transcript)
        vm.$socket.emit('get', {
          room: vm.key,
          message: event.results[0][0].transcript,
          stat: stat
        })
        // vm.$socket.emit('get', event.results[0][0].transcript)
      }
    },
    checkWord (val) {
      console.log(val)
      if (val.toLowerCase() === this.word) {
        return this.level + 1
      } else {
        return this.level
      }
    },
    testSend () {
      var vm = this
      console.log(vm.key)
      var stat = vm.checkWord(vm.testSpeak)
      vm.$socket.emit('get', {
        room: vm.key,
        message: this.testSpeak,
        stat: stat
      })
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.leaving)
    // window.beforeunload = this.leaving
    // window.onblur = this.leaving
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
