k
-------
control your build system.

*blurb*
Build systems, at its core, are: 
- simple task systems 
- most of which deal with files as inputs

We can take these two ideas and make a simple dsl in javascript using deferreds. With A simplified convention, and a set of basic tasks, we can do common 'build-system'-y stuff double quick!

So there're these objects, right? These objects represent sets of files. 

A set of files. Let that sink in. 

So you can do stuff on these sets. You do this by defining behaviors, or `task`s, with functions that accept callbacks. `k` takes care of the rest, wiring it up to your 'file sets', and executing it in order. You can change the nature of the files by changing the value of `this.files` during your `task`s.

Btw, a 'file' is a simple hash. Looks sorta like this - 
```js
{
    src: 'lib/jquery.js',
	content: '...'
	dest: 'dist/lib/jquery.min.js'
}
```
So when you're making a task, you'd want to to mess with `this.files`, and change the `.content`, or `.dest`, or even add new files to be written on the next pass of `.write()`

NB: `file.content` stays blank until you run `k().read()`

see `tasks.js` for available tasks.
edit `script.js` for doodling

```js
var o = k({
	src: './',		// src folder, use .filter() to narrow it down from here. defaults to ./
	dest: 'build'	// destination folder. defaults to ./dist
					// send whatever else you'd like, they'll be available on this.config
});
```

```js
k.task(name, fn)	// define a new task. the task will be available on all k() instances.
```


*tests*
`npm test`

*coverage report*
`npm run-script coverage`


coming up
---------
- set, get environment variables
- an api based on deferreds
- analysis tasks
- full fledged examples