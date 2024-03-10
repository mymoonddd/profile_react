import './index.css';
import RegSvgDrawer from './RegSvgDrawer';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function RegExpRailway() {
    const [inputValue, setInput] = useState('^(p|d|(ccc|ddd|eee|fff))(hufa|(a{2,4}b*c?)*([^aeiou]*)*(cd|ef|((f+o*)+[odv]+)+dd)+c[def]|def|abc)$')
    const [scaleVal, setScale] = useState(1)
    const drawer = useRef(null)
     useEffect(() => {
        if (drawer.current === null) {
            drawer.current = new RegSvgDrawer()
        }
        drawer.current.draw(inputValue)
    }, [inputValue])

    const download = useCallback(() => {
        let svg = document.querySelector('svg')
        let blob = new Blob(
            [svg.outerHTML],
            {type: 'image/svg+xml'}
            )
        let anchor = document.createElement('a')
        let href =  URL.createObjectURL(blob)
        anchor.setAttribute('href', href)
        anchor.download = '正则铁路图'
        anchor.click()
    })

    const scale = useCallback((base) => {
        let svg = document.querySelector('svg')
        svg.style.scale = scaleVal * base
        setScale(scaleVal => scaleVal*base)

    })

    return <div className="con-regexp">
    <div className="title">
        <span id="title">Regexper</span>
        <span id='info'></span>
    </div>
    <div className="userInput">
        <label><input type="text" id="regInput" placeholder="请输入正则表达式 例如“^[a-zA-Z0-9]{4,16}$”" value={inputValue} onChange={changeInput}/></label>
        <button id="downloadButton" className="cursor-p" onClick={download}>下载SVG图片</button>
    </div>
    <div className="resultPre" >
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <div>
        <button onClick={() => scale(0.8)}>-</button>
        <button onClick={() => scale(1.2)}>+</button>
    </div>
    </div>

    function changeInput(e) {
        setInput(e.target.value)
    }
}


