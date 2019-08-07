//const url = 'https://kanjiapi.dev/v1/kanji/蛍'
let kanji
let anotation
let kanjiArray = [] //array with the word's kanji (minus hiragana and katakana)
let kanjiData = []
let allWords = []

const confirm = () =>{
    let kanjiInput = document.getElementById('kanjiInput')
    kanji = kanjiInput.value
    kanjiInput.value = ''
    let anotationInput = document.getElementById('anotationInput')
    anotation = anotationInput.value
    
    getKanjiArray(kanji)
    kanjiArray.forEach((e, index)=>{
      let url = 'https://kanjiapi.dev/v1/kanji/'+e
      fetch(url)
          .then(res=>res.json())
          .then(data=>{
            console.log(data)
            let newInternalKanji = new internalKanji(data.kanji, data.jlpt, data.kun_readings, data.on_readings, data.meanings)
            kanjiArray[index] = newInternalKanji
            console.log(allWords)
          })
          .catch(error=>console.log(error))
    })

    let newWord = new storedWord(kanji, anotation, kanjiArray)
    allWords.push(newWord)    
}

const searchKanjiInfo = () =>{
  let input = document.getElementById('searchKanji')
  kanjiIndex = ''
  kanjiIndex = allWords.find((e, index)=> {if(e.word === input.value) return index})
  if(typeof kanjiIndex === 'number') console.log('number')
}

//from a full kanji and kana word or phrase, it extracts only the kanji
const getKanjiArray = (word) =>{
  kanjiArray = []
  //iteration of a string
  for (const c of word) {
    //console.log(c, c.charCodeAt())//unicode in dec
    //console.log(c.charCodeAt().toString(16))//unicode in hex
    if(c.charCodeAt() >= 13312){
      kanjiArray.push(c)
    }
  }
  return kanjiArray
}

//object constructor
function storedWord(word, anotation, kanjiList){
  this.word = word
  this.anotation = anotation
  this.kanjiList = kanjiList
}

//internal kanji constructor
function internalKanji(kanji, jlpt, kun_readings, on_readings, meaning){
  this.kanji = kanji
  this.jlpt = jlpt
  this.kun_readings = kun_readings
  this.on_readings = on_readings
  this.meaning = meaning
}

/*
word = {
  'kanji': kanjicompleto,
  'kanjiArray': []
}
*/

//receives an object
const wordsSharingKanji = (term) =>{
  let sameKanji
  let wordsSharing = allWords.filter(word=>{
    sameKanji = false
    term.kanjiList.forEach(e=>{
      word.kanjiList.forEach(elem => {
        if(e.kanji === elem.kanji) sameKanji = true
      })
    })
    if(sameKanji) return word
  })
  printList(wordsSharing)
}

const printList = (array) =>{
  let ul = document.getElementById('wordsSharingKanjiContainer')
  ul.innerHTML = ''
  array.forEach(e=>{
    let li = document.createElement('li')
    li.innerText = e.word
    ul.appendChild(li)
  })
}







