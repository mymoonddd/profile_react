import './main.css'
import TopBar from './topbar';
import SideBar from './sidebar';
import Content from './content';

import { useReducer } from 'react';
import optionreducer from '../state/optionReducer';
import selections from './sidebar/options/selection.json'

export default function Main() {
    const [options, dispatch] = useReducer(optionreducer, selections)
    const optionSwitch  = (id) => {
        dispatch({
            type: 'switch',
            id: id
        })
    }
    return <>
        <SideBar onOptionChange={optionSwitch}/>
        <div>
            <TopBar />
            <Content />
        </div>
    </>
}