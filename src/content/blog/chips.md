---
title: Chips
pubDate: 2018-02-26
---

’Twas an idle Sunday afternoon, and I was looking for some images of Poker Chips to use on a brewing side project. After a quick search I couldn’t find any that quite fit my imaginary requirements, so as a way to procrastinate any actual work, I decided to make my own.

I found [this neat tutorial](https://design.tutsplus.com/tutorials/how-to-create-a-stack-of-poker-chips--vector-2320/) and went over to [SVG-Edit](https://svg-edit.github.io/svgedit/releases/svg-edit-2.8.1/svg-editor.html) figuring it would be pretty straight forward. After fumbling with the editor for an hour I remembered my fondness to [coding shapes](https://codepen.io/HiroAgustin/pen/Atgic/?editors=0010#0), the chip is just a circle with stripes after all.

```html
<!-- Chip -->
<circle fill="white" stroke="black" cx="100" cy="100" r="89" />
<!-- Large Stripe -->
<circle fill="none" stroke="navy" stroke-width="20" cx="100" cy="100" r="80" />
<!-- Small Stripe -->
<circle fill="none" stroke="navy" stroke-width="5" cx="100" cy="100" r="60" />
```

<p>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="d-block m-auto" width="100%" height="250px">
    <!-- Chip -->
    <circle fill="white" stroke="black" cx="100" cy="100" r="89" />
    <!-- Large Stripe -->
    <circle stroke="navy" stroke-width="20" cx="100" cy="100" r="80" fill="none" />
    <!-- Small Stripe -->
    <circle stroke="navy" stroke-width="5" cx="100" cy="100" r="60" fill="none" />
  </svg>
</p>

We can then use the `stroke-dasharray` attribute on the stripes to match the chip pattern. We want 6 painted sections and 6 white ones on the large stripe and twice as many for the small one. Given the formula to calculate the circumference (2πr) we know each section on the large stripe should be of length 42 (2π × 80 ÷ 12) and 15.7 (2π × 60 ÷ 24) for the small one. To manually tweak the alignment of the dashes we can set the `stroke-dashoffset` value on each stripe.

```html
<!-- Large Stripe -->
<circle
	fill="none"
	stroke="navy"
	stroke-width="20"
	stroke-dasharray="42"
	stroke-dashoffset="20"
	cx="100"
	cy="100"
	r="80"
/>
<!-- Small Stripe -->
<circle
	fill="none"
	stroke="navy"
	stroke-width="5"
	stroke-dasharray="15.7"
	stroke-dashoffset="7"
	cx="100"
	cy="100"
	r="60"
/>
```

<p>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="d-block m-auto" width="100%" height="250px">
    <!-- Chip -->
    <circle fill="white" stroke="black" cx="100" cy="100" r="89" />
    <!-- Large Stripe -->
    <circle fill="none" stroke="navy" stroke-width="20" stroke-dasharray="42" stroke-dashoffset="20" cx="100" cy="100" r="80" />
    <!-- Small Stripe -->
    <circle fill="none" stroke="navy" stroke-width="5" stroke-dasharray="15.7" stroke-dashoffset="7" cx="100" cy="100" r="60" />
  </svg>
</p>

Finally, we want to be able to have multiple chips of different colors. To achieve it, we can leverage SVG’s `symbol` and `use` tags to allow for multiple copies of the same image without duplicating our code. Then using CSS variables we can set the body and stripe color for each chip.

```html
<svg style="display: none;">
	<symbol id="Chip" viewBox="0 0 200 200">
		<!-- Chip -->
		<circle class="Chip__Body" cx="100" cy="100" r="89" />
		<!-- Large Stripe -->
		<circle
			class="Chip__Strip"
			stroke-width="20"
			stroke-dasharray="42"
			stroke-dashoffset="20"
			cx="100"
			cy="100"
			r="80"
		/>
		<!-- Small Stripe -->
		<circle
			class="Chip__Strip"
			stroke-width="5"
			stroke-dasharray="15.7"
			stroke-dashoffset="7"
			cx="100"
			cy="100"
			r="60"
		/>
	</symbol>
</svg>

<svg class="Chip Chip--White">
	<use xlink:href="#Chip" />
</svg>
<svg class="Chip Chip--Red">
	<use xlink:href="#Chip" />
</svg>
<svg class="Chip Chip--Green">
	<use xlink:href="#Chip" />
</svg>
<svg class="Chip Chip--Black">
	<use xlink:href="#Chip" />
</svg>
<svg class="Chip Chip--Blue">
	<use xlink:href="#Chip" />
</svg>
```

The reason why we need to use CSS variables is because of how `use` works. Basically we can’t just write `.Chip--White .Chip__Body` to set the color because that DOM structure doesn’t exist. But by setting the variables in the parent element the values are inherited.

```css
.Chip {
	--strip-color: white;

	&__Body {
		fill: var(--chip-color);
		stroke: black;
	}

	&__Strip {
		fill: none;
		stroke: var(--strip-color);
	}

	&--White {
		--chip-color: white;
		--strip-color: navy;
	}

	&--Red {
		--chip-color: red;
	}
	&--Green {
		--chip-color: green;
	}
	&--Black {
		--chip-color: black;
	}
	&--Blue {
		--chip-color: blue;
	}
}
```

Checkout the Pen [Chips](https://codepen.io/HiroAgustin/pen/YeOEyb/) to see the end result.
