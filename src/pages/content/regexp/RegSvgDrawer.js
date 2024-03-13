import RegExpParser from './RegExpParser';

class RegSvgDrawer {
    constructor(gp = 10) {
        this.gp = gp
    }
    //画图
    keyword = ''

    draw(input) {
        this.input = input
        let info = document.getElementById('info')
        this.svg = document.querySelector('svg')
        this.svg.innerHTML = ''

        if (input === '') {
            return
        }
        try {
            let regNode = new RegExpParser(input)
            let graph = this.createRegularExpressionGraph(regNode)
            this.svg.setAttribute('width', graph.width)
            this.svg.setAttribute('height', graph.height)
            info.innerHTML=''
        } catch(e) {
            if (e instanceof TypeError) {
                this.svg.innerHTML = ''
                info.innerHTML='请输入正确的正则表达式~'
            } else {
                info.innerHTML = ''
                throw e
            }
        }
    }

    elt(tagName, attrs = {}, ...children) {        
        let el = document.createElementNS("http://www.w3.org/2000/svg", tagName)
        for (let key in attrs) {
        el.setAttribute(key, attrs[key])
        }
        for (let child of children) {
        if (typeof child === 'string') {
            child = document.createTextNode(child)
        }
        el.appendChild(child)
        }
        this.svg.appendChild(el)
        return el
    }
    add(x,y) {
        return x+y
    }
    max(x,y) {
        return Math.max(x,y)
    }
    createGraph(node) {
        if (node.type === 'Character') {
        return this.createCharacterGraph(node)
        }
        if (node.type === 'CharacterClass') {
        return this.createCharacterClassGraph(node)
        }
        if (node.type === 'CharacterRange') {
        return this.createCharacterRangeGraph(node)
        }
        if (node.type === 'Branch') {
        return this.createBranchGraph(node)
        }
        if (node.type === 'CaptureGroup') {
        return this.createCaptureGroupGraph(node)
        }
        if (node.type === 'Quantifier') {
        return this.createQuantifierGraph(node)
        }
        if (node.type === 'Regular Expresstion') {
        return this.createRegularExpressionGraph(node)
        }
        if (node.type === 'Escape') {
        return this.createExcapeGraph(node)
        }
        if (node.type === 'Dot') {
        return this.createDotGraph(node)
        }
        return this.createBranchesGraph(node)
    }
    createDotGraph(node) {
        let text = this.elt('text', {
        'dominant-baseline': 'text-before-edge',
        }, 'any character')
        let textBox = text.getBBox()
        let width = textBox.width + 2*this.gp
        let height = textBox.height + 2*this.gp
        let group = this.elt('rect', {
        width,
        height,
        fill: '#bada55',
        rx: '10',
        ry: '10',
        })
        text.setAttribute('x', this.gp)
        text.setAttribute('y', this.gp)

        let g = this.elt('g',{}, group, text)
        let gBox = g.getBBox()

        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }
    createCharacterGraph(node) {
        let text = this.elt('text', {
        'dominant-baseline': 'text-before-edge',
        x: this.gp/2,
        y: this.gp/2,
        }, node.value)
        let textBox = text.getBBox()
        let rect = this.elt('rect', {
        width: textBox.width + this.gp,
        height: textBox.height + this.gp,
        fill: '#dae9e5',
        rx: 10,
        })

        let g = this.elt('g', {}, rect, text)
        let gBox = g.getBBox()
        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }

