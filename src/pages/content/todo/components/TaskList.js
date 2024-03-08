import { useMemo, useState } from 'react';

export default function TaskList({tasks, actionSet}) {
    const tasksRow = tasks.map(t => {
        const id = t.id
        return (
            <div>
                <Checkbox task={t}/>
                <ContentBox task={t}/>
                <button className="cursor-p" onClick={e => deleteTask(e, id)}>x</button>
            </div> 
        )
    })
    return <div className="tasklist"> {tasksRow} </div>

    function deleteTask(e, id) {
        e.preventDefault()
        actionSet.deleteTask(id)
    }

    function toggleTask(e,id) {
        e.preventDefault()
        actionSet.toggleTask(id)
    }

    function changeContent(e, task) {
        e.preventDefault()
        actionSet.changeTask(task)
    }

    function Checkbox({task}) {

        return <div className="cursor-p" onClick={(e) => toggle(e,task.id)}> {task.checked ? "✅" : ""}</div>
        function toggle(e,id) {
            toggleTask(e, id)
        }
    }

    function ContentBox({task}) {
        let [value, setValue] = useState(task.content)
        return  <input value={value} className={task.checked ? 'dashed' : ''} onChange={change} onBlur={test} onKeyDown={pressEnter}/>
        function test(e) {
            let newtask = {...task, content: e.target.value}
            changeContent(e, newtask)
        }

        function pressEnter(e) {
            if (e.keyCode === 13) {
                test(e)
            }
        }
        function change(e) {
            const newVal = e.target.value
            setValue(newVal)
        }
    }
}