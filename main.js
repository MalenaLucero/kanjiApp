//api = 'https://kanjiapi.dev/v1/kanji/蛍'
let allWords = []//stores the full words the user inputs into the app

const checkExistingData = () =>{
  let storedData = window.localStorage.getItem('locallyStoredData')
  if(storedData){allWords = JSON.parse(storedData)} 
  console.log(allWords)
}

checkExistingData()

const initialize = () =>{
  printRelatedWords(allWords[allWords.length - 1].word)
}

const confirm = () =>{
    let kanji = inputValue('kanjiInput')
    innerHTMLCleaner('kanjiInputError')
    if(kanji !== '' && !alreadyExistingKanji(kanji)){
      let reading = inputValue('readingInput')
      let anotation = inputValue('anotationInput')
      let kanjiArray = getKanjiArray(kanji)//creates an array with only the kanji (no hiragana or katakana)

      kanjiArray.forEach((e, index)=>{
        let url = 'https://kanjiapi.dev/v1/kanji/'+e
        fetch(url)
            .then(res=>res.json())
            .then(data=>{
              console.log(data)
              let newInternalKanji = new internalKanji(data.kanji, data.jlpt, data.kun_readings, data.on_readings, data.meanings)
              kanjiArray[index] = newInternalKanji
              console.log(allWords)
              //local storage
              let parsedData = JSON.stringify(allWords)  
              window.localStorage.setItem('locallyStoredData', parsedData)
              printRelatedWords(allWords[allWords.length - 1].word)
            })
            .catch(error=>console.log(error))
      })

      let newWord = new storedWord(kanji, reading, anotation, kanjiArray)
      allWords.push(newWord)  
    }else(printOnScreen('kanjiInputError', 'Kanji already exists or input is empty'))
}

const alreadyExistingKanji = (newKanji) =>{
  let existingKanji = false
  allWords.forEach(words=>{if(words.word === newKanji) existingKanji = true})
  return existingKanji
}

const printRelatedWords = (newWord) =>{
  innerHTMLCleaner('wordsSharingKanjiContainer')
  innerHTMLCleaner('kanjiCompared')
  printOnScreen('kanjiCompared', `Word: ${newWord}`)
  let kanjiRelatedWords = wordsSharingKanji(newWord)
  let kanjiArray = getKanjiArray(newWord)
  kanjiRelatedWords.forEach((words, index)=>{
    if(words.length !== 0){
      printOnScreen('wordsSharingKanjiContainer', `Words sharing 「${kanjiArray[index]}」 kanji:`)
      printList('wordsSharingKanjiContainer', words.map(e=>e.word), words.map(e=>e.reading))
    }
  })

}

//receives the id of an input, takes the value, cleans the HTML and returns input.value
const inputValue = (inputId) =>{
  let input = document.getElementById(inputId)
  let value = input.value
  input.value = ''
  return value
}

//from a full kanji and kana word or phrase, it extracts only the kanji
const getKanjiArray = (word) =>{
  let kanjiArray = []
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
function storedWord(word, reading, anotation, kanjiList){
  this.word = word
  this.reading = reading
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

//receives a string and returns an array
const wordsSharingKanji = (term) =>{
  let same
  let sameKanjiWords = []
  let termsKanji = getKanjiArray(term)
  termsKanji.forEach((kanji, index)=>{
    sameKanjiWords[index] = allWords.filter(word=>{
      same = false
      word.kanjiList.forEach(intKanji=>{
        if(kanji === intKanji.kanji) same = true
      })
      if(same && word.word !== term) return word
    })
  })
  return sameKanjiWords
}

//receives a string
const wordsSharingOnyomi = (term) =>{
  innerHTMLCleaner("wordsSharingOnyomiContainer")
  let termObject = allWords.find(e=> {if(e.word===term) return e})
  let same = false
  termObject.kanjiList.forEach(kanji=>{
    kanji.on_readings.forEach(on=>{
      let sameOnyomi = []
      sameOnyomi = allWords.filter(word=>{
        same = false
        word.kanjiList.forEach(innerKanji =>{
          innerKanji.on_readings.forEach(innerOn =>{
            if(innerOn === on) same = true
          })
        })
        if(same) return word
      })
      sameOnyomi.splice(sameOnyomi.indexOf(sameOnyomi.find(e=>e.word === term)), 1)
      if(sameOnyomi.length > 0){
        printOnScreen('wordsSharingOnyomiContainer', `Words sharing 「${on}」 onyomi:`)
        printList('wordsSharingOnyomiContainer', sameOnyomi.map(e=>e.word), sameOnyomi.map(e=>e.reading))
      }
    })
  })
}

const printList = (containerId, array, secondArray) =>{
  let container = document.getElementById(containerId)
  let ul = document.createElement('ul')
  array.forEach((e, index)=>{
    let li = document.createElement('li')
    li.innerText = `${e} (${secondArray[index]})`
    ul.appendChild(li)
  })
  container.appendChild(ul)
}

const printOnScreen = (containerId, string) =>{
  let div = document.getElementById(containerId)
  let p = document.createElement('p')
  p.innerText = string
  div.appendChild(p)
}

const showRelatedKanji = () =>{
  let input = inputValue('searchKanji')
  wordsSharingKanji(input)
}

const innerHTMLCleaner = (containerId) =>{
  let container = document.getElementById(containerId)
  container.innerHTML = ''
}









