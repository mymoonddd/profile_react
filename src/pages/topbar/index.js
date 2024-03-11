import './index.css'
import { Link } from 'react-router-dom'

export default function TopBar() {
    return <div className="topbar">
        <Link to={'https://github.com/mymoonddd'} children={<LeetcodeText/>}/>
        <Link to={'https://leetcode.com/mymoonddd/'} children={<GithubText />} />
    </div>
}

function LeetcodeText() {
    return <span>Leetcode</span>
}
function GithubText() {
    return <span>Github</span>
}