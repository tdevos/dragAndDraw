dragAndDraw
===========

This jQuery plugin allow you to draw div on "click and drag"

How to use ? 
------------

Simply like this : 

<pre>
$(".drawSpace").dragAndDraw();
</pre>

Some options can be added : 

<pre>
$(".drawSpace").dragAndDraw({
  grid : [20,20],
  top : 50,
  left : 35,
  width : 100,
  height : 50,
  start: function(container, createdDiv),
  stop: function(container, createdDiv),
  class: "some class names"
});
</pre>
