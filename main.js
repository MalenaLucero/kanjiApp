const url = 'https://kanjiapi.dev/v1/kanji/蛍'
let kanji

const confirm = () =>{
    let input = document.getElementById('input')
    kanji = input.value

    let uri = 'https://kanjiapi.dev/v1/kanji/'+kanji
    console.log(uri);

    fetch(uri)
        .then(res=>res.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error))
}







