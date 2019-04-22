# ThonkHeck

## What is it?
It's an esolang inspired by BrainFuck.
It is tape based and looks sort of like this:
```
Temp: 0
[0,0,0,0,0,0,0,0,0...]
         ^
```
The main idea is:
You can move the cursor on the tape and add, subtract, divide or multiply cells.
There's some other stuff in there as well, read more in the Tokens section.

## How do i use the included interpreter?
```js
const Runtime = require('./runtime.js')

new Runtime(
	// The code you want to parse, this code prints ABC
	'++++++++++^>++++++*+++++.+.+.|',

	// The function to be called on flush ( | )
	(text) => console.log(text)
).run() // Run it!

```

## What tokens are there?

| Token | What it does                                                                  |
|-------|-------------------------------------------------------------------------------|
| +     | Add one to the current cell                                                   |
| -     | Subtract one from the current cell                                            |
| >     | Move to the next cell                                                         |
| <     | Move to the previous cell                                                     |
| ^     | Clone the current cell to the temp cell                                       |
| *     | Multiply the current cell with the temp cell, outputs to current cell         |
| /     | Divide the current cell with the temp cell, outputs to current cell           |
| [     | Push a new loopback position                                                  |
| ]     | If the current cell is 0, move on. Else: go back to the last loopback         |
| .     | Convert the current cell to a string (UTF-16), push to print buffer and flush |
| \|    | Get the current cell, convert to string (UTF-16), push to the print buffer    |
| @     | Starts and ends comments, everything between is ignored on runtime            |