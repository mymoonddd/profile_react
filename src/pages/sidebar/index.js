import './index.css'
import logo from '../../assets/images/logo.png'
import Options from './options'
import Profile from './profile'

export default function SideBar() {
    return <div className="sidebar">
        <Title/>
        <Options/>
        <Profile />
    </div>
}

function Title() {
    return <div className="title">
        <img src={logo} alt=""></img>
        <span>菜单</span>
    </div>
}

