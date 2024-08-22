export function findMdinTxt(str, regex, name){
    let match = []
    if(!str.textContent){
        const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
        match = [...new Set(str.match(regex))]
        match.map(el => {
            let r_part = el
            let before = ''
            let after = ''
            if(!!helperegex.test(r_part)){
                r_part = r_part.replace(helperegex, x => '\\' + x)
            }
            if(name === 'elemWithSrc'){
                console.log('src', el)
                el = el.replace(/\[.+?\]|[()]/g, '')
                let href = el.match(/https:\/\/[\w\/\#&?=\-\.]+/g).join``
                before = `<br><a href=${href} target="_blank" 'referrerpolicy="no-referrer" rel="noopener noreferrer nofollow">`
                after = `</a><br>`
                el = el.replace('>', ' referrerpolicy="no-referrer">')
                // console.log('wtf', href)
            }
            let r = new RegExp(r_part, 'g')
            console.log('tada', str)
            str = str.trim().replace(r, `${before}${el}${after}`)
        })
        console.log('res', str)
        return str
    }
    if(!!str.textContent.match(regex)){
        const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
        match = [...new Set(str.textContent.match(regex))]
        match.map(el => {
            console.log(el)
            let r_part = el
            let before = ''
            let after = ''
            if(!!helperegex.test(r_part)){
                r_part = r_part.replace(helperegex, x => '\\' + x)
            }
            if(name === 'emphasis'){
                if(/_.+?_/g.test(r_part)){
                    el = el.replace(/_/g, '')
                    before = `<i class=${name}>`
                    after = `</i>`
                }
                if(/\*\*[\s\S]+?\*\*/g.test(el)){
                    el = el.replace(/\*/g, '')
                    before = `<strong class=${name}>`
                    after = `</strong>`
                }
                if(/~~.+?~~/g.test(r_part)){
                    el = el.replace(/~~_/g, '')
                    before = `<s class=${name}>`
                    after = `</s>`
                }
            }
            if(name === 'codeblock'){
                if(/(?<=`{3})javascript|js/g.test(el)){
                    el = el.replace(/`{3}(?:js|javascript)|`{3}/g, '')
                    // console.log('it worsk???', el)
                    r_part = r_part.replace(/js|javascript/g, x=> x === 'js' ? 'js\\n' : 'javascript\\n')
                    before = `
                    <pre><code class=${name}>`
                    after = `</code></pre>`
                }
            }
            if(name === 'code'){
                if(/&/g.test(r_part)){
                    r_part = r_part.replace(/&/g, '&amp;')
                }
                if(/[<>]/g.test(r_part)){
                    r_part = r_part.replace(/[<>]/g, x => x === '<' ? '&lt;' : '&gt;')
                    el = el.replace(/[<>]/g, x => x === '<' ? '&lt;' : '&gt;')
                }
                el = el.replace(/`/g, '')
                before = `<code class=${name}>`
                after = `</code>`
            }
            
            if(name === 'links'){
                let txt = el.match(/(?<=\[).+?(?=\])/).join``
                el = el.replace(/\[.+?\]|[()]/g, '')
                // console.log('link', el)
                before = `<a href=`
                after = `>${txt}</a>`
            }

            if(name === 'elemWithSrc'){
                console.log('src', el)
                el = el.replace(/\[.+?\]|[()]/g, '')
                if(/[<>]/g.test(r_part)){
                    r_part = r_part.replace(/[<>]/g, x => x === '<' ? '&lt;' : '&gt;')
                }
                let href = el.match(/https:\/\/[\w\/\#&?=\-\.]+/g).join``
                before = `<a href=${href} target="_blank" 'referrerpolicy="no-referrer" rel="noopener noreferrer nofollow">`
                after = `</a>`
                el = el.replace('>', ' referrerpolicy="no-referrer">')
            }
            let r = new RegExp(r_part, 'g')
            // console.log('tada', r, r_part, el)
            str.innerHTML = str.innerHTML.trim().replace(r, `${before}${el}${after}`)
        })
    }
}