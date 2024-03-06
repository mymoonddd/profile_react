import './index.css'
import leetcodeIcon from '../../assets/icons/leetcode.png'

export default function TopBar() {
    return <div className="topbar">
      <a href=""> <LeetcodeText /></a>
      <a href=""> <GithubText /></a>
    </div>
}

function LeetcodeText() {
    return <span>Leetcode</span>
}
function GithubText() {
    return <span>Github</span>
}