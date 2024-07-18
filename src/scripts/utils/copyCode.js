export function copySomeCode(element){
    const copyBtn = document?.querySelector('.copy-btn')
    // Copy Pass Into Clipboard
    copyBtn?.addEventListener('click', addToClipBoard);

    // copy clip on keyboard clicks
    copyBtn?.addEventListener('keydown', (e) => {
      if(e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space'){
        e.preventDefault()
        addToClipBoard()
      }
    })
    
    async function addToClipBoard(e){
      console.log('click')
        try {
          await navigator.clipboard.writeText(element);
          console.log(("Copied -> " + element));
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
    }
}