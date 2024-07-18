export const regexMap = () => {
    let r = new Map()
    .set('variable', /(?<![a-z])(function|var|let|const|for|while|do|if|else|constructor)\b/g)
    .set('function', /\w+(?=\()/gi)
    .set('keyword', /return|break|yield|typeof|continue|this|throw|async|await/g)
    .set('string', /['|"|`].+?(?='|"|`)['|"|`]/g)
    return r
}