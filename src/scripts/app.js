import { checkString, checkHtml } from "./utils/colorCoding.js"
import { setBeforeAndCopyForCodeBlock } from "./utils/beforeAndCopy.js"
import { copySomeCode } from "./utils/copyCode.js"
import { copyIcon } from "./utils/svg.js"
import { regexForJs, regexForHtml } from "./utils/colorRegex.js"
import { mdRegexMap } from "./utils/mdToJsRegex.js"
import { findMdinTxt } from "./utils/findMdinTxt.js"
import { getLocalStorageData } from "./utils/localStorage.js"

const main = document.querySelector('.main')
const nextBtn = document.getElementById('next-q-btn')
const questionCounter = document.querySelector('.question-counter')

async function getLocalQuizData(preference){
    let arr = []
    const part = preference.language === 'ru' ? [8,9] : [9, 10]
    const src = `quiz-${preference.language}.md`
    const response = await fetch(`./src/scripts/utils/${src}`, {
    })
    const data = await response.text()
    arr = data.split`---`
    .map(el => el.replace('\r\n\r\n', '')
                 .replace(`<details><summary><b>${preference.language === 'ru' ? 'Ответ' : 'Answer'}</b></summary>`, '')
                 .replace(/<p>|<\/p>|<\/details>/g, '')
                 .split('######').join`` )
    for(let i = 1; i < arr.length; i++){
        if(arr[i].length > 1){
            arr[i] = arr[i].split('####')
            if(!/```/.test(arr[i][0])){
                arr[i][0] = arr[i][0].split('\r\n\r\n')
                arr[i][0][2] = arr[i][0][1]
                arr[i][0][1] = ''
                arr[i][0].length = 3
            } else {
                arr[i][0] = arr[i][0].split(/```/g)
            }
            arr[i][2] = arr[i][1].slice(part[0], part[1])
        } 
        if(!!/```/.test(arr[i][1])){
            arr[i][1] = arr[i][1].split(/```/g)
        }
        arr[i] = {
            question: arr[i][0][0],
            jsCode: arr[i][0][1],
            variants: arr[i][0][2],
            answer: arr[i][1],
            rightAnswer: arr[i][2]
        }
    }
    arr.shift()
    return arr
}


async function startQuiz(preference){
    let arr = await getLocalQuizData(preference)
    document.querySelector('.loader-wrapper').remove()
    let lessonArr = []
    let numOfQuestions = preference.number === 'all'
     ? arr.length : preference.number;
    let language = preference.language;
    let count = 0
    let userScoreArr = []
    let res = 0

    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    lessonArr = arr.slice(0, numOfQuestions)
    generateQuizQuestion(lessonArr, count, userScoreArr, language)
    questionCounter.innerText = `${count+1} / ${numOfQuestions}`
    nextBtn.addEventListener('click', () => {
        if(nextBtn.ariaDisabled === 'true'){
            return 
        }
        const inputs = document.querySelectorAll('.answer-style')
        for(const elem of inputs){

            if(elem.checked){
                main.innerHTML = `
                <div class="quiz-wrapper">
                    <div class="question"></div>
                    <div class="question-js-code js-code-wrapper-style" tabindex="0"></div>
                    <div class="answer-variants"></div>
                    <details class="answer answer-off">
                        <summary class="summary">
                            <b>${language === 'ru' ? 'Ответ' : 'Answer'}</b>
                        </summary>
                        <p class="answer-txt"></p>
                    </details>
                </div>
                `
                nextBtn.ariaDisabled = 'true'
                if(count >= numOfQuestions-1){
                    res = userScoreArr.reduce((a, b) => a + b, 0)
                    main.innerHTML = `
                    <div class="result-wrapper">
                        <div class="result">Result: 
                            <div class="result-score">${res}/${numOfQuestions} (${(res * 100) / numOfQuestions}%)</div>
                        </div>
                        <button class="btn-style" id="restart-btn" type="button">Restart</button>
                    </div>
                    `
                    const restartBtn = document.getElementById('restart-btn')
                    restartBtn.addEventListener('click', () => {
                        window.location.assign('index.html')
                    })
                    questionCounter.innerText = `? / ?`
                    return
                }
                count++
                questionCounter.innerText = `${count+1} / ${numOfQuestions}`
                main.classList.add('animate-quiz-on')
                generateQuizQuestion(lessonArr, count, userScoreArr, language)
                return
            }
        }
    })
}




function generateQuizQuestion(arr, num, userScoreArr, language){
    let counter = 0
    const quizWrapper = document.querySelector('.quiz-wrapper')
    const question = document.querySelector('.question')
    const questionJsCode = document.querySelector('.question-js-code')
    const answerVariants = document.querySelector('.answer-variants')
    const details = document.querySelector('.answer')
    const summary = document.querySelector('.summary')
    const p = document.querySelector('.answer-txt')
    question.innerText = arr[num].question
    const jsCode = document.createElement('pre')
    jsCode.classList.add('js-code')
    jsCode.classList.add('js-code-style')
    jsCode.textContent = arr[num].jsCode
    summary.innerHTML = `<b>${language === 'ru' ? 'Ответ' : "Answer"}</b>` 

    if(arr[num].jsCode){
        questionJsCode.append(jsCode)
        setBeforeAndCopyForCodeBlock(arr[num].jsCode, questionJsCode, copyIcon, counter)
        copySomeCode(arr[num].jsCode.trim(), counter)
        counter=counter+1
    }

    const alphabet = 'abcdefgh'.toUpperCase()
    let answerArr = arr[num].variants.split(/- \w:/).map(el => el.trim())
    answerArr.shift()
    for(let i = 0; i < answerArr.length; i++){
        const answerInputWrapper = document.createElement('div')
        answerInputWrapper.classList.add('answer-input-wrapper')
        const input = document.createElement('input')
        const label = document.createElement('label')
        answerInputWrapper.append(input)
        answerInputWrapper.tabIndex = '0'
        answerInputWrapper.ariaDisabled = 'false'
        input.classList.add('answer-style')
        input.id = `answer-${i}`
        input.type = 'radio'
        input.name = 'answer'
        input.value = i;
        input.setAttribute('data-abc', alphabet[i])
        label.htmlFor = input.id
        label.innerHTML = `${answerArr[i].replace(/[<>]/g, x => x === '<' ? '&lt;' : '&gt;')}`
        findMdinTxt(label, mdRegexMap().get('code'), 'code')
        answerInputWrapper.append(label)
        answerVariants.append(answerInputWrapper)
    }

    let nodes = [question, jsCode, answerVariants]
    for(let elem of nodes){
        delBr(elem)
    }
    
    if(questionJsCode.childElementCount > 0){
        const jsCodeMatch = jsCode.textContent.match(/^(?:javascript|js|html)\n/i)
        if(/javascript|js/i.test(jsCodeMatch[0])){
            for(let [key, value] of regexForJs()){
                checkString(jsCode, value, key)
            }
        }
        if(/html/i.test(jsCodeMatch[0])){
            for(let [key, value] of regexForHtml()){
                checkHtml(jsCode, value, key)
            }
        }
    }

    if(Array.isArray(arr[num].answer)){
        arr[num].answer = arr[num].answer.map(el => {
            const regMatch = el.match(/^javascript|^js|^html\n/i)
            if(/javascript|js/i.test(regMatch)){
                for(let [key, value] of regexForJs()){
                   el = checkString(el, value, key)
                }
                return (`
                    <div class="answer-code-wrapper js-code-wrapper-style">
                        <pre class="answer-code js-code-style">${el.trim()}</pre>
                    </div>
                    `
                )
            }
            if(/html/i.test(regMatch)){
                for(let [key, value] of regexForHtml()){
                    el = checkHtml(el, value, key)
                }
                return (`
                    <div class="answer-code-wrapper js-code-wrapper-style">
                        <pre class="answer-code js-code-style">${el}</pre>
                    </div>
                    `
                )
            }
            if(mdRegexMap().get('elemWithSrc').test(el)){
                el = findMdinTxt(el, mdRegexMap().get('elemWithSrc'), 'elemWithSrc')
                return el
            }
            return `<p>${el}</p>`
        })
        arr[num].answer.map(e =>{
             p.insertAdjacentHTML("beforeend", e)
        })
        const answerCodeWrapper = document.querySelectorAll('.answer-code-wrapper')
        const answerCode = document.querySelectorAll('.answer-code')
        for(let k = 0; k < answerCode.length; k++){
            setBeforeAndCopyForCodeBlock(answerCode[k].innerHTML, answerCodeWrapper[k], copyIcon, counter)
            copySomeCode(answerCode[k].textContent, counter)
            counter=counter+1
        }
    } else {
        p.innerText = arr[num].answer
        delBr(p)
    }
    for(let [key, value] of mdRegexMap()){
        findMdinTxt(p, value, key)
    }

    if(Array.isArray(arr[num].answer)){
        const answerCode = document.querySelectorAll('.answer-code')
        counter = 1
        answerCode.forEach(elem => {
            copySomeCode(elem.textContent, counter)
            counter=counter+1
        })

    }
    main.append(quizWrapper)

    const rightAnswer = arr[num].rightAnswer
    const inputs = document.querySelectorAll('.answer-style')
    inputs.forEach(el => el.addEventListener('change', (e) => {
        if(el.parentElement.ariaDisabled === 'true'){
            return
        }
        for (const elem of inputs) {
            if(elem === e.target){
                continue
            }
            elem.parentElement.ariaDisabled = 'true'
            elem.disabled = 'true'
        }
        nextBtn.ariaDisabled = 'false'
        userScoreArr.push(+(e.target.dataset.abc === rightAnswer))
        details.classList.toggle('answer-off')
        main.classList.remove('animate-quiz-on')
            if(e.target.dataset.abc !== rightAnswer){
                e.target.parentElement.classList.add('wrong-answer')
                e.target.nextSibling.classList.add('wrong-answer')
                return
            }
            e.target.parentElement.classList.add('right-answer')
            e.target.nextSibling.classList.add('right-answer')
            return
        })
    )

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

;(() => {
    const preference = getLocalStorageData('preference')
    if(!preference){ return window.location.replace(`/`) }
    startQuiz(preference)
})();