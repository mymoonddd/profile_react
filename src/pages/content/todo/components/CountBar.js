import { useCallback } from "react"

export default function CountBar({tasks, actionSet, showNum}) {
    const toBeDone = tasks.filter(x=> !x.checked).length
    const showChange = useCallback((n=0) => {
        actionSet.showChange(n)
    })

    const clearAll = useCallback(() => {
        actionSet.clearDones()
    })

    const ShowBtns = ['全部','未完成','已完成'].map((x,idx) =>
        <button onClick={() => showChange(idx)} className={`${showNum === idx ? 'selected' : ''} cursor-p`}>{x}</button>
    )

    return <div className="countbar">
        <span className="toBeDone">{toBeDone}个待完成</span>
        <span className="showBtns">{ShowBtns}</span>
        <button onClick={clearAll} className="cursor-p deleteDones">清除已完成</button>
    </div>
}
