import { saveToLS } from "../utils/localstorageHandler";

const SAVEKEY = 'todos';

export default function tasksReducer(draft, action) {
    let tasks = draft.tasks
    let idx = tasks.findIndex(t => t.id === action.id)

    switch (action.type) {
        case 'delete': 
            draft.tasks.splice(idx, 1)
            break
        case 'toggle':
            draft.tasks[idx].checked = !tasks[idx].checked
            break
        case 'add':
            draft.tasks.push(action.task)
            break
        case 'change':
            draft.tasks[idx].content = action.task.content
            break
        case 'clear':
            draft.tasks = []
            break
        case 'toggleAll':
            const todosCount = tasks.filter(t => !t.checked).length
            draft.tasks.forEach(t => {
                t.checked = Boolean(todosCount)
            })
            break
        case 'clearDones':
            draft.tasks = tasks.filter(t => !t.checked)
            break
        case 'showChange':
            draft.showNum = action.show
            switch (action.show) {
                case 0:
                    draft.tasks.forEach(x => x.on = true)
                case 1:
                    draft.tasks.forEach(x => x.on = !x.checked)
                case 2:
                    draft.tasks.forEach(x => x.on = x.checked)
            }

    }
    saveToLS(SAVEKEY, draft)
}
