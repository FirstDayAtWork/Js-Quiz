export function copySomeCode(element){
    // Copy Pass Into Clipboard
    const copyBtn = document.querySelector('.copy-btn')
    copyBtn.addEventListener('click', addToClipBoard);
    
    // copy clip on keyboard clicks
    copyBtn.addEventListener('keydown', (e) => {
      if(e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space'){
        e.preventDefault()
        addToClipBoard()
      }
    })
    
    async function addToClipBoard(e){
        try {
          await  navigator.clipboard.writeText(element);
          console.log(("Copied -> " + element));
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
    }
}