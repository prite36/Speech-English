<template>
  <div id="app" class="container-fluid">
    <div v-if="page === 0" class="page row">
      <div class="content" @click="changepage(1)">
        <img  class="firstPage img-rounded"  src="../static/images/logoGame.jpg" />
      </div>
      <input class="form-control" type="text" v-model="nameMe" placeholder="Guest [0-10]" autofocus maxlength="10" /><br/>
      <button class="btn btn-success" @click="changepage(1)">Start</button>
    </div>
    <!-- ////////////////////////////////////////////////////////////////////// -->
    <div v-else-if="page === 1" class="page1 row">
      <div class="box" @click="changepage(2)">
        <img class='menu' src="../static/images/single.png">
      </div>
      <div class="box2" @click="changepage(3)">
        <img class='menu' src="../static/images/multi.png">
      </div>
    </div>
    <!-- ///////////////////////////////////////////////////////////////////////////////////////////// -->
    <div v-else-if="page === 2" class="page row">
      <p class="level">{{myLv}}</p>
      <div class="test">
        2
        <button @click="speechTest">hi</button>
        {{waitingTime}}
        {{nameMe}}
        {{word}} <br>
        {{howTo}} <br> <br><br>
        {{showText}} <br>
        God:
        <input type="text"  v-model="testSpeak">
        <button @click="testSend()">OK</button>
        <div v-for="(i, index) in rankSort">
          {{index + 1}}
          {{i.name}}
          {{i.lv}}
        </div>
      </div>
      <button type="button"  class="home" @click="changepage(1)">Home</button>
      <div class="box-text">
        {{word}}
      </div>
      <div class="box-text">
        {{showText}}
      </div>
      <div class="run-tab">
        <div style="float: left;" v-for="i in stepMe">
          <img v-if="i !== -1" class="run" src="../static/images/run.gif">
          <img v-else class="space" src="../static/images/circle.png">
        </div>
      </div>
    </div>
    <!-- ////////////////////////////////////////////////////////////////////////////////////////////// -->
    <div v-else-if="page === 3" class="page row">
      3
      {{match}}
      {{nameRival}} -->
      <div v-if="!checkKey">
        <button @click="makeID">genkey</button>
        <input type="text" v-model="key"/>
      </div>
      <div v-else >
        {{key}}
      </div>
      <div v-if="connectButton" >
        <button @click="joinRoom()">connect</button><br><br>
      </div>
      <div v-if="nameRival !== '' &&  key !== ''">
        <button v-if="!readyMe" type="button" @click="startGame(true)">Ready</button>
        <button v-else type="button" @click="startGame(false)">Cancle</button><br><br>
      </div>
      <div v-for="i in events">
        {{i.item}}
      </div>
      <button type="button" class="home" @click="changepage(1)">Home</button><br><br>
    </div>
    <!-- ///////////////////////////////////////////////////////////////////////////////////////////////// -->
    <div v-else-if="page === 4" class="page row">
      4
      {{nameMe}}
      {{nameRival}}
        <button @click="speechTest">hi</button>
        <br>
        <div v-if="player !== 0 && player > 1"   >
          <p class="level">{{level + 1}}</p>
          {{waitingTime}}
          {{word}}
          {{howTo}} <br> <br><br>
          {{showText.message}} <br>
          <!-- {{showText2}} -->
        </div>
        <div class="run-tab">
          <div style="float: left;" v-for="i in stepMe">
            <img v-if="i !== -1" class="run" src="../static/images/run.gif" >
            <img v-else class="space" src="../static/images/circle.png">
          </div>
          <br>
          <br>
          <div style="float: left;" v-for="i in stepRival">
            <img v-if="i !== -1 && player === 2" class="run" src="../static/images/run.gif" >
            <img v-else-if="i !== -1 && player > 2" class="run" src="../static/images/fall.gif" >
            <img v-else class="space" src="../static/images/circle.png" width= "20px">
          </div>
        </div>
        God:
        <input type="text"  v-model="testSpeak">
        <button @click="testSend()">OK</button>
      <button type="button" class="home" @click="changepage(1)">Home</button><br><br>
    </div>
    <!-- //////////////////////////////////////////////////////////////////////////////////////////////////// -->
    <div v-else-if="page === 5" class="page row">
      5
      <button type="button" class="home" @click="changepage(1)">Home</button><br><br>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase'
import _ from 'lodash'
var config = {
  apiKey: 'AIzaSyAwb3kvmYTLSynieFFhN3GZfgU8BUi69ck',
  authDomain: 'speech-english.firebaseapp.com',
  databaseURL: 'https://speech-english.firebaseio.com',
  projectId: 'speech-english',
  storageBucket: 'speech-english.appspot.com',
  messagingSenderId: '255281834477'
}
firebase.initializeApp(config)

var Events = firebase.database().ref('events')
var Ranking = firebase.database().ref('ranking')

export default {
  name: 'app',
  data () {
    return {
      page: 0,
      nameMe: '',
      nameRival: '',
      readyMe: false,
      readyRival: false,
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
      stepRival: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      waiting: '',
      waitingTime: 1,
      checkKey: false,
      match: '',
      words: [],
      events: [],
      allData: [],
      ranking: [],
      myLv: 1,
      lvSort: [],
      connectButton: true
    }
  },
  sockets: {
    connect () {
      console.log('socket connected')
    },
    getName (name) {
      var vm = this
      console.log('name1 ' + name.name)
      if (this.nameRival === '') {
        console.log('PASS')
        var delay = setInterval(() => {
          this.$socket.emit('setName', {name: vm.nameMe, room: vm.key})
          clearInterval(delay)
        }, 1000)
      }
      this.nameRival = name.name
    },
    getReady (bool) {
      this.readyRival = bool
      if (this.readyMe && this.readyRival) {
        this.page = 4
      }
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
      // console.log(data)
      if (data === -1) {
        alert('More players')
      } else if (data === -2) {
        this.key = ''
        this.checkKey = false
        this.connectButton = true
        alert('No room')
      } else if (typeof data === 'number') {
        this.player = 3
        this.interrupt = false
      } else {
        this.key = data.key
        this.word = data.word.word
        this.howTo = data.word.example
        this.player = data.player
        this.interrupt = false
      }
    },
    statusPlayer (bool) {
      var vm = this
      if (bool) {
        vm.waitingTime = 10
        vm.waiting = setInterval(() => {
          vm.waitingTime--
          if (vm.waitingTime === 0) {
            vm.leaving()
            vm.page = 3
            vm.changepage(vm.page)
          }
        }, 1000)
        this.speechTest()
      }
    },
    singleWords (data) {
      this.words = data
      this.word = this.words[0].word
      this.howTo = this.words[0].example
    }
  },
  methods: {
    changepage (page) {
      var vm = this
      this.page = page
      console.log(page)
      if (this.page === 0) {
      } else if (vm.page === 1) {
        if (this.nameMe === '') {
          this.nameMe = 'Guest'
        }
        this.leaving()
        this.nameRival = ''
        this.readyMe = false
        this.readyRival = false
        this.showText = ''
        this.showText2 = ''
        this.key = ''
        this.word = ''
        this.howTo = ''
        this.player = ''
        this.testSpeak = ''
        this.level = 0
        this.levelRival = 0
        this.stepMe = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        this.stepRival = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        this.waiting = ''
        this.waitingTime = 1
        this.checkKey = false
        this.words = []
        this.myLv = 1
        this.connectButton = true
      } else if (this.page === 2) {
        this.$socket.emit('singleWords')
        vm.waitingTime = 10
        vm.waiting = setInterval(() => {
          vm.waitingTime--
          if (vm.waitingTime === 0) {
            var temp = {
              id: Math.floor(Math.random() * 1010),
              lv: 99999
            }
            if (vm.ranking.length < 10) {
              firebase.database().ref('ranking/' + temp.id).update({
                name: vm.nameMe,
                lv: vm.myLv
              })
            } else {
              var checkNoy = vm.ranking.find(rank => rank.lv < vm.myLv)
              if (checkNoy) {
                for (var i = 0; i < vm.ranking.length; i++) {
                  if (vm.ranking[i].lv < temp.lv) {
                    temp.id = vm.ranking[i].id
                    temp.lv = vm.ranking[i].lv
                  }
                }
                firebase.database().ref('ranking/' + temp.id).remove()
                firebase.database().ref('ranking/' + temp.id).update({
                  name: vm.nameMe,
                  lv: vm.myLv
                })
              }
            }
            vm.leaving()
          }
        }, 1000)
        this.speechTest()
      } else if (this.page === 3) {
        clearInterval(vm.waiting)
        if (this.level === 9 && this.levelRival < 9) {
          this.match = 'You Win !!'
        } else if (this.level === 9 && this.levelRival === 9) {
          this.match = 'You Good! but ' + this.nameRival + ' faster than you.'
          // firebase.database().ref('events/').remove()
          firebase.database().ref('events/').update({
            last: vm.nameMe.toString() + ' ' + (vm.level + 1) + ' - ' + (vm.levelRival + 1) + ' ' + vm.nameRival
          })
        } else if (this.player === 2 || this.player === 3) {
          console.log(this.player)
          this.match = this.nameMe.toString() + ' Lose ' + this.nameRival
          firebase.database().ref('events/').update({
            last: vm.nameMe.toString() + ' ' + (vm.level + 1) + ' - ' + (vm.levelRival + 1) + ' ' + vm.nameRival
          })
        } else {
          this.match = this.nameMe.toString() + ' ' + (this.level + 1) + ' - ' + (this.levelRival + 1) + ' ' + this.nameRival
          // firebase.database().ref('events/').remove()
        }
        // this.player = 0
        this.readyMe = false
        this.readyRival = false
        this.checkKey = false
        this.key = ''
        this.nameRival = ''
        this.level = 0
        this.levelRival = 0
        this.stepMe = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        this.stepRival = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      } else if (this.page === 4) {
      }
    },
    startGame (bool) {
      var vm = this
      this.readyMe = bool
      vm.$socket.emit('getReady', {room: vm.key, ready: bool})
      if (this.readyMe && this.readyRival) {
        this.page = 4
      }
    },
    leaving () {
      var vm = this
      clearInterval(vm.waiting)
      if (vm.key !== '') {
        vm.$socket.emit('remove', {room: vm.key, level: this.level})
      }
    },
    makeID () {
      this.$socket.emit('genRoom')
      this.connectButton = false
    },
    joinRoom () {
      var vm = this
      if (vm.key !== '') {
        this.checkKey = true
        this.connectButton = false
        this.$socket.emit('setName', {name: vm.nameMe, room: vm.key})
        this.$socket.emit('subscribe', {room: vm.key, level: this.level})
      } else {
        alert('Please input key.')
      }
    },
    test () {
      this.$socket.emit('set', 'test')
    },
    speechTest () {
      var vm = this
      if (this.waitingTime > 0) {
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        // recognition.onspeechstart = function () {
        //   console.log('Speech  detected')
        // }
        // recognition.onspeechend = function () {
        //   console.log('Speech stopped')
        // }
        // recognition.continuous = true
        recognition.maxAlternatives = 5
        recognition.start()
        recognition.onresult = function (event) {
          console.log('You said: ', event.results[0][0].transcript)
          console.log(vm.page)
          var stat = vm.checkWord(event.results[0][0].transcript)
          if (vm.page === 4) {
            if (vm.level === 9) {
              vm.leaving()
              vm.page = 3
              vm.changepage(vm.page)
            } else {
              vm.$socket.emit('get', {
                room: vm.key,
                message: event.results[0][0].transcript,
                stat: stat
              })
            }
          } else if (vm.page === 2) {
            // console.log(event.results[0][0].transcript)
            console.log('in 2')
            vm.showText = event.results[0][0].transcript
            if (event.results[0][0].transcript === vm.words[vm.level].word) {
              vm.waitingTime += 3
              vm.myLv++
              if (vm.level === 9) {
                vm.$socket.emit('singleWords')
                vm.stepMe[vm.stepMe.length - 1] = -1
                vm.stepMe[0] = 0
                vm.level = 0
              } else {
                vm.level++
                vm.word = vm.words[vm.level].word
                vm.howTo = vm.words[vm.level].example
                vm.stepMe[vm.level - 1] = -1
                vm.stepMe[vm.level] = vm.level
              }
            }
            recognition.stop()
          }
          // vm.$socket.emit('get', event.results[0][0].transcript)
        }
      }
    },
    checkWord (val) {
      // console.log(val)
      if (val.toLowerCase() === this.word) {
        this.speechTest()
        this.waitingTime += 3
        if (this.level === 9 && this.page === 4) {
          this.page = 3
          this.changepage(this.page)
        }
        return this.level + 1
      } else {
        this.speechTest()
        return this.level
      }
    },
    testSend () {
      this.showText = this.testSpeak = this.word
      var vm = this
      var stat = vm.checkWord(vm.testSpeak)
      if (this.page === 4) {
        if (this.level === 9) {
          vm.leaving()
          vm.page = 3
          vm.changepage(vm.page)
        } else {
          vm.$socket.emit('get', {
            room: vm.key,
            message: this.testSpeak,
            stat: stat
          })
        }
      } else if (this.page === 2) {
        if (this.testSpeak === this.words[this.level].word) {
          this.waitingTime += 3
          this.myLv++
          if (this.level === 9) {
            this.$socket.emit('singleWords')
            this.stepMe[this.stepMe.length - 1] = -1
            this.stepMe[0] = 0
            this.level = 0
          } else {
            this.level++
            this.word = this.words[this.level].word
            this.howTo = this.words[this.level].example
            this.stepMe[this.level - 1] = -1
            this.stepMe[this.level] = this.level
          }
        }
      }
    }
  },
  mounted () {
    console.log(typeof window.orientation)
    window.addEventListener('beforeunload', this.leaving)
    var vm = this
    Events.on('child_added', function (snapshot) {
      var item = snapshot.val()
      vm.events.push({item: item})
    })
    Events.on('child_changed', function (snapshot) {
      var item = snapshot.val()
      if (vm.events.length === 3) {
        vm.events = vm.events.slice(1, 3)
      }
      vm.events.push({item: item})
    })
    Ranking.on('child_added', function (snapshot) {
      var item = snapshot.val()
      item.id = snapshot.key
      vm.ranking.push(item)
    })
    Ranking.on('child_changed', function (snapshot) {
      var id = snapshot.key
      var rank = vm.ranking.find(rank => rank.id === id)
      rank.x = snapshot.val().name
      rank.y = snapshot.val().lv
    })
    Ranking.on('child_removed', function (snapshot) {
      var id = snapshot.key
      vm.ranking.splice(vm.ranking.findIndex(rank => rank.id === id), 1)
    })
  },
  computed: {
    rankSort: function () {
      return _.sortBy(this.ranking, (num) => {
        return -num.lv
      })
    }
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
  /*margin-top: 60px;*/
}
</style>
<style src="../static/css/page1.css"> </style>
