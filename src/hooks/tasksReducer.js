import { saveToLS } from "../utils/localstorageHandler";

const SAVEKEY = 'todos';

export default function tasksReducer(list, action) {
    switch (action.type) {
        case 'delete': 
            list.splice(action.index, 1)
            break
        case 'toggle':
            list[action.index].checked = !list[action.index].checked
            break
        case 'add':
            list.push(action.task)
            break
        case 'clear':
            list = []
            break
    }
    saveToLS(SAVEKEY, list)
}