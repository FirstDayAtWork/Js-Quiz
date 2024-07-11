const main = document.querySelector('.main')


async function getLocalQuizData(){
    let arr = []
    const response = await fetch('/src/scripts/utils/quiz.md', {
    })
    const data = await response.text()
    arr = data.split`---`
    .map(el => el.replace('\r\n\r\n', '').replace('<details><summary><b>Ответ</b></summary>', '').replace(/<p>|<\/p>|<\/details>|javascript/g, '').split('######').join`` )
    for(let i = 1; i < arr.length; i++){
        if(arr[i].length > 1){
            arr[i] = arr[i].split('####')
            arr[i][0] = arr[i][0].split(/```/g)
        } 
        
    }
    // arr.map(el => el)
    console.log(arr)
    generateQuizQuestion(arr, 44)
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
    questionJsCode.innerText = arr[num][0][1]

    const answerVariants = document.createElement('div')
    answerVariants.classList.add('answer-variants')
    answerVariants.innerText = arr[num][0][2]

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

    let nodes = [question, questionJsCode, answerVariants, p]
    for(let elem of nodes){
        delBr(elem)
    }

    main.append(div)
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