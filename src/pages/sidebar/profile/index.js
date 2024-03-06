import './index.css'
import emailIcon from '../../../assets/icons/email.png'
import avatar from '../../../assets/images/profile.jpg'

export default function Profile() {
    return <div className="profile">
        <div className="avatar">
            <img src={avatar} alt=""></img>
            <img src={emailIcon} alt=""></img>
        </div>
        <div className="text-big">肖春燕</div>
        <div className="text-light">xiaochunyan@126.com</div>
    </div>
}