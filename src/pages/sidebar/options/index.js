import './index.css'
import selections from './selection.json'

export default function Options({onOptionChange}) {
    const selBtns = selections.map((x) => {
       return <SingleOption onOptionChange={onOptionChange} opt={x} />
    })
    return <div className="options"> 
        { selBtns } 
    </div>
}

function SingleOption({onOptionChange, opt}) {

    const activeBtn = <span className="circle" style={{opacity: +(opt.on)}}></span>
    const text = <span className="text">{opt.desc}</span>
    const alert = <span className="alert">11</span>

    return <div onClick={changeOpt} className="option" on>
        {activeBtn}
        {text}
        {/* {alert} */}
    </div>

    function changeOpt(e) {
        e.preventDefault()
        onOptionChange(opt.id)
    }
}

