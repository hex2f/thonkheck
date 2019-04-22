class Runtime {
  constructor (code, postflush) {
    this.cursor = 0
    this.pointer = 0
    this.tape = []
    this.tmp = 0
    this.rawCode = code
    this.tokens = []
    this.loopbacks = []
    this.valid = ['+', '-', '>', '<', '*', '/', '^', '[', ']', '.', '|']
    this.commentToken = '@'
    this.readingComment = false
    this.textbuffer = ''
    this.postflush = postflush || (() => {})
  }

  run (reparse) {
    if (this.tokens.length === 0 || reparse) this.parseCode()
    this.runCode()
  }

  parseCode () {
    const split = this.rawCode.split('')
    split.forEach((token, i) => {
      if (this.valid.indexOf(token) > -1 && !this.readingComment) this.tokens.push(token)
      if (token === '@' && split[i - 1] !== '\\') this.readingComment = !this.readingComment
    })
  }

  add () { this.tape[this.pointer] = (this.tape[this.pointer] || 0) + 1 }
  sub () { this.tape[this.pointer] = (this.tape[this.pointer] || 0) - 1 }
  next () { this.pointer += 1 }
  prev () { this.pointer = Math.max(this.pointer - 1, 0) }
  mult () { this.tape[this.pointer] = (this.tape[this.pointer] || 0) * this.tmp }
  div () { this.tape[this.pointer] = (this.tape[this.pointer] || 0) / this.tmp }
  pushTmp () { this.tmp = (this.tape[this.pointer] || 0) }
  startLoop () { this.loopbacks.push(this.cursor) }
  endLoop () {
    if (this.tape[this.pointer] === 0) {
      this.loopbacks.pop()
    } else {
      this.cursor = this.loopbacks[this.loopbacks.length - 1]
    }
  }
  print () { this.textbuffer += String.fromCharCode(this.tape[this.pointer]) }
  flush () { this.postflush(this.textbuffer); this.textbuffer = '' }

  runCode () {
    this.pointer = 0
    this.cursor = 0
    this.cells = []

    let finished = false

    while (!finished) {
      switch (this.tokens[this.cursor]) {
        case '+': this.add(); break
        case '-': this.sub(); break
        case '>': this.next(); break
        case '<': this.prev(); break
        case '*': this.mult(); break
        case '/': this.div(); break
        case '^': this.pushTmp(); break
        case '[': this.startLoop(); break
        case ']': this.endLoop(); break
        case '.': this.print(); this.flush(); break
        case '|': this.print(); break
        default: finished = true
      }
      this.cursor++
    }
  }
}

module.exports = Runtime
