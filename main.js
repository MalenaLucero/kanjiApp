//api = 'https://kanjiapi.dev/v1/kanji/蛍'
let userInput = {
  allWords: [],//stores the full words the user inputs
  allKanji: []//stores only the kanji of the words the user inputs, without repeating kanji
}

const checkExistingData = () =>{
  let storedData = window.localStorage.getItem('locallyStoredData')
  if(storedData){userInput = JSON.parse(storedData)} 
  console.log(userInput)
}

checkExistingData()

const confirm = () =>{
    let {allWords, allKanji} = userInput
    let word = inputValue('wordInput')
    innerHTMLCleaner('wordInputError')
    if(word !== '' && !alreadyExistingItem(word, allWords.map(e=>e.word)) ){
      let kanjiArray = getKanjiArray(word)
      let newWord = new storedWord(word, inputValue('readingInput'), inputValue('anotationInput'), kanjiArray)
      userInput.allWords.push(newWord)
      setLocalStorage()
      showElement('mainRelatedKanji')
      printRelatedWords(word, 'relatedKanjiContainer')
      kanjiArray.forEach( e =>{
        if(!alreadyExistingItem(e, allKanji.map(e=>e.kanji))){
          fetch('https://kanjiapi.dev/v1/kanji/' + e)
            .then(res=>res.json())
            .then(res=>{
              let newKanji = new storedKanji(res.kanji, res.jlpt, res.kun_readings, res.on_readings, res.meanings)
              userInput.allKanji.push(newKanji)
              setLocalStorage()
            })
            .catch(error=>console.log(error))
        }
      })
    }else(printOnScreen('wordInputError', 'Word already exists or input is empty'))
    console.log(userInput)
}

const setLocalStorage = () =>{
  let parsedData = JSON.stringify(userInput)  
  window.localStorage.setItem('locallyStoredData', parsedData)
}

//checks if a word or a kanji is already in an array
const alreadyExistingItem = (newItem, arrayOfItems) =>{
  let existingItem = false
  arrayOfItems.forEach(item=>{if(item === newItem) existingItem = true})
  return existingItem
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
function storedKanji(kanji, jlpt, kun_readings, on_readings, meaning){
  this.kanji = kanji
  this.jlpt = jlpt
  this.kun_readings = kun_readings
  this.on_readings = on_readings
  this.meaning = meaning
}

//receives a word and its list of kanji
const wordsSharingKanji = (word, kanjiList) =>{
  let same
  let sameKanjiWords = []
  kanjiList.forEach((kanji, index)=>{
    sameKanjiWords[index] = userInput.allWords.filter(e=>{
      if(e.word !== word){
        same = false
        e.kanjiList.forEach(intKanji=>{
          if(kanji === intKanji) same = true
        })
        if(same) return e
      }
    })
  })
  return sameKanjiWords
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

const searchKanjiInfo = () =>{
  let input = inputValue('searchKanji')
  showElement('secondaryRelatedKanji')
  innerHTMLCleaner('isKanjiStored')
  if(input !== '') {
    printRelatedWords(input, 'searchInfoContainer')
    alreadyExistingItem(input, userInput.allWords.map(e=>e.word)) ? printOnScreen('isKanjiStored', 'This word is on your list') : printOnScreen('isKanjiStored', 'This word in not on your list')
  }
}

const innerHTMLCleaner = (containerId) =>{
  let container = document.getElementById(containerId)
  container.innerHTML = ''
}

const printRelatedWords = (newWord, containerId) =>{
  innerHTMLCleaner(containerId)
  printOnScreen(containerId, `Word: ${newWord}`)
  let kanjiArray = getKanjiArray(newWord)
  let kanjiRelatedWords = wordsSharingKanji(newWord, kanjiArray)
  kanjiRelatedWords.forEach((words, index)=>{
    printOnScreen(containerId, `Words sharing 「${kanjiArray[index]}」 kanji:`)
    if(words.length !== 0){
      printList(containerId, words.map(e=>e.word), words.map(e=>e.reading))
    }else{
      printOnScreen(containerId, 'No words share this kanji')
    }
  })
}

//main nav functions
const addKanjiSection = () =>{
  showElement('addKanjiSection')
  hideElement('searchSection')
  hideElement('jlptSection')
  hideElement('allSection')
}

const searchSection = () =>{
  hideElement('addKanjiSection')
  showElement('searchSection')
  hideElement('jlptSection')
  hideElement('allSection')
}

const jlptSection = () =>{
  hideElement('addKanjiSection')
  hideElement('searchSection')
  showElement('jlptSection')
  hideElement('allSection')
  jlptStats()
}

const allSection = () =>{
  if(userInput.allWords.length === 0){
    hideElement('storedWordsTableHeader')
    showElement('noStoredWords')
  }else{
    showElement('storedWordsTableHeader')
    hideElement('noStoredWords')
  }
  hideElement('addKanjiSection')
  hideElement('searchSection')
  hideElement('jlptSection')
  showElement('allSection')
  storedWordsList()
}

const storedWordsList = () =>{
  const tbody = document.getElementById('storedWordsTable')
  innerHTMLCleaner('storedWordsTable')
  userInput.allWords.reverse().forEach(e=>{
    let row = document.createElement('tr')
    row.appendChild(tableTd(e.word))
    let reading = document.createElement('td')
    reading.innerText = e.reading
    row.appendChild(reading)
    row.appendChild(tableTd(e.anotation))
    tbody.appendChild(row)
  })
  userInput.allWords.reverse()
}

//I dont't know why this function returns undefined when receiving hiragana
const tableTd = (text) =>{
  let td = document.createElement('td')
  td.innerText = text
  return td
}

const showElement = (elementId) =>{
  let element = document.getElementById(elementId)
  element.classList.replace('hide', 'show')
}

const hideElement = (elementId) =>{
  let element = document.getElementById(elementId)
  element.classList.replace('show', 'hide')
}

//JLPT functions
const jlptStats = () =>{
  innerHTMLCleaner('totalKanji')
  printOnScreen('totalKanji', `Total kanji: ${userInput.allKanji.length}`)
  const fourArray = [1, 2, 3, 4]
  fourArray.forEach(e=>{
    innerHTMLCleaner(`jlpt${e}StoredKanji`)
    printJLPTList(`jlpt${e}StoredKanji`, e)
  })
}

const printJLPTList = (containerId, JLPTlevel) =>{
  let jlptList = userInput.allKanji.filter(kanji => kanji.jlpt === JLPTlevel)
  printList(containerId, jlptList.map(e=>e.kanji), jlptList.map(e=>e.meaning))
  printOnScreen(containerId, `Total: ${jlptList.length}`)
}













 