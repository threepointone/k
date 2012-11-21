k
-------

the beginnings of a new build system. ish. or something. 

for now, figuring out a clean task system

```js
var o = k({
	base: './',		// base src folder. use .filter() to narrow it down from here
	dest: 'build'	// base destination folder
					// send whatever you'd like, they'll be available on this.config
});

o.init(cb)			// resolves filenames

o.task(name, fn)	// define a new task. the task will be available on o. 
```
see tasks.js for available tasks.

coming up
---------
- an api based on deferreds
- analysis tasks
- full fledged examples