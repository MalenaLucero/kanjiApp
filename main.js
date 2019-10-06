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
      let newWord = new storedWord(allWords.length, word, inputValue('readingInput'), inputValue('anotationInput'), kanjiArray)
      userInput.allWords.push(newWord)
      setLocalStorage()
      showElement('mainRelatedKanji')
      printRelatedWords(word, 'relatedKanjiContainer')
      kanjiArray.forEach( e =>{
        if(!alreadyExistingItem(e, allKanji.map(e=>e.kanji))){
          fetch('https://kanjiapi.dev/v1/kanji/' + e)
            .then(res=>res.json())
            .then(res =>{
              let newKanji = new storedKanji(res.kanji, res.grade, res.stroke_count, res.meanings, res.kun_readings, res.on_readings, res.jlpt, res.unicode)
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

//from a full kanji and kana word or phrase, it returns only the kanji
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
function storedWord(id, word, reading, anotation, kanjiList){
  this.id = id
  this.word = word
  this.reading = reading
  this.anotation = anotation
  this.kanjiList = kanjiList 
}

//internal kanji constructor
function storedKanji(kanji, grade, stroke_count, meanings, kun_readings, on_readings, jlpt, unicode){
  this.kanji = kanji
  this.grade = grade
  this.stroke_count = stroke_count
  this.meanings = meanings
  this.kun_readings = kun_readings
  this.on_readings = on_readings
  this.jlpt = jlpt
  this.unicode = unicode
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
  const input = inputValue('searchKanji')
  showElement('secondaryRelatedKanji')
  innerHTMLCleaner('isKanjiStored')
  if(input !== '') {
    printRelatedWords(input, 'searchInfoContainer')
    if(alreadyExistingItem(input, userInput.allWords.map(e=>e.word))){
      printOnScreen('isKanjiStored', 'This word is on your list')
      hideElement('searchAddWord')
    }else{
      printOnScreen('isKanjiStored', 'This word in not on your list')
      showElement('searchAddWord')
    }
  }
}

const innerHTMLCleaner = (containerId) =>{
  let container = document.getElementById(containerId)
  container.innerHTML = ''
}

const printRelatedWords = (newWord, containerId) =>{
  innerHTMLCleaner(containerId)
  printOnScreen(containerId, `Word: ${newWord}`)
  getKanjiArray(newWord).forEach(kanji=>{
    printOnScreen(containerId, `Words sharing 「${kanji}」 kanji:`)
      let listOfWords = wordsWithThisKanji(kanji).filter(e=>e.word !== newWord)
      if(listOfWords.length !== 0){
        printList(containerId, listOfWords.map(e=>e.word), listOfWords.map(e=>e.reading))
      }else{
        printOnScreen(containerId, 'No words share this kanji')
      }
  })
}

const wordsWithThisKanji = (kanji) =>{
  let listOfWords = userInput.allWords.filter(word=>{
    let sameKanji = false
    word.kanjiList.forEach(internalKanji => {
      if(internalKanji === kanji) sameKanji = true
    })
    if(sameKanji) return word
  })
  return listOfWords
}

//main nav functions
const addKanjiSection = () =>{
  showElement('addKanjiSection')
  hideElement('searchSection')
  hideElement('statsSection')
  hideElement('allSection')
}

const searchSection = () =>{
  hideElement('addKanjiSection')
  showElement('searchSection')
  hideElement('statsSection')
  hideElement('allSection')
}

const jlptSection = () =>{
  hideElement('addKanjiSection')
  hideElement('searchSection')
  showElement('statsSection')
  hideElement('allSection')
  kanjiStats()
}

const allSection = () =>{
  userInput.allWords.length === 0 ? showElement('noStoredWords') : hideElement('noStoredWords')
  hideElement('addKanjiSection')
  hideElement('searchSection')
  hideElement('statsSection')
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

//jlpt and grade functions
const kanjiStats = () =>{
  innerHTMLCleaner('totalKanji')
  printOnScreen('totalKanji', `Total kanji: ${userInput.allKanji.length}`)
  stats('jlpt')
  stats('grade')
}

//GRADE functions
//option stands for "jlpt" or "grade"
const stats = (option) =>{
  let numbersArray = option === 'jlpt' ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7, 8]
  numbersArray.forEach(e=>{
    innerHTMLCleaner(`${option}${e}StoredKanji`)
    printKanjiList(`${option}${e}StoredKanji`, e, option)
  })
}

const printKanjiList = (containerId, level, option) =>{
  let kanjiList = option === 'jlpt' ? userInput.allKanji.filter(e => e.jlpt === level) : userInput.allKanji.filter(e => e.grade === level)
  printOnScreen(containerId, `Total: ${kanjiList.length}`)
  printSimpleList(containerId, kanjiList.map(e=>e.kanji))
}

printSimpleList = (containerId, array) =>{
  let container = document.getElementById(containerId)
  let ul = document.createElement('ul')
  array.forEach(e=>{
    let li = document.createElement('li')
    let anchor = document.createElement('a')
    anchor.innerText = e
    anchor.href = "#"
    anchor.onclick = () => {
      event.preventDefault()
      showElement('kanjiModal')
      fillModal(e)
    }
    li.appendChild(anchor)
    ul.appendChild(li)
  })
  container.appendChild(ul)
}

const fillModal = kanji =>{
  const title = document.getElementById('modalKanjiTitle')
  title.innerText = kanji
  let kanjiInfo = userInput.allKanji.find(e=>e.kanji === kanji)
  innerHTMLCleaner('modalKanjiInfo')
  createli('modalKanjiInfo', 'Kun readings', kanjiInfo.kun_readings)
  createli('modalKanjiInfo', 'On readings', kanjiInfo.on_readings)
  createli('modalKanjiInfo', 'Meanings', kanjiInfo.meanings)
  createli('modalKanjiInfo', 'Stroke count', kanjiInfo.stroke_count)
  //createli('modalKanjiInfo', 'Words with this kanji', wordsWithThisKanji(kanjiInfo.kanji).map(e=>e.word))
  let container = document.getElementById('modalKanjiInfo')
  let li = document.createElement('li')
  li.innerText = 'Words added with this kanji: '
  let innerUl = document.createElement('ul')
  wordsWithThisKanji(kanjiInfo.kanji).forEach(word=>{
    let innerLi = document.createElement('li')
    innerLi.innerText = word.word
    innerLi.onclick = () =>{
      fillWordModal(word)
    }
    innerUl.appendChild(innerLi)
  })
  li.appendChild(innerUl)
  container.appendChild(li)
}

const fillWordModal = (word) =>{
  showElement('wordModal')
  let title = document.getElementById('modalWordTitle')
  title.innerText = word.word
  innerHTMLCleaner('modalWordInfo')
  createli('modalWordInfo', 'Reading', word.reading)
  createli('modalWordInfo', 'Anotation', word.anotation)
}

const createli = (containerId, subtitle, content) =>{
  const container = document.getElementById(containerId)
  const li = document.createElement('li')
  const firstSpan = document.createElement('span')
  firstSpan.innerText = `${subtitle}: `
  const secondSpan = document.createElement('span')
  secondSpan.innerText = Array.isArray(content) ? fromArrayToString(content) : content
  li.appendChild(firstSpan)
  li.appendChild(secondSpan)
  container.appendChild(li)
}

const fromArrayToString = (array) =>{
  let string = ''
  array.forEach((e, index)=>{
    if(index === 0 && index !== array.length-1){
      string = `${e},`
    }else if(index === array.length-1){
      string = `${string} ${e}`
    }else{
      string = `${string} ${e}, `
    }
  })
  return string
}

const showDisclaimer = () =>{
  event.preventDefault()
  showElement('disclaimerModal')
}

const closeDisclaimerModal = () =>{
  event.preventDefault()
  hideElement('disclaimerModal')
}

const closeModal = () =>{
  event.preventDefault()
  hideElement('kanjiModal')
} 

const closeWordModal = () =>{
  event.preventDefault()
  hideElement('wordModal')
} 

const showSortByJlpt = () =>{
  event.preventDefault()
  hideElement('sortByGrade')
  showElement('sortByJlpt')
  replaceStyle('byJlptLevelAnchor', 'internalAnchorNotPressed', 'internalAnchorPressed')
  replaceStyle('byGradeAnchor', 'internalAnchorPressed', 'internalAnchorNotPressed')
}

const showSortByGrade = () =>{
  event.preventDefault()
  hideElement('sortByJlpt')
  showElement('sortByGrade')
  replaceStyle('byGradeAnchor', 'internalAnchorNotPressed', 'internalAnchorPressed')
  replaceStyle('byJlptLevelAnchor', 'internalAnchorPressed', 'internalAnchorNotPressed')
}

const replaceStyle = (elementId, oldStyle, newStyle) =>{
  const element = document.getElementById(elementId)
  element.classList.replace(oldStyle, newStyle)
}