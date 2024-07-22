

export function checkString(str, regexp, name, htmlTxt){
    let match = []
    // if(!!/\b["`']\b/g.test(str.textContent)){
    //     str.textContent = str.textContent.replace(/\b["`']\b/g, x => `"`)
    // }
    if(!!str.textContent.match(regexp)){
        match = [...new Set(str.textContent.match(regexp))]
        // if(match.some(el => el === "')\"" || el === '"");("' || el === "|| {} || null)const two = (null || false || '")){
        //     console.log('it is!')
        //     return
        // }
        match.map(el => {
            console.log(el)
            let r_part = el
            let e = ''
            if(name === 'comment'){
                console.log('we heere', el)
                if(el.includes('//') && el.includes('[')){
                    r_part = el.replace('[', '\\[')
                }
                
            }
            if(name === 'string'){
                console.log('str')
                if(!!/\?|\[|\\n|\$/g.test(el)){
                    r_part = el.replace(/\?|\[|\\n|\$/g, x => '\\' + x)
                }
            }
            if(name === 'function'){
                e = '(?!\\w)'
            }
            if(name === 'url'){
                let r = new RegExp(r_part+e, 'gi')
                console.log(r)
                str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}><a href="${el}">${el}</a></code>`)
                return
            }
            // let s = '(?<![a-z])'
            // let e = '(?![a-z])'
            // s = '(?<!\\/\\/\\s+)'
            // if(el.includes('$')){
            //     r_part = el.replace('$', '\\$')
            // }

            // if(el.includes('//')){
            //     console.log('we here')
            //     r_part = '\\/\\/\\s+\\S+'
            //     s = ''
            //     e = ''
            //     console.log(s + r_part + e)
            // }
            let r = new RegExp(r_part+e, 'gi')
            console.log(r)
            str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}>${el}</code>`) 
        })
    }
}