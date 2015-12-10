# Kerning

The jQuery kerning plugin specific with Japanese webfont.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/karappo/jquery.kerning.js/master/dist/jquery.kerning.min.js
[max]: https://raw.github.com/karappo/jquery.kerning.js/master/dist/jquery.kerning.js

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
[http://karappo.github.io/jquery.kerning.js/](http://karappo.github.io/jquery.kerning.js/)


## Code Status

[![Build Status](https://travis-ci.org/karappo/jquery.kerning.js.svg?branch=master)](https://travis-ci.org/karappo/jquery.kerning.js.svg?branch=master)


## Release History

- v0.3.1 : Fix collapse style issue
- v0.3.0 : Support direct json file specification, initializing with [data-kening]
- v0.2.2 : A few update for bower
- v0.2.1 : Regist to bower
- v0.2.0 : destroy feature, repeat kerning, data extending
- v0.1.1 : Change data format simpler.
- v0.1.0 : First release.
