const url = 'https://kanjiapi.dev/v1/kanji/蛍'
let kanji

fetch(url)
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(error=>console.log(error))

const confirm = () =>{
    let input = document.getElementById('input')
    kanji = input.value
}