    createCharacterClassGraph(node) {
        if (node.revert) {
        this.keyword = 'none of'
        } else {
        this.keyword = 'one of'
        }

        let map = {}
        const elements = node.elements.filter(nonRepeat) // 去重

        function nonRepeat(el) {
            let key = el.raw
            if (map[key] === undefined) {
                map[key] = true
                return true
            }
            return false
        }

        let graphs = elements.map(e => this.createGraph(e))
        let height = graphs.map(it => it.height).reduce(this.add) + (graphs.length + 1) * this.gp
        let width = graphs.map(it => it.width).reduce(this.max) + 2 * this.gp
        let group = this.elt('rect', {
        height,
        width,
        fill: '#cbcbba',
        rx: '10',
        ry: '10',
        y: 1.5*this.gp,
        })
        let g = this.elt('g')
        g.appendChild(group)

        let move = this.gp
        graphs.forEach(graph => {
        graph.g.setAttribute('transform', `translate(${(width - graph.width) / 2}, ${move + 1.5*this.gp})`)
        g.appendChild(graph.g)
        move += graph.height + this.gp
        })

        let rect = this.elt('rect', {
        height: height + 3*this.gp,
        width: width,
        fill: 'none',
        })
        g.appendChild(rect)

        let groupInfo = this.elt('text', {
        'dominant-baseline': 'text-before-edge',
            y: this.gp/3,
            'font-size': '12'
        }, this.keyword)
        g.appendChild(groupInfo)

        let gBOX = g.getBBox()

        return {
        g,
        width: gBOX.width,
        height: gBOX.height
        }

    }
    createCharacterRangeGraph(node){
        let startNode = {value: node.startCharacter}
        let startGraph = this.createCharacterGraph(startNode)
        let endNode =  {value: node.endCharacter}
        let endGraph = this.createCharacterGraph(endNode)
        let width = startGraph.width + endGraph.width + 2*this.gp
        let height = this.max(startGraph.height, endGraph.height)

        let group = this.elt('rect', {
        width,
        height,
        fill: '#cbcbba',
        rx: 10,
        })

        let line = this.elt('line', {
        x1: startGraph.width + 0.5*this.gp,
        y1: height/2 ,
        x2: startGraph.width + 1.5*this.gp,
        y2: height/2 ,
        fill: 'none',
        stroke: 'black',
        'stroke-width': '2',
        })

        endGraph.g.setAttribute('style', `transform:translate(${width - endGraph.width}px, 0`)


        let g = this.elt('g', {}, group, startGraph.g, endGraph.g, line)
        let gBox = g.getBBox()
        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }
    createBranchGraph(node) {
        let g = this.elt('g')
        let wordStart = {
        width: 0,
        }
        let wordEnd = {
        width: 0,
        }
        let graphs = node.elements.map(e => this.createGraph(e))
        let height = graphs.map(it => it.height).reduce(this.max) + 2 * this.gp
        let width = graphs.map(it => it.width).reduce(this.add) + (graphs.length + 1) * this.gp
        if (node.wordStart) {
        wordStart = this.createAssertion(node, 'Start of line')
        for (let child of wordStart.g.children) {
            child.setAttribute('style', `transform: translateY(${(height - wordStart.height) / 2}px)`)
        }
        g.appendChild(wordStart.g)
        width += wordStart.width
        }
        if (node.wordEnd) {
        wordEnd = this.createAssertion(node, 'End of line')
        for (let child of wordEnd.g.children) {
            child.setAttribute('style', `transform: translate(${width}px, ${(height - wordEnd.height) / 2}px)`)
        }
        g.appendChild(wordEnd.g)
        }
        width += wordEnd.width
        let group = this.elt('rect', {
        width,
        height,
        fill: 'none'
        })

        g.appendChild(group)

        let move = 0
        graphs.forEach(graph => {
        graph.g.setAttribute('transform', `translate(${wordStart.width +move + this.gp}, ${(height - graph.height) / 2})`)
        let line = this.elt('path', {
        'stroke-width': 2,
        d: `M ${wordStart.width+move} ${height / 2}
            H ${wordStart.width+move+this.gp}
            M ${width-this.gp - wordEnd.width} ${height / 2}
            H ${width - wordEnd.width}`,
        'stroke': 'black',
        })
        g.appendChild(line)
        g.appendChild(graph.g)
        move += graph.width + this.gp
        })

        let gBox = g.getBBox()
        return {
        g,
        width: gBox.width,
        height: gBox.height
        }
    }
    createBranchesGraph(node) {
        let graphs = node.map(e => this.createGraph(e))
        let width = graphs.map(it => it.width).reduce(this.max) + 4 * this.gp
        let height = graphs.map(it => it.height).reduce(this.add) + (graphs.length + 1) * this.gp
        let group = this.elt('rect', {
        height,
        width,
        fill: 'none'
        })
        let g = this.elt('g')
        g.appendChild(group)

        let move = this.gp
        graphs.forEach(graph => {
        let x = (width - graph.width) / 2
        graph.g.setAttribute('transform', `translate(${x},${move})`)
        g.appendChild(graph.g)

        let y = move + graph.height / 2
        let line = this.elt('path', {
            d:`
            M ${x} ${y}
            H ${2*this.gp}
            C ${this.gp} ${y} ${this.gp} ${height / 2} ${0} ${height / 2}
            M ${width - x} ${y}
            H ${width - 2*this.gp}
            C ${width - this.gp} ${y} ${width - this.gp} ${height / 2} ${width} ${height / 2}
            `,
            fill: 'none',
            stroke: 'black',
            'stroke-width': '2',
        })
        g.appendChild(line)
        move += graph.height + this.gp
        })

        let gBox = g.getBBox()
        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }
    createCaptureGroupGraph(node) {
        let graph = this.createGraph(node.branches)
        let group = this.elt('rect', {
        width: graph.width,
        height: graph.height + 2 * this.gp,
        fill: 'none',
        })
        graph.g.setAttribute('transform', `translate(0, ${this.gp})`)
        let g = this.elt('g')
        g.appendChild(group)
        g.appendChild(graph.g)

        if (node.groupIndex > 0) {         // 给捕获分组加虚框
        let dashBorder = this.elt('path', {
            d:`
            M 0 ${this.gp * 1.7}
            H ${graph.width}
            V ${graph.height}
            H 0
            V ${this.gp * 1.7}
            `,
            fill: 'none',
            stroke: 'grey',
            'stroke-width': '2',
            'stroke-dasharray':'10 5',
        })
        g.appendChild(dashBorder)

        let info = `Group #${node.groupIndex}` // 添加分组信息
        if (node.groupName !== '') {
            info += ' ' + node.groupName
        }
        let groupInfo = this.elt('text', {
            'dominant-baseline': 'text-before-edge',
            'style': 'color: white',
            'font-size': '12'
        }, info)
        g.appendChild(groupInfo)

        let infoBox = groupInfo.getBBox()
        if (infoBox.width > graph.width) {     // 分组名称超过虚框长度的话 补足右边缺少的连接线
            let fillLine = this.elt('path', {
            d: `
                M ${graph.width} ${(graph.height + 2 * this.gp) / 2}
                H ${infoBox.width}
            `,
            fill: 'none',
            stroke: 'black',
            'stroke-width': '2',
            })
            g.appendChild(fillLine)
        }
        }

        let gBox = g.getBBox()
        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }
    createQuantifierGraph(node) {
        let graph = this.createGraph(node.element)
        let width =  graph.width + 4 * this.gp
        let height = graph.height + 2 * this.gp
        let group = this.elt('rect' ,{
        width,
        height,
        fill:'none',
        y: 1.5*this.gp,
        })
        let g = this.elt('g')
        g.appendChild(group)
        graph.g.setAttribute('transform', `translate(${2 * this.gp}, ${2.5*this.gp})`)
        g.appendChild(graph.g)

        let line = this.elt('path', {
        d:`
        M ${2 * this.gp} ${height / 2 + 1.5*this.gp}
        H 0
        M ${width - 2 * this.gp} ${height / 2 + 1.5*this.gp}
        H ${width}
        `,
        fill: 'none',
        stroke: 'black',
        'stroke-width': '2',
        })
        g.appendChild(line)

        let rect = this.elt('rect', { // 预留文字空间的外框
            width,
            height: height + 3*this.gp,
            fill: 'none',
        })
        g.appendChild(rect)

        if (node.min === 0) {
        let skipLine = this.elt('path', {
            d: `
            M 0 ${height / 2  + 1.5*this.gp}
            A ${this.gp} ${this.gp} 0 0 0 ${this.gp} ${height / 2 + 0.5*this.gp}
            V ${ 2.5*this.gp}
            A ${this.gp} ${this.gp} 0 0 1 ${2*this.gp} ${ 1.5*this.gp}
            H ${width - 2 * this.gp}
            A ${this.gp} ${this.gp} 0 0 1 ${width - this.gp} ${2.5*this.gp}
            V ${height / 2 + 0.5*this.gp}
            A ${this.gp} ${this.gp} 0 0 0 ${width} ${height / 2 + 1.5*this.gp}
            `,
            fill: 'none',
            stroke: 'black',
            'stroke-width': '2',
        })
        g.appendChild(skipLine)
        let skipText = this.elt('text', {
            fill:"black",
            'font-size': '12',
            'dominant-baseline': 'text-before-edge',
        },'skip~')
        g.appendChild(skipText)
        }
        if (node.max > 1) {
        let repeatLine = this.elt('path', {
            d: `
            M ${2 * this.gp} ${height / 2 + 1.5*this.gp}
            A ${this.gp} ${this.gp} 0 0 0 ${this.gp} ${height / 2 + 2.5*this.gp}
            V ${height + 0.5*this.gp}
            A ${this.gp} ${this.gp} 0 0 0 ${2 * this.gp} ${height + 1.5*this.gp}
            H ${width - 2 * this.gp}
            A ${this.gp} ${this.gp} 0 0 0 ${width - this.gp} ${height + 0.5*this.gp}
            V ${height / 2 + 2.5*this.gp}
            A ${this.gp} ${this.gp} 0 0 0 ${width - 2 * this.gp} ${height / 2 + 1.5*this.gp}
            `,
            fill: 'none',
            stroke: 'black',
            'stroke-width': '2',
        })
        g.appendChild(repeatLine)

        let repeatNum = ''                // 显示重复次数
        if (node.min  === node.max) {
            repeatNum = `repeat: ${node.min}`
        } else if (node.min >= 2) {
            repeatNum += `min: ${node.min - 1} max: ${node.max - 1}`
        } else {
            repeatNum += `max: ${node.max - 1}`
        }
        let repeatText = this.elt('text', {
            y: height + 3*this.gp,
            fill:"black",
            'font-size': '12',
            'dominant-baseline': 'text-after-edge',
        }, repeatNum)
        g.appendChild(repeatText)

        let repTextBox = repeatText.getBBox()
        if (repTextBox.width > width) {        // 文字内容过长时，补足断开的铁轨。
            let fillLine = this.elt('path', {
            d: `
                M ${width} ${(height + 3*this.gp) / 2 }
                H ${repTextBox.width + 2*this.gp}
            `,
            fill: 'none',
            stroke: 'black',
            'stroke-width': '2',
            })
            g.appendChild(fillLine)
        }
        }

        let gBox = g.getBBox()
        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }
    createExcapeGraph(node) {
        let keywords = ["w", "W", "s", "S", "d", "D", "b", "B"]
        if (keywords.includes(node.value)) {
        let keyword = ''
        if (node.value === 'w')
            keyword = 'word'
        if (node.value === 'W')
            keyword = 'non-word'
        if (node.value === 'd')
            keyword = 'digit'
        if (node.value === 'D')
            keyword = 'non-digit'
        if (node.value === 'b')
            keyword = 'word boundary'
        if (node.value === 'B')
            keyword = 'non-word boundary'
        if (node.value === 's')
            keyword = 'white space'
        if (node.value === 'S')
            keyword = 'non-white space'
        let text = this.elt('text', {
            'dominant-baseline': 'text-before-edge',
        }, keyword)
        let textBox = text.getBBox()
        let width = textBox.width + 2*this.gp
        let height = textBox.height + 2*this.gp
        let group = this.elt('rect', {
            width,
            height,
            fill: '#bada55',
            rx: '10',
            ry: '10',
        })
        text.setAttribute('x', this.gp)
        text.setAttribute('y', this.gp)

        let g = this.elt('g',{}, group, text)
        let gBox = g.getBBox()

        return {
            g,
            width: gBox.width,
            height: gBox.height,
        }
        }
        return this.createCharacterGraph({value: node.value})
    }
    createRegularExpressionGraph(node) {
        let graph = this.createGraph(node.branches)
        let width = graph.width + 2 * this.gp
        let height = graph.height + 2 * this.gp
        let group = this.elt('rect', {
        width,
        height,
        fill: 'none',
        })
        let g = this.elt('g')
        g.appendChild(group)
        graph.g.setAttribute('transform', `translate(${this.gp}, ${this.gp})`)
        g.appendChild(graph.g)
        let startDot = this.elt('circle', {
        'cx': this.gp / 2,
        'cy': height / 2,
        r:this.gp / 2 - 1,
        fill: 'white',
        stroke: 'grey',
        'stroke-width': '2'
        })
        let endDot = this.elt('circle', {
        'cx': width - this.gp / 2,
        'cy': height / 2,
        r:this.gp / 2 - 1,
        fill: 'white',
        stroke: 'grey',
        'stroke-width': '2'
        })
        g.appendChild(startDot)
        g.appendChild(endDot)

        let gBox = g.getBBox()
        return {
            g,
            width: gBox.width,
            height: gBox.height,
        }
    }
    createAssertion(node, keyword) {
        let text = this.elt('text', {
        'dominant-baseline': 'text-before-edge',
        fill: 'white',
        }, keyword)
        let textBox = text.getBBox()
        let width = textBox.width + 2*this.gp
        let height = textBox.height + 2*this.gp
        let group = this.elt('rect', {
        width,
        height,
        fill: '#6b6659',
        rx: '10',
        ry: '10',
        })
        text.setAttribute('x', this.gp)
        text.setAttribute('y', this.gp)

        let g = this.elt('g', {}, group, text)
        let gBox = g.getBBox()

        return {
        g,
        width: gBox.width,
        height: gBox.height,
        }
    }
}

export default RegSvgDrawer;