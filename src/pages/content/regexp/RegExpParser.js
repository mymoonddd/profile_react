// 将字符串解析为正则表达式
class RegExpParser {
    constructor(str) {
        this.str = str 
        return this.parsePattern()
    }
    i = 0;
    groupIndex = 1;

    get char() {
        return this.str[this.i]
    }

    parsePattern() {
        let node = {
            type: 'Regular Expression',
            branches: this.parseBranches()
        }
        return node
    }

    parseBranches() {
        let nodes = []
        while(true) {
            if (this.char === '|') {
                this.i++
            }
            nodes.push(this.parseBranch())
            if ([undefined, ')'].includes(this.char)) {
                break
            }
        }
        return nodes 
    }

    parseBranch() {
        let node = {
            type: 'Branch',
            start: this.i,
            end: 1,
            raw: '',
            elements: [],
            wordStart: false,
            wordEnd: false
        }
        if (this.char === '^') {
            node.wordStart = true 
            this.i++
        }
        while(this.char) {
            let part = this.parsePart()
            console.log(part)

            if (part.type === 'Quantifier') {
                part = this.dealwithQuantifier(node.elements, part)
            }
            node.elements.push(part)
            if (this.char === '$') {
                node.wordEnd = true 
                this.i++
            }
            if (['|', undefined, ')'].includes(this.char)) {
                break
            }
        }
        node.end = this.i
        node.raw = this.str.slice(node.start, node.end)
        return node
    }

    dealwithQuantifier(nodes, part) {
        let prev = nodes.pop()
        if (prev.type === 'Character') {
            let repeatChar = {
                type: 'Character',
                start: prev.end - 1,
                end: prev.end,
                raw: this.str[prev.end - 1],
                value: this.str[prev.end - 1]
            }
            if (prev.raw.length > 1) {
                prev.end = prev.end - 1
                prev.raw = prev.raw.slice(0,-1)
                prev.value = prev.raw
                nodes.push(prev)
            }
            return {
                type: 'Quantifier',
                start: repeatChar.start,
                end: part.end,
                raw: this.str.slice(repeatChar.start, part.end),
                greedy: part.greedy,
                min: part.min,
                max: part.max,
                element: repeatChar
            }
          } else {
            return {
                type: 'Quantifier',
                start: prev.start,
                end: part.end,
                raw: this.str.slice(prev.start, part.end),
                value: this.str.slice(prev.start, part.end),
                min: part.min,
                max: part.max,
                element: prev
            }
        }
    }
    

    parsePart() {
        if (this.char === '[') {
            return this.parseCharacterClass()
        }
        if (['*', '?', '+', '{'].includes(this.char)) {
            return this.parseQuantifier()
        }
        if (this.char === '(') {
            return this.parseCaptureGroup()
        }
        if (this.char === '\\') {
            return this.parseEscape()
        }
        if (this.char === '.') {
            return this.parseDot()
        }
        return this.parseCharacter()
    }

    parseCharacter(n=Infinity) {
        const keywords = ['\\', '{', '(', '[', '*', '?', '+', '.', '|','$']
        let node = {
            type: 'Character',
            start: this.i,
            end: this.i + 1,
            raw: this.char,
            value: this.char
        }

        if (keywords.includes(this.char)) {
            node = this.parsePart()
        } else {
            while(!keywords.includes(this.char) && this.char && n > 0) {
                this.i++
                n--
            }
            node.end = this.i 
            node.raw = this.str.slice(node.start, node.end)
            node.value = node.raw
        }
        return node 
    }

    parseCharacterClass() {
        let node = {
            type: 'CharacterClass',
            start: this.i,
            end: 1,
            raw: '',
            revert: false,
            elements: []
        }
        this.i++ // skip [
        if (this.char === '^') {
            node.revert = true 
            this.i++
        }

        while(this.char !== ']' && this.char !== undefined) {
            let temp;
            temp = this.char === '\\' ? this.parseEscape() : this.parseCharacter(1)
            if (this.char === '-') {
                this.i++ 
                if (this.char === ']') {
                    node.elements.push(temp)
                    this.i--
                    temp = this.parseCharacter() // 把-当成字符串解析
                    node.elements.push(temp)
                    break
                } else {
                    let temp2 = this.parseCharacter(1)
                    let rangeNode = {
                        type: 'CharacterRange',
                        start: temp.start,
                        startCharacter: temp.value,
                        end: temp2.end,
                        endCharacter: temp2.value,
                        raw: this.str.slice(temp.start, temp2.end)
                    }
                    node.elements.push(rangeNode)
                }
            } else if (!(temp.type === 'Quantifier')) {
                node.elements.push(temp)
            }
        }
        this.i++ // skip ]
        node.end = this.i 
        node.raw = this.str.slice(node.start, node.end)
        return node
    }

    parseQuantifier() {
        let node = {
            type: 'Quantifier',
            start: this.i,
            end: 1,
            raw: '',
            min: 0,
            max: 1,
            element: null, 
            greedy: true
        }

        if (this.char === '*') {
            this.i++
            node.max = Infinity
        } else if (this.char === '?') {
            this.i++
        } else if (this.char === '+') {
            this.i++
            node.min = 1
            node.max = Infinity
        } else {
            this.i++ // skip {
            node.min = this.parseInteger()
            if (this.char === '}') {
                node.max = node.min
            } else if (this.char === ',') {
                this.i++ // skip ,
                if (this.char === '}') {
                    node.max = Infinity
                } else {
                    node.max = this.parseInteger()
                }
            } else {
                // ERROR: 格式不对
            }
            this.i++ // skip }
        }

        if (this.char === '?') {
            node.greedy = false 
            this.i++
        }

        node.end = this.i 
        node.raw = this.str.slice(node.start, node.end)
        return node
    }

    parseInteger() {
        let numStr = ''
        while (this.char <= '9' && this.char >= '0') {
            numStr += this.char
            this.i++
        }
        if (this.char === '.') { // 忽略小数
            this.i++ 
            while(this.char <= '9' && this.char >= '0') {
                this.i++
            } 
        }
        return parseInt(numStr)
    }

    parseCaptureGroup() {
        let node = {
            type: 'CaptureGroup',
            start: this.i,
            end: 1,
            raw: '',
            groupIndex: 0,
            groupName: '',
            assertion: false,
            positive: true,
            lookahead: true,
            branches: [],
        }

        this.i++ // skip (
        if (this.char === '?') {
            this.i++ //skip ?
            if (this.char === ':') {     // 非捕获分组 ?:
                this.i++ // skip :
            } else if (this.char === '=') { // 正向预测断言 ?=
                node.assertion = true 
                node.lookahead = true 
                node.positive = true
                this.i++ // skip =
            } else if (this.char === '!') { // 负向预测断言 ?!
                node.assertion = true 
                node.lookahead = true 
                node.positive = false 
                this.i++ // skip !
            } else if (this.char === '<') { // 具名分组或回顾断言
                this.i++ // skip <
                if (this.char === '=') {     // 正向回顾断言 ?<=
                    node.assertion = true 
                    node.lookahead = false 
                    node.positive = true
                    this.i++
                } else if (this.char === '!') {  // 负向回顾断言 ?<!
                    node.assertion = true 
                    node.lookahead = false 
                    this.i++
                    node.positive = false  // 具名分组 ?<
                } else {
                    node.groupIndex = this.groupIndex++
                    node.groupName = this.parseGroupName()
                }
            }
        } else {
            node.groupIndex = this.groupIndex++
        }
        if (this.char !== ')') {
            node.branches = this.parseBranches()
        } 
        this.i++
        node.end = this.i 
        node.raw = this.str.slice(node.start, node.end)

        return node
    }
    parseGroupName() {
        let nameStr = ''
        while (!['>', undefined].includes(this.char)) {
            nameStr += this.char
            this.i++
        }
        this.i++ // skip >
        return nameStr
    }

    parseEscape() {
        let node = {
            type: 'Escape',
            start: this.i,
            end: 1,
            value: '',
            raw: ''
        }
        this.i++ // skip \
        node.value = this.char
        this.i++
        node.end = this.i 
        node.raw = this.str.slice(node.start, node.end)
        return node
    }

    parseDot() {
        let node = {
            type: 'Dot',
            start: this.i,
            end: this.i+1,
            value: 'anycharacter',
            raw: '.'
        }
        this.i++
        return node
    }
}

export default RegExpParser