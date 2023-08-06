---
title: Hash
pubDate: 2018-02-21
---

Continuing the interview questions thread, a while back I was presented with a fun take-home assignment:

> Write JavaScript code to find a 9 letter string of characters that contains only letters from: ‘acdegilmnoprstuw’ such that `hash(the_string)` is 956446786872726.

```js
function hash(alphabet, s) {
	let h = 7;

	for (let i = 0; i < s.length; i++) h = h * 37 + alphabet.indexOf(s[i]);

	return h;
}
```

---

I needed to find a string that, given this hashing algorithm, would return a specific number. Therefore, I had to build a `decrypt` method that would reverse the encryption, so I could pass in the number and get the string.

Looking at the algorithm you can see the interval between each letter is composed of the previous number multiplied by 37 plus the index of the letter in the alphabet.

By decreasing `helper` until it was a multiple of 37 I was able to find that difference. Once I knew the index of the letter, I just prepended it to the resulting string.

All that remained to do then was to divide `number` by 37 and repeat until I hit the initial value of 7. And of course, turn the array into a string.

```js
function decrypt(alphabet, number) {
	const result = [];
	let helper = number;

	while (number !== 7) {
		while (helper % 37 !== 0) helper--;

		result.unshift(alphabet[number - helper]);

		number = helper /= 37;
	}

	return result.join("");
}
```
