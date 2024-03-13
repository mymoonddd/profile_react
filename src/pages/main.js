import './main.css'
import TopBar from './topbar';
import SideBar from './sidebar';
import Content from './content';
import { useCallback, useEffect, useRef } from 'react';

export default function Main() {
    const ref = useRef('')
    useEffect(() => {
        setTimeout(() => {
            scaleByScreenWidth()
        })
    })
    
  
    return <div className="block" ref={ref}>
        <SideBar/>
        <div>
            <TopBar/>
            <Content />
        </div>
    </div>

    
    function scaleByScreenWidth() {
        const width = window.outerWidth
        if (ref.current) {
            ref.current.style.scale = width < 500 ? width / 800 : width < 1000 ? 0.8 : 1
            console.log( width / 500)
        }
    }
}