import { getLocalStorageData, setLocalStorageData } from "./utils/localStorage.js";

(() => {
    const question = document.getElementById('questions')
    const language = document.getElementById('language')
    const startBtn = document.getElementById('start-quiz-btn')

    if(getLocalStorageData('preference')){
       const data = getLocalStorageData('preference')
       loopOptions(data.number, [...question.options])
       loopOptions(data.language, [...language.options])
    }

    let obj = {
        number: question.options[question.options.selectedIndex].value, language: language.options[language.options.selectedIndex].value
    }
    
    question.addEventListener('change', (e) => {
        obj.number = e.target.value
    })

    language.addEventListener('change', (e) => {
        obj.language = e.target.value
    })

    startBtn.addEventListener('click', () => {
        setLocalStorageData('preference', obj)
        window.location.href = `${window.location.origin}/quiz.html`
    })
})();

function loopOptions(value, options){
    for(let i = 0; i < options.length; i++){
        if(value === options[i].value){
            options[options.indexOf(options[i])].selected = 'true'
        }
    }
}