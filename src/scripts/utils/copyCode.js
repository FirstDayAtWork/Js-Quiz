export function copySomeCode(element, counter){
    const button = document?.getElementById(`copyBtn-${counter}`)
    // Copy Pass Into Clipboard
    button.addEventListener('click', addToClipBoard);
    // copy clip on keyboard clicks
    button?.addEventListener('keydown', (e) => {
      if(e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space'){
        e.preventDefault()
        addToClipBoard()
      }
    })
    
    async function addToClipBoard(e){
        try {
          await navigator.clipboard.writeText(element);
          console.log(("Copied -> " + element));
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
    }
}