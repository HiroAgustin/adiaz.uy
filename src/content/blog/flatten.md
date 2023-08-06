---
title: Flatten
pubDate: 2018-02-09
---

Every other interview I’m asked to implement a `flatten` function that receives an array and returns a flattened version of it. They may request different ways to handle edge cases, but my usual answer is in the lines of…

```js
function flatten(collection = []) {
	let result = [];

	collection.forEach((item) => {
		if (Array.isArray(item)) result = result.concat(flatten(item));
		else result.push(item);
	});

	return result;
}
```

Are there better ways to do it? [Definitely](http://underscorejs.org/docs/underscore.html#section-56), but at an early interview stage this is usually good enough.

I’m still glad this comes up more often than implementing `mergeSort`.
