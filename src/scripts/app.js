import { checkString } from "./utils/colorCoding.js"
import { copySomeCode } from "./utils/copyCode.js"
import { copyIcon } from "./utils/svg.js"
import { regexMap } from "./utils/colorRegex.js"

const main = document.querySelector('.main')
const nextBtn = document.getElementById('next-q-btn')
const questionCounter = document.querySelector('.question-counter')

async function getLocalQuizData(){
    let arr = []
    const response = await fetch('./src/scripts/utils/quiz.md', {
    })
    const data = await response.text()
    arr = data.split`---`
    .map(el => el.replace('\r\n\r\n', '')
                 .replace('<details><summary><b>Ответ</b></summary>', '')
                 .replace(/<p>|<\/p>|<\/details>|javascript|html/g, '')
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
            arr[i][2] = arr[i][1].slice(8, 9)
        } 
        
    }
    arr.shift()
    return arr
}


async function startQuiz(){
    let arr = await getLocalQuizData()
    let lessonArr = []
    let numOfQuestions = 15
    let count = 0
    let userScoreArr = []
    let res = 0
    // Swap elements in Array v2
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    lessonArr = arr.slice(0, numOfQuestions)
    generateQuizQuestion(lessonArr, count, userScoreArr)
    nextBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.answer-style')
        for(const elem of inputs){
            // do something when input is checked
            if(elem.checked){
                main.innerHTML = ''
                if(count >= numOfQuestions-1){
                    res = userScoreArr.reduce((a, b) => a + b, 0)
                    main.innerHTML = `
                    <div class="result-wrapper">
                        <div class="result">Result: 
                            <div class="result-score">${res} / ${numOfQuestions}</div>
                        </div>
                        <button class="btn-style" id="restart-btn" type="button">Restart</button>
                    </div>
                    `
                    const restartBtn = document.getElementById('restart-btn')
                    restartBtn.addEventListener('click', () => {
                        location.reload()
                    })
                    questionCounter.innerText = `? / ?`
                    console.log("it\s over!", res)
                    return
                }
                count++
                questionCounter.innerText = `${count+1} / ${numOfQuestions}`
                generateQuizQuestion(lessonArr, count, userScoreArr)
                return
            }
        }
    })
}

startQuiz()

function generateQuizQuestion(arr, num, userScoreArr){
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
    jsCode.textContent = arr[num][0][1]
    // console.log(jsCode.textContent)

    if(arr[num][0][1]){
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
        
        const copyBtn = document.createElement('button')
        const copyBtnWrapper = document.createElement('div')
        copyBtnWrapper.classList.add('copy-btn-wrapper')
        copyBtn.type = 'button'
        copyBtn.classList.add('copy-btn')
        copyBtn.innerHTML = copyIcon;
        copyBtnWrapper.append(copyBtn)
        questionJsCode.prepend(copyBtnWrapper)
    }

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
        answerInputWrapper.ariaDisabled = 'false'
        input.classList.add('answer-style')
        input.id = `answer-${i}`
        input.type = 'radio'
        input.name = 'answer'
        input.value = i;
        input.setAttribute('data-abc', alphabet[i])
        label.htmlFor = input.id
        label.innerHTML = `<code>${answerArr[i]}</code>`
        answerInputWrapper.append(label)
        answerVariants.append(answerInputWrapper)
    }


    const details = document.createElement('details')
    details.classList.add('answer')
    details.classList.add('answer-off')

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
    if(questionJsCode.childElementCount > 0){
        for(let [key, value] of regexMap()){
            checkString(jsCode, value, key)
        }
    }
    main.append(div)
    copySomeCode(arr[num][0][1].trim())

    // add click to inputs

    const rightAnswer = arr[num][2]
    const inputs = document.querySelectorAll('.answer-style')
    inputs.forEach(el => el.addEventListener('change', (e) => {
        if(el.parentElement.ariaDisabled === 'true'){
            console.log(el, el.ariaDisabled)
            return
        }
        for (const elem of inputs) {
            if(elem === e.target){
                continue
            }
            elem.parentElement.ariaDisabled = 'true'
            elem.disabled = 'true'
        }
        userScoreArr.push(+(e.target.dataset.abc === rightAnswer))
        details.classList.toggle('answer-off')
            if(e.target.dataset.abc !== rightAnswer){
                e.target.parentElement.classList.add('wrong-answer')
                return
            }
            e.target.parentElement.classList.add('right-answer')
            return
        })
    )

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