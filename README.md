# SahnaS Web Widget

This is a reference project that demonstrate how to build web UI widget that can be embedded into 3rd party website.

This structure provides those advantages:

* Small footprint and solid snippet on hosting website (see [usage](#usage))
* Multi-instance on the same page
* Isolation of code execution and CSS
* Customization via configuration injection and API to Widget
* Minimal dependencies and small size via single request (>30KB gzipped)

and a few more.

## Usage

In order to embed the widget add the following snippet at any location on the hosting page:

```html
<script>
    (function (w, d, s, o, f, js, fjs) {
        w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
    }(window, document, 'script', 'sahnas', 'https://www.comexposium.com/sahnas.min.js'));
    sahnas('init');
</script>
```

During initialization you can pass additional configurations to widget like so:

```javascript
sahnas('init', { minimized: false, disableDarkMode: false, styles: { classNameContainer: "sahnas" } });
```

You can find a full list of configurations in `AppConfigurations` interface:

``` javascript
{
    debug: boolean;
    serviceBaseUrl: string;
    minimized: boolean;
    disableDarkMode: boolean;
    text: {
        minimizedTitle?: string;
        formTitle?: string;
        formSubTitle?: string;
        thankYouTitle?: string;
        thankYouBody?: string;
        faqTitle?: string;
    };
    styles: {
        classNameContainer?: string;
    };
}
```

## Develop

The widget dev setup is similar to regular client application. To get started:

```bash
npm i
npm start
npm run go
```

This will open browser with a demo page which hosts the widget.
The `npm run go` command is the same command as `npm start` but it will run the dev server on port 9000.

## License

The source and documentation in this project are released under the [MIT License](LICENSE)
