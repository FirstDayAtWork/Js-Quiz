

export function checkString(str, regexp, name){
    let match = []
    if(!!str.innerText.match(regexp)){
        match = str.innerText.match(regexp)
        if(match.some(el => el === "')\"")){
            console.log('it is!')
            return
        }
        match.map(el => {
            let r = new RegExp(el, 'gi')
            str.innerHTML = str.innerHTML.replace(r, `<code class=${name}>${el}</code>`) 
        })
    }
}