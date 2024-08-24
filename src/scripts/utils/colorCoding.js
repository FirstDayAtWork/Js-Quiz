

export function checkString(str, regexp, name, node){
    let match = []
    if(!str.innerHTML){
        str = str.replace(/^javascript|^js|^html\n/i, '')
        if(!!str.match(regexp)){
            const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
            match = [...new Set(str.match(regexp))]
            match.map(el => {
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
                    if(/(?<!:)\/\/.+/g.test(r_part)){
                        return
                    }
                    s = '(?<!\\w)'
                    e = '(?!\\w)'
                }
                if(name === 'variable'){
                    s = "(?<=\\s*?|!|\\+)"
                    e = "(?=\\s+?|\\+|;|,)"
                }
                if(name === 'url'){
                    let r = new RegExp(r_part+e, 'g')
                    str = str.trim().replace(r, `<code class=${name}><a href="${el}">${el}</a></code>`)
                    return
                }
                let r = new RegExp(s+r_part+e, 'g')
                str = str.trim().replace(r, `<code class=${name}>${el}</code>`) 
            })
        }
        return str
    }
    str.innerHTML = str.innerHTML.replace(/^(?:javascript|js|html)\n/i, '')
    if(!!str.textContent.match(regexp)){
        const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
        match = [...new Set(str.textContent.match(regexp))]
        match.map(el => {
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
                if(/(?<!:)\/\/.+/g.test(r_part)){
                    return
                }
                s = '(?<!\\w)'
                e = '(?!\\w)'
            }
            if(name === 'variable'){
                s = "(?<=\\s*?|!|\\+)"
                e = "(?=\\s+?|\\+|;|,)"
            }
            if(name === 'url'){
                let r = new RegExp(r_part+e, 'g')
                str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}><a href="${el}">${el}</a></code>`)
                return
            }
            let r = new RegExp(s+r_part+e, 'g')
            str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}>${el}</code>`) 
        })
    }
}


export function checkHtml(str, regexp, name){
    let match = []
    str.innerHTML = str.innerHTML.replace(/^html\n/i, '')

    if(!!str.textContent.match(regexp)){
        const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
        match = [...new Set(str.textContent.match(regexp))]
        match.map(el => {
            let r_part = el
            let s = ''
            let e = ''
            if(!!helperegex.test(el)){
                r_part = el.replace(helperegex, x => '\\' + x)
            }
            if(name === 'tag'){
                e = "(?!\'|\"|\\w)"
            }
            let r = new RegExp(s+r_part+e, 'g')
            str.innerHTML = str.innerHTML.trim().replace(r, `<code class=${name}>${el}</code>`) 
        })
    }
}