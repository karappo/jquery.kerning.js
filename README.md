# Kerning

The jQuery kerning plugin specific with Japanese webfont.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/karappoinc/jquery.kerning.js/master/dist/jquery.kerning.min.js
[max]: https://raw.github.com/karappoinc/jquery.kerning.js/master/dist/jquery.kerning.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="jquery.kerning.min.js"></script>
<script>
jQuery(function($) {
  $.getJSON("kerning-data.json" , function(_data) {
    $('h1').kerning({"data":_data});
  });
});
</script>
<h1>美しい文字</h1>
```

## Examples / Documentation
[http://karappoinc.github.io/jquery.kerning.js/](http://karappoinc.github.io/jquery.kerning.js/)


## Code Status

[![Build Status](https://travis-ci.org/KarappoInc/jquery.kerning.js.png?branch=master)](https://travis-ci.org/KarappoInc/jquery.kerning.js)


## Release History

- v0.1.1 : Change data format simpler.
- v0.1.0 : First release.
