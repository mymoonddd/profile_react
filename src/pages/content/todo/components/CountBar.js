export default function CountBar({tasks, actionSet, showNum}) {
    const toBeDone = tasks.filter(x=> !x.checked).length
    const ShowBtns = ['全部','未完成','已完成'].map((x,idx) =>
        <button onClick={() => showChange(idx)} className={`${showNum === idx ? 'selected' : ''} cursor-p`}>{x}</button>
    )

    return <div className="countbar">
        <span>{toBeDone}个待完成</span>
        <span>{ShowBtns}</span>
        <button onClick={clearAll}>清除已完成</button>
    </div>

    function showChange(num = 0) {
        actionSet.showChange(num)
    }
    function clearAll() {
        actionSet.clearDones()
    }
}
