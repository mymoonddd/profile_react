import './index.css'
import selections from './selection.json'

export default function Selections() {
    const displays = selections.filter(x => x.on)
    const selBtns = displays.map( x => <Selection key={x.type} sel={x} /> )
    return <div className='block'>{ selBtns } </div>
}

function Selection({sel}) {
    return <div className="selection"  onClick={(e) => onClick(e,sel)}>{ sel.desc }</div>
}

function onClick(e, sel) {
    alert(sel.desc)
    console.log(e.target)
}