import './main.css'
import TopBar from './topbar';
import SideBar from './sidebar';
import Content from './content';
import { useEffect, useRef } from 'react';

export default function Main() {
    const ref = useRef('')
    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    })
    
    return <div className="block" ref={ref}>
        <SideBar/>
        <div>
            <TopBar/>
            <Content />
        </div>
    </div>

    function onResize() {
        if (ref.current) {
            const width = window.outerWidth
            ref.current.style.scale = width < 460 ? (width / 600) : 1
        }
    }
}