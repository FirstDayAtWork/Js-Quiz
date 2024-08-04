export function findMdinTxt(str, regex, name){
    console.log(regex)
    let match = []
    if(!!str.textContent.match(regex)){
        const helperegex = /\?|\[|\]|\||\\n|\$|\(|\)|\.|\+|\*|\{|\}|\\/g
        match = [...new Set(str.textContent.match(regex))]
        match.map(el => {
            let r_part = el
            let before = ''
            let after = ''
            if(!!helperegex.test(r_part)){
                r_part = r_part.replace(helperegex, x => '\\' + x)
            }
            if(name === 'emphasis'){
                if(/_.+?_/g.test(r_part)){
                    el = el.replace(/_/g, '')
                    console.log('__', el)
                    before = `<i class=${name}>`
                    after = `</i>`
                }
                if(/\*\*[\s\S]+?\*\*/g.test(el)){
                    el = el.replace(/\*/g, '')
                    console.log('**', el)
                    before = `<strong class=${name}>`
                    after = `</strong>`
                }
                if(/~~.+?~~/g.test(r_part)){
                    el = el.replace(/~~_/g, '')
                    console.log('~~', el)
                    before = `<s class=${name}>`
                    after = `</s>`
                }
            }
            if(name === 'codeblock'){
                if(/(?<=`{3})javascript|js/g.test(el)){
                    el = el.replace(/`{3}(?:js|javascript)|`{3}/g, '')
                    console.log('it worsk???', el)
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
                console.log('link', el)
                before = `<a href=`
                after = `>${txt}</a>`
            }

            if(name === 'elemWithSrc'){
                el = el.replace(/\[.+?\]|[()]/g, '')
                if(/[<>]/g.test(r_part)){
                    r_part = r_part.replace(/[<>]/g, x => x === '<' ? '&lt;' : '&gt;')
                }
                let href = el.match(/https:\/\/[\w\/\#&?=\-\.]+/g).join``
                console.log('link', href)
                before = `<a href=${href} target="_blank" 'referrerpolicy="no-referrer" rel="noopener noreferrer nofollow">`
                after = `</a>`
                el = el.replace('>', 'referrerpolicy="no-referrer">')
            }
            let r = new RegExp(r_part, 'g')
            console.log('tada', r, r_part, el)
            str.innerHTML = str.innerHTML.trim().replace(r, `${before}${el}${after}`)
        })
    }
}