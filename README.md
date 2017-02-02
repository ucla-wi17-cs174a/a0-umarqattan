## Synopsis

What the student had to do to complete Assignment #1 is create a grid of 8 cubies of varying color (excluding white and black) on a 960x540 canvas. Extra credit is offered for those students who went *above and beyond*. This includes implementing the following:

* 1. Instance each of the eight cubes from the same geometry data
* 2. Implement the cube geometry as a single triangle strip primitive
* 3. Implement your navigation system using quaternions
* 4. Smoothly, continuously, and individually rotate and scale each of the cubies while the application is running.

* Of the four extra credit opportunities, all four were attempted and they are labeled with [Extra Credit #x] where 'x' is the extra credit opportunity.

## How to Read cubies.js file

The requirements to this assignment include 11 parts. Each requirement has been implemented through index.html and cubies.js files. Comments made throughout these files indicate that it's implemented with comments above the corresponding code through the index.html and cubies.js files.



## Motivation

There is not much else to say other than that I learned how to implement the rendering 3-dimensional objects (cubes) efficiently (using a single cube instance) with the ability to scale (oscillate in size by 20% using sin(angle) and rotate at 20RPM. 

## Installation

git clone https://github.com/ucla-wi17-cs174a/a0-umarqattan.git

## API Reference

THREE.js

## Tests

Simply open the index.html file from the directory containing cubies.js, index.html, initShaders.js, MV.js, and webgl-utils.js.

