import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

export default function TaskInput({actionSet, tasks}) {
    const toggleAll = useCallback(() =>  actionSet.toggleAll())
    const submit = useCallback((e) => {
        const el = document.getElementById('taskInput')
        let text = el.value

        if (e.keyCode !== 13 && e.target.tagName !== 'BUTTON' || !text.length) {
            return
        }
        e.preventDefault()

        const id = uuid()

        const task = {
            id,
            content: text,
            checked: false
        }
        actionSet.addTask(task)
        el.value = ''
    })

    let isAllChecked = useMemo(() => tasks?.every(t => t.checked) ?? false, [tasks]) 

    return (
        <div className="taskinput">
            <button onClick={toggleAll} className={`checkAll ${tasks?.length ? '' : 'hidden'} ${isAllChecked ? 'allChecked' : ''}  cursor-p`} >^</button>
            <input id="taskInput" type="text" placeholder="有什么要做的吗" onKeyDown={submit}/>
            {/* <button onClick={submit}>确定</button> */}
        </div>
    )
}