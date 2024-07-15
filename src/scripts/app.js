import { checkString } from "./utils/colorCoding.js"
import { copySomeCode } from "./utils/copyCode.js"

const main = document.querySelector('.main')


async function getLocalQuizData(){
    let arr = []
    const response = await fetch('/src/scripts/utils/quiz.md', {
    })
    const data = await response.text()
    arr = data.split`---`
    .map(el => el.replace('\r\n\r\n', '')
                 .replace('<details><summary><b>Ответ</b></summary>', '')
                 .replace(/<p>|<\/p>|<\/details>|javascript/g, '')
                 .split('######').join`` )
    for(let i = 1; i < arr.length; i++){
        if(arr[i].length > 1){
            arr[i] = arr[i].split('####')
            arr[i][0] = arr[i][0].split(/```/g)
        } 
        
    }
    generateQuizQuestion(arr, 64)
}

getLocalQuizData()



function generateQuizQuestion(arr, num){
    // Example
    // <div class="question"><p>${arr[num][0][0]}</p></div>
    // <div class="question-js-code"><p>${arr[num][0][1]}</p></div>
    // <div class="answer-variants"><p>${arr[num][0][2]}</p></div>
    // <details class="answer">
    //     <summary><b>Ответ</b></summary>
    //     <p>${arr[num][1]}</p>
    // </details>
    const div = document.createElement('div')
    div.classList.add('quiz-wrapper')

    const question = document.createElement('div')
    question.classList.add('question')
    question.innerText = arr[num][0][0]

    const questionJsCode = document.createElement('div')
    questionJsCode.classList.add('question-js-code')
    questionJsCode.tabIndex = 0
    const jsCode = document.createElement('pre')
    jsCode.classList.add('js-code')
    jsCode.innerText = arr[num][0][1]
    questionJsCode.append(jsCode)
    // count rows in js code
    let rowCountArr = arr[num][0][1].match(/\n/g)
    const beforeWrapper = document.createElement('div')
    for(let j = 0; j < rowCountArr.length-1; j++){
        const before = document.createElement('pre')
        before.classList.add('before')
        beforeWrapper.classList.add('before-wrapper')
        beforeWrapper.append(before)
        before.innerText = j+1
    }
    questionJsCode.prepend(beforeWrapper)

    const copyBtnWrapper = document.createElement('div')
    copyBtnWrapper.classList.add('copy-btn-wrapper')
    const copyBtn = document.createElement('button')
    copyBtn.type = 'button'
    copyBtn.classList.add('copy-btn')
    copyBtn.innerHTML = `<svg width="34px" height="34px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M589.3 260.9v30H371.4v-30H268.9v513h117.2v-304l109.7-99.1h202.1V260.9z" fill="#ffffff"></path><path d="M516.1 371.1l-122.9 99.8v346.8h370.4V371.1z" fill="#ffffff"></path><path d="M752.7 370.8h21.8v435.8h-21.8z" fill="#000000"></path><path d="M495.8 370.8h277.3v21.8H495.8z" fill="#000000"></path><path d="M495.8 370.8h21.8v124.3h-21.8z" fill="#000000"></path><path d="M397.7 488.7l-15.4-15.4 113.5-102.5 15.4 15.4z" fill="#000000"></path><path d="M382.3 473.3h135.3v21.8H382.3z" fill="#000000"></path><path d="M382.3 479.7h21.8v348.6h-21.8zM404.1 806.6h370.4v21.8H404.1z" fill="#000000"></path><path d="M447.7 545.1h261.5v21.8H447.7zM447.7 610.5h261.5v21.8H447.7zM447.7 675.8h261.5v21.8H447.7z" fill="#000000"></path><path d="M251.6 763h130.7v21.8H251.6z" fill="#000000"></path><path d="M251.6 240.1h21.8v544.7h-21.8zM687.3 240.1h21.8v130.7h-21.8zM273.4 240.1h108.9v21.8H273.4z" fill="#000000"></path><path d="M578.4 240.1h130.7v21.8H578.4zM360.5 196.5h21.8v108.9h-21.8zM382.3 283.7h196.1v21.8H382.3zM534.8 196.5h65.4v21.8h-65.4z" fill="#000000"></path><path d="M360.5 196.5h65.4v21.8h-65.4zM404.1 174.7h152.5v21.8H404.1zM578.4 196.5h21.8v108.9h-21.8z" fill="#000000"></path></g></svg>`;
    copyBtnWrapper.append(copyBtn)
    questionJsCode.prepend(copyBtnWrapper)

    const answerVariants = document.createElement('div')
    answerVariants.classList.add('answer-variants')
    const alphabet = 'abcdefgh'.toUpperCase()
    let answerArr = arr[num][0][2].split(/- \w:/).map(el => el.trim())
    answerArr.shift()
    for(let i = 0; i < answerArr.length; i++){
        const answerInputWrapper = document.createElement('div')
        answerInputWrapper.classList.add('answer-input-wrapper')
        const input = document.createElement('input')
        const label = document.createElement('label')
        answerInputWrapper.append(input)
        answerInputWrapper.tabIndex = '0'
        input.classList.add('answer-style')
        input.id = `answer-${i}`
        input.type = 'radio'
        input.name = 'answer'
        input.value = i;
        input.setAttribute('data-abc', alphabet[i])
        label.htmlFor = input.id
        label.innerText = answerArr[i]
        answerInputWrapper.append(label)
        answerVariants.append(answerInputWrapper)
    }


    const details = document.createElement('details')
    details.classList.add('answer')

    const summary = document.createElement('summary')
    const b = document.createElement('b')
    b.innerText = 'Ответ'

    const p = document.createElement('p')
    p.classList.add('answer-txt')
    p.innerText = arr[num][1]

    div.append(question)
    div.append(questionJsCode)
    div.append(answerVariants)
    div.append(details)
    details.append(summary)
    summary.append(b)
    details.append(p)

    let nodes = [question, jsCode, answerVariants, p]
    for(let elem of nodes){
        delBr(elem)
    }
    checkString(questionJsCode, /(function|var|let|const|for|while|do|if|else|constructor)\b/g, 'variable')
    checkString(questionJsCode, /\w+(?=\()/gi, 'function')
    checkString(questionJsCode, /return|break|yield|continue|this|throw|async|await/g, 'keyword')
    checkString(questionJsCode, /['|"|`].+?(?='|"|`)['|"|`]/g, 'string')

    main.append(div)
    copySomeCode(arr[num][0][1])
    // scroll to answer / back to question
    details.addEventListener("toggle", (event) => {
        if (details.open) {
            details.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            return
        }
            details.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
      });
}


function delBr(node){
    node.innerHTML = node.innerHTML.replace(/^(<br>){1,5}|(<br>){1,5}$/g, '')
}