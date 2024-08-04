

export function checkString(str, regexp, name){
    let match = []
    if(!!str.textContent.match(regexp)){
        const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
        match = [...new Set(str.textContent.match(regexp))]
        match.map(el => {
            // console.log(el)
            let r_part = el
            let s = ''
            let e = ''
            if(name === 'comment'){
                if(el.includes('//') && el.includes('[')){
                    r_part = el.replace('[', '\\[')
                }
                
            }
            if(name === 'string' || 'templateLit'){
                if(!!helperegex.test(el)){
                    r_part = el.replace(helperegex, x => '\\' + x)
                }
                if(/&/g.test(r_part)){
                    r_part = r_part.replace(/&/g, '&amp;')
                }
                if(/>/g.test(r_part)){
                    r_part = r_part.replace(/>/g, '&gt;')
                }
            }
            if(name === 'function'){
                if(/(?<![a-z])(class|function|var|let|const|for|while|do|if|else|constructor|true|false|null|undefined|new)\b/g.test(r_part)){
                    return
                }
                console.log('funq', r_part)
                if(/(?<!:)\/\/.+/g.test(r_part)){
                    return
                }
                s = '(?<!\\w)'
                e = '(?!\\w)'
            }
            if(name === 'variable'){
                console.log('xx', r_part, el)
                s = "(?<=\\s*?|!|\\+)"
                e = "(?=\\s+?|\\+|;|,)"
            }
            if(name === 'url'){
                let r = new RegExp(r_part+e, 'g')
                console.log(r)
                str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}><a href="${el}">${el}</a></code>`)
                return
            }
            let r = new RegExp(s+r_part+e, 'g')
            console.log(r)
            str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}>${el}</code>`) 
            // console.log('r', r, str.innerHTML)
        })
    }
}