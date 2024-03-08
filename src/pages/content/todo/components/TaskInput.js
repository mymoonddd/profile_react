import { v4 as uuid } from 'uuid';

export default function TaskInput({actionSet}) {
    return (
        <div  className="taskinput">
            <button onClick={toggleAll}>✅</button>
            <input id='taskInput' type='text' placeholder='有什么要做的吗' onKeyDown={submit}/>
            <button onClick={submit}>确定</button>
        </div>
    )

    function toggleAll() {
        actionSet.toggleAll()
    }

    function submit(e) {
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
    }
}