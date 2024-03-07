import './index.css';
import { readFromLS } from '../../../utils/localstorageHandler';
import { useImmerReducer } from "use-immer";
import tasksReducer from '../../../hooks/tasksReducer';

export default function ToDo() {
    const SAVEKEY = 'todos'
    const initialValues = readFromLS(SAVEKEY) ?? []
    const [tasks, dispatch] = useImmerReducer(tasksReducer, initialValues)


    if (tasks.length === 0) {
        return <div className="con-todo" onClick={() => addTask({
            index:tasks.length, 
            content:"学习react", 
            checked: false })}>
            暂时没有任务
        </div>
    }


    return (
        <div>
            <TaskInput onSubmit={addTask} tasks={tasks}/>
            <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask}/>
        </div>
    )


    function addTask(task) {
        dispatch({
            type:'add',
            task: task
        })
    }

    function deleteTask(index) {
        dispatch({
            type: 'delete',
            index: index
        })
    }

    function toggleTask(index) {
        dispatch({
            type: 'toogle',
            index: index
        })
    }
}

function TaskInput({onSubmit, tasks}) {
    return (
        <div>
            <input type='text'/>
            <button onClick={submit}>确定</button>
        </div>
    )

    function submit(e) {
        e.preventDefault()
        const task = {
            index: tasks.length,
            content: '学习react'+tasks.length,
            checked: false
        }
        onSubmit(task)
    }
}

function TaskList({tasks, onDelete, onToggle}) {
    const tasksRow = tasks.map(t => {
        const idx = t.index
        return (
            <div>
                <input type="checkbox" checked={t.checked} onClick={e => toggleTask(e, idx)}/>
                <span key={idx}>{t.content}</span>
                <button onClick={e => deleteTask(e, idx)}>x</button>
            </div> 
        )
    })
    return <div> {tasksRow} </div>

    function deleteTask(e, index) {
        e.preventDefault()
        onDelete(index)
    }

    function toggleTask(e,index) {
        e.preventDefault()
        onToggle(index)
    }
}







