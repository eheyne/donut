#  donut [![Build Status](https://travis-ci.org/eheyne/donut.svg?branch=master)](https://travis-ci.org/eheyne/donut)

## Overview
This repo contains a way to show data in a donut type graph.

## Installation
To start using this repo, run `npm install` to pull down all the npm modules that are used.

## Commands
All commands are run using npm commands.  The following commands are available:

To run the tests:  `npm test`

To run the tests continuously as you make changes: `npm run keepalivetest

To serve a demo page: `npm run serve`

To run jshint: `npm run lint`

To clean the .tmp folder: `npm run clean`

## How to use
In your HTML define the elements that you would like to take on the donut behavior.

Examples:

```html
<div id="test" class="donuts" style="width: 50px; height: 50px"></div>
<div class="donuts" style="width: 100px; height: 100px"></div>
<div class="donuts" style="width: 500px; height: 500px"></div>

```

In JavaScript call the `Donut` plugin on the selector of your choice.

Examples:

``` javascript
var donuts = $('.donuts').donut({ total: 125, data: 25 });

```

or

```javascript
var donuts = $('.donuts').donut({ data: [25, 25, 25, 25] });

```

or

```javascript
var donuts = $('.donuts').donut({ total: 125, data: [25, 25, 25, 25] });

```

note: The examples above show 3 different forms of data that can be passed into the Donut plugin.

## Options
The following options are available:

* click - Specify a click event handler

Possible click configuration options:

``` javascript
function clickEventHandler() { 
  console.log("SVG element " + event.target.getAttribute('id') + " clicked!"); }

var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], click: clickEventHandler });
```

* hover - Specify the mouseEnter and mouseLeave event handlers

Possible hover configuration options:

``` javascript
var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], hover: mouseEnter });
var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], hover: [mouseEnter] });
var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], hover: [undefined, mouseLeave] });
var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], hover: [mouseEnter, mouseLeave] });
```

* animate - slowly draw the paths from start to finish, with the ability to control speed of draw

Possible animate configuration options:

``` javascript
var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], animate: true }); // default to 1s animation
```

or to control the length of the animation (5 seconds)

``` javascript
var donuts = $('.donuts').Donut({ total: 125, data: [25, 25, 25, 25], animate: '5s' });
```

