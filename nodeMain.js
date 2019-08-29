const allSection = () =>{
    hideElement('addKanjiSection')
    hideElement('searchSection')
    hideElement('jlptSection')
    showElement('allSection')
    //storedWordsList()
}

const showElement = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.replace('hide', 'show')
}
  
const hideElement = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.replace('show', 'hide')
}