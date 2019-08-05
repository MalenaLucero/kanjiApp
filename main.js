const url = 'https://kanjiapi.dev/v1/kanji/蛍'
var kanji

const confirm = () =>{
    let input = document.getElementById('input')
    kanji = input.value

    for (const c of kanji) {
      console.log(c)
    }//iteration of a string



    let uri = 'https://kanjiapi.dev/v1/kanji/'+kanji[0]
    console.log(uri);

    fetch(uri)
        .then(res=>res.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error))
}







