import './index.css';
import { readFromLS } from '../../../utils/localstorageHandler';
import { useImmerReducer } from "use-immer";
import tasksReducer from '../../../hooks/tasksReducer';
import { useMemo } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import CountBar from './components/CountBar';

const SAVEKEY = 'todos'

export default function ToDo() {
    const initialValues = useMemo(()=> (readFromLS(SAVEKEY) ?? {tasks: [], showNum: 0}), []) 
    debugger
    const [{tasks, showNum}, dispatch] = useImmerReducer(tasksReducer, initialValues)
    const showTasks = tasks.filter(t => 
        showNum === 0 ? true : showNum === 1 ? !t.checked : t.checked
    )
    const actionSet = {
        addTask(task) {
            dispatch({
                type:'add',
                task: task
            })
        },
        deleteTask(id) {
            dispatch({
                type: 'delete',
                id: id
            })
        },
       toggleTask(id) {
            dispatch({
                type: 'toggle',
                id: id
            })
        },
        changeTask(task) {
            dispatch({
                type: 'change',
                task: task,
                id: task.id
            })
        },
        toggleAll() {
            dispatch({
                type: 'toggleAll'
            })
        },
        clearDones(){
            dispatch({
                type: 'clearDones'
            })
        },
        showChange(num) {
            dispatch({
                type: 'showChange',
                show: num
            })
        }
    }

    if (!tasks.length) {
        return <div className='con-todo wrapper'>
             <TaskInput actionSet={actionSet}/>
        </div>
    }

    return (
        <div className='con-todo wrapper'>
            <TaskInput actionSet={actionSet} tasks={tasks}/>
            <TaskList tasks={showTasks} actionSet={actionSet}/>
            <CountBar tasks={tasks} showNum={showNum} actionSet={actionSet}/>
        </div>
    )
}