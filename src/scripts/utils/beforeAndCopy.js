export function setBeforeAndCopyForCodeBlock(code, wrapper, icon, counter){
            // count rows in js code
            let rowCountArr = code.match(/\n/g)
            const beforeWrapper = document.createElement('div')
            for(let j = 0; j < rowCountArr.length-1; j++){
                const before = document.createElement('pre')
                before.classList.add('before')
                beforeWrapper.classList.add('before-wrapper')
                beforeWrapper.append(before)
                before.innerText = j+1
            }
            const popoverContent = document.createElement('div')
            popoverContent.classList.add('popover-style')
            popoverContent.id = `mypopover-${counter}`
            popoverContent.setAttribute("popover", '');
            popoverContent.textContent = 'Copied!'
            const copyBtn = document.createElement('button')
            const copyBtnWrapper = document.createElement('div')
            copyBtnWrapper.classList.add('copy-btn-wrapper')
            copyBtn.setAttribute("popoverTarget", `mypopover-${counter}`);
            copyBtn.type = 'button'
            copyBtn.id = `copyBtn-${counter}`
            copyBtn.classList.add('copy-btn')
            copyBtn.innerHTML = icon;
            copyBtnWrapper.append(copyBtn)
            copyBtn.after(popoverContent)
            wrapper.prepend(beforeWrapper)
            wrapper.prepend(copyBtnWrapper)
            const copyBtnid = document.getElementById(`copyBtn-${counter}`)
            copyBtnid.style.anchorName = `--anchor-el-${counter}`
            const popoverId = document.getElementById(`mypopover-${counter}`)
            popoverId.style.positionAnchor = `--anchor-el-${counter}`
            popoverId.style.insetArea = `left`
}