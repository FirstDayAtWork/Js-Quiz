export const regexMap = () => {
    const r = new Map()
    .set('comment', /(?<!:)\/\/.+/g)
    .set('variable', /(?<![a-z])(class|function|var|let|const|for|while|do|if|else|constructor|true|false|null|undefined|new)\b(?!\S*?')/g)
    .set('function', /(?<=.*?)[a-zA-Z]+\d*(?=\s*?=*?\s*?\w*?\(.*?\))/g)
    .set('keyword', /return|delete|break|yield|typeof|continue|this|throw|async|await|export|import|default|static/g)
    .set('url', /\b(?:https?:\/\/)(?:www\d?)?[\w\/\#&?=\-\.]+\b/gm)
    .set('string', /`.+\s?.+`|``|'.*?'|".*?"/g)
    .set('templateLit', /(?<=`*?\s?.+)\${(?:.*?)}\s*?(?=.*?\s?.*?`)/g)
    return r
}

// /['|"|`].+?(?='|"|`)['|"|`]/g
// (?!.*?')
// /(?<=.*?)\w+(?=\s*=*\s*\w*\()/g

