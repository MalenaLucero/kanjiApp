const url = 'https://kanjiapi.dev/v1/kanji/蛍'
let kanji
let kanjiArray = []

const confirm = () =>{
    let input = document.getElementById('input')
    kanji = input.value

    for (const c of kanji) {
      console.log(c, c.charCodeAt())//unicode in dec
      let code = c.charCodeAt()
      console.log(code.toString(16))//unicode in hex
      if(c.charCodeAt() >= 19968){
        kanjiArray.push(c)
      }
    }//iteration of a string. 

    console.log(kanjiArray)




    let uri = 'https://kanjiapi.dev/v1/kanji/'+kanji[0]
    console.log(uri);

    fetch(uri)
        .then(res=>res.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error))
}







