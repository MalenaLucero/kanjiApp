//const url = 'https://kanjiapi.dev/v1/kanji/蛍'
let kanji
let kanjiArray = [] //array with the word's kanji (minus hiragana and katakana)
let kanjiData = []
let allWords = []

const confirm = () =>{
    let input = document.getElementById('input')
    kanji = input.value
    
    getKanjiArray(kanji)
    kanjiArray.forEach((e, index)=>{
      let url = 'https://kanjiapi.dev/v1/kanji/'+e
      fetch(url)
          .then(res=>res.json())
          .then(data=>{
            let newInternalKanji = new internalKanji(data.kanji, data.jlpt, data.meanings)
            kanjiArray[index] = newInternalKanji
            console.log(allWords)
          })
          .catch(error=>console.log(error))
    })

    let newWord = new storedWord(kanji, kanjiArray)
    allWords.push(newWord)
    console.log(allWords)    
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
function storedWord(word, kanjiList){
  this.word = word
  this.kanjiList = kanjiList
}

//internal kanji constructor
function internalKanji(kanji, jlpt, meaning){
  this.kanji = kanji
  this.jlpt = jlpt
  this.meaning = meaning
}

/*
word = {
  'kanji': kanjicompleto,
  'kanjiArray': []
}
*/







