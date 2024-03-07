import './main.css'
import TopBar from './topbar';
import SideBar from './sidebar';
import Content from './content';

export default function Main() {
    return <>
        <SideBar/>
        <div>
            <TopBar />
            <Content />
        </div>
    </>
}