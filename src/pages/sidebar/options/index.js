import './index.css'
import selections from './selection.json'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Options() {
    const selBtns = selections.filter(x => x.on).map((x) => {
       return <SingleOption opt={x} key={x.id} />
    })

    return <div className="options"> 
        { selBtns } 
    </div>
}

function SingleOption({opt}) {
    const navigate = useNavigate()
    const pathName = useLocation().pathname.slice(1)
    const isActive = pathName === opt.route || (!pathName.length && opt.route === 'todo')
    const activeBtn = <span className="circle" style={{opacity: +(isActive)}}></span>
    const text = <span className="text">{opt.desc} {isActive}</span>
    // const alert = <span className="alert">11</span>

    return <div onClick={changeOpt} className="option">
        {activeBtn}
        {text}
        {/* {alert} */}
    </div>

    function changeOpt(e) {
        e.preventDefault()
        navigate('/'+opt.route)
    }
}

