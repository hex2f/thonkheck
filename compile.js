class Runtime {
  constructor (code) {
    this.cursor = 0
    this.rawCode = code
    this.tokens = []
    this.valid = ['+', '-', '>', '<', '*', '/', '^', '[', ']', '.', '|']
    this.commentToken = '@'
    this.readingComment = false
    this.csrc = `
#include <stdlib.h>

int main(){
int count = 1;                                                                                                                                                                                                                          
int printLen = 1;                                                                                                                                                                                                                       
int* cells = malloc(sizeof(int));                                                                                                                                                                                                       
char* print = malloc(sizeof(char));                                                                                                                                                                                                     
int printPtr = 0;                                                                                                                                                                                                                       
int ptr = 0;                                                                                                                                                                                                                            
int tmp = 0;`
  }

  parseCode () {
    const split = this.rawCode.split('')
    split.forEach((token, i) => {
      if (this.valid.indexOf(token) > -1 && !this.readingComment) this.tokens.push(token)
      if (token === '@' && split[i - 1] !== '\\') this.readingComment = !this.readingComment
    })
  }

  add () { this.csrc += '\n\tcells[ptr] += 1;' }
  sub () { this.csrc += '\n\tcells[ptr] -= 1;' }
  next () { this.csrc += '\n\tif(ptr + 1 > count - 1) { int* tmpcells = realloc(cells, (count + 1)*sizeof(int)); count += 1; ptr += 1; cells = tmpcells; cells[ptr] = 0; }' }
  prev () { this.csrc += '\n\tif(ptr - 1 >= 0) { ptr -= 1; }' }
  mult () { this.csrc += '\n\tcells[ptr] = cells[ptr] * tmp;' }
  div () { this.csrc += '\n\tcells[ptr] = cells[ptr] / tmp;' }
  pushTmp () { this.csrc += '\n\ttmp = cells[ptr];' }
  startLoop () { this.csrc += '\n\twhile(cells[ptr] > 0) {' }
  endLoop () { this.csrc += '\n\t}' }
  print () { this.csrc += '\n\tif(printPtr + 1 > printLen - 1) { char* tmpprint = realloc(print, (printLen + 1)*sizeof(char)); printLen += 1; printPtr += 1; print = tmpprint; print[printPtr] = (char)cells[ptr]; }' }
  flush () { this.csrc += '\n\tfor(int i = 0; i < printLen; i++) { printf("%c", print[i]); } printLen = 1; char* tmpprint = realloc(print, sizeof(char)); print = tmpprint;' }

  compile (reparse) {
    if (this.tokens.length === 0 || reparse) this.parseCode()

    this.cursor = 0

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
        default: this.csrc += '\n}'; finished = true
      }
      this.cursor++
    }

    return this.csrc
  }
}

module.exports = Runtime
