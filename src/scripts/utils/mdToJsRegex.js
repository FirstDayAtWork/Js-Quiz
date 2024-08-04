export function mdRegexMap(){
    const r = new Map()
    .set('emphasis', /(?<!\S+?)(?:_|\*{2}|~{2})[\s\S]+?(?:_|\*{2}|~{2})/g)
    .set('links', /\[[\s\S]+?\]\(https:\/\/[\S\/\#&?=\-\._]+?\)/g)
    .set('elemWithSrc', /<(?:img|audio|video)[\s\S]+?src.+?[\s\S]+?>/g)
    .set('codeblock', /`{3}(?:javascript|js|html|css)[\s\S]+?`{3}/g)
    .set('code', /(?<!`|>)`(?!`).+?`(?!`|<)/g)
    return r
}