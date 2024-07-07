const main = document.querySelector('.main')


async function getLocalQuizData(){
    let arr = []
    const response = await fetch('/src/scripts/utils/quiz.md', {
    })
    const data = await response.text()
    arr = data.split`---`
    .map(el => el.replace('\r\n\r\n', '').replace('<details><summary><b>Ответ</b></summary>').split('######').join`` )
    .map(el => el.split(/```/g))
    for(let i = 1; i < arr.length; i++){
        if(arr[i].length > 1){
            arr[i][2] = arr[i][2].split('####')
        } 

    }
    console.log(arr)
    generateQuizQuestion(arr)
}

getLocalQuizData()



function generateQuizQuestion(arr){
    const div = document.createElement('div')
    div.classList.add('quiz-wrapper')
    div.innerHTML = `
    <div class="question"><p>${arr[1][0]}</p></div>
    <div class="question-js-code"><p>${arr[1][1]}</p></div>
    <div class="answer-variants"><p>${arr[1][2][0]}</p></div>
    <details class="answer">
        <summary><b>Ответ</b></summary>
        <p>${arr[1][2][1]}</p>
    </details>
    `
    main.append(div)
}

