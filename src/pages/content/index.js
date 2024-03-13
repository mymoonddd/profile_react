import './index.css'
import {Routes, Route} from 'react-router-dom'
import Profile from './profile'
import ToDo from './todo'
import Weightloss from './weightloss'
import Paint from './paint'
import RegExpRailway from './regexp'
import Drama from './drama'
import ErrorContent from './error'

export default function Content() {
    return (
        <div className='content'>
            <Routes>
                <Route path='/' element={<ToDo/>}/>
                <Route path='/todo' element={<ToDo/>}/>
                {/* <Route path='weightloss' element={<Weightloss/>}/> */}
                {/* <Route path='paint' element={<Paint/>}/> */}
                <Route path='regexp' element={<RegExpRailway/>}/>
                {/* <Route path='movie' element={<Drama/>}/> */}
                <Route path='*' element={<ErrorContent/>}/>
            </Routes>
        </div>
    )
}