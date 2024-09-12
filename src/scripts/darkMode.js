import { getLocalStorageData, setLocalStorageData } from "./utils/localStorage.js"

const root = document.querySelector(':root')
const popOverContent = document.querySelector('.popover-content')

getUserTheme()

popOverContent.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'light':
            root.classList.remove('dark')
            setLocalStorageData('theme', 'light')
            break;
        case 'dark':
            root.classList.add('dark')
            setLocalStorageData('theme', 'dark')
            break;
        default:
            getUserTheme('os default')
            break;
    }
})

function getUserTheme(os = getLocalStorageData('theme')){
    if(/(?<!.+?)(light|dark|os default)(?!.+?)/.test(os)){
        if(os === 'os default'){
            if(window.matchMedia('(prefers-color-scheme: dark)').matches){
                root.classList.add('dark')
                setLocalStorageData('theme', os)
                return
            }
            root.classList.remove('dark')
            setLocalStorageData('theme', os)
            return
        }
        return (
            getLocalStorageData('theme') === 'dark' 
            ? root.classList.add('dark')
            : root.classList.remove('dark')
        )
    }
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        root.classList.add('dark')
        setLocalStorageData('theme', 'os default')
        return
    }
    root.classList.remove('dark')
    setLocalStorageData('theme', 'os default')
}