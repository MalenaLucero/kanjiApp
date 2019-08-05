const url = 'https://kanjiapi.dev/v1/kanji/蛍'
let kanji
let kanjiArray = [] //array with the word's kanji (minus hiragana and katakana)

const confirm = () =>{
    let input = document.getElementById('input')
    kanji = input.value
    console.log(getKanjiArray(kanji))
    

    kanjiArray.forEach(e=>{
      let uri = 'https://kanjiapi.dev/v1/kanji/'+e
      console.log(uri);

      fetch(uri)
          .then(res=>res.json())
          .then(data=>console.log(data))
          .catch(error=>console.log(error))
    })
}

//from a full kanji and kana word or phrase, it extracts only the kanji
const getKanjiArray = (word) =>{
  kanjiArray = []
  //iteration of a string
  for (const c of word) {
    console.log(c, c.charCodeAt())//unicode in dec
    console.log(c.charCodeAt().toString(16))//unicode in hex
    if(c.charCodeAt() >= 13312){
      kanjiArray.push(c)
    }
  }
  return kanjiArray
}







