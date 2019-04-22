const Runtime = require('./runtime.js')
new Runtime(
  // The code you want to parse, this code prints ABC
  '++++++++++^>++++++*+++++|+|+.>+++[<.->-]',

  // The function to be called on flush ( | )
  (text) => console.log(text)
).run() // Run it!

const fs = require('fs')
const Compile = require('./compile.js')
fs.writeFileSync('./thonkheck.c',
  new Compile(
    // The code you want to parse, this code prints ABC
    '++++++++++^>++++++*+++++|+|+.>+++[<.->-]'
  ).compile()
)
