Cu.import("resource://gre/modules/MatchPattern.jsm");
Cu.import("resource://gre/modules/BrowserUtils.jsm");

/*! onloadCSS. (onload callback for loadCSS) [c]2017 Filament Group, Inc. MIT License */
/* global navigator */
/* exported onloadCSS */
function onloadCSS( ss, callback ) {
    var called;
    function newcb(){
        if( !called && callback ){
            called = true;
            callback.call( ss );
        }
    }
    if( ss.addEventListener ){
        ss.addEventListener( "load", newcb );
    }
    if( ss.attachEvent ){
        ss.attachEvent( "onload", newcb );
    }

    // This code is for browsers that don’t support onload
    // No support for onload (it'll bind but never fire):
    //	* Android 4.3 (Samsung Galaxy S4, Browserstack)
    //	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
    //	* Android 2.3 (Pantech Burst P9070)

    // Weak inference targets Android < 4.4
    if( "isApplicationInstalled" in navigator && "onloadcssdefined" in ss ) {
        ss.onloadcssdefined( newcb );
    }
}


/* exported loadCSS */
var loadCSS = function( href, before, media ){
    // Arguments explained:
    // `href` [REQUIRED] is the URL for your CSS file.
    // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
    // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
    // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
    var doc = window.document;
    var ss = doc.createElement( "link" );
    var ref;
    if( before ){
        ref = before;
    }
    else {
        var refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
        ref = refs[ refs.length - 1];
    }

    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    ss.media = "only x";

    // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
    function ready( cb ){
        if( doc.body ){
            return cb();
        }
        setTimeout(function(){
            ready( cb );
        });
    }
    // Inject link
    // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
    // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    ready( function(){
        ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
    });
    // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
    var onloadcssdefined = function( cb ){
        var resolvedHref = ss.href;
        var i = sheets.length;
        while( i-- ){
            if( sheets[ i ].href === resolvedHref ){
                return cb();
            }
        }
        setTimeout(function() {
            onloadcssdefined( cb );
        });
    };

    function loadCB(){
        if( ss.addEventListener ){
            ss.removeEventListener( "load", loadCB );
        }
        ss.media = media || "all";
    }

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    if( ss.addEventListener ){
        ss.addEventListener( "load", loadCB);
    }
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined( loadCB );
    return ss;
};
// // commonjs
// if( typeof exports !== "undefined" ){
//     exports.loadCSS = loadCSS;
// }
// else {
//     w.loadCSS = loadCSS;
// }




/**
 * Created by yoann on 21/06/17.
 */
function logURL(requestDetails) {
    console.log("Loading: -- " + requestDetails.url);

    // var container = document.getElementsByClassName("container");
    // for(i = 0; i < container.length; i++) {
    //     console.log(" - ");
    //     container[i].style.width = "calc(100% - 15px)";
    // }
    //
    // var repo = document.getElementsByClassName("repository-with-sidebar");
    // for(i = 0; i < repo.length; i++) {
    //     console.log(" - ");
    //     var repoContent = repo.getElementsByClassName("repository-with-sidebar");
    //
    //     for(i = 0; i < repoContent.length; i++) {
    //         repoContent[i].style.width = "calc(100% - 45px)";
    //     }
    // }

    // var para = document.createElement("style");
    // var node = document.createTextNode(".container {width: calc(100% - 15px);} .repository-with-sidebar .repository-with-sidebar {width: calc(100% - 45px);");
    // para.appendChild(node);
    // document.getElementsByTagName("head")[0].appendChild(para);
    console.log("STYLE");

    // We need to exclude https://github.com/yoannrenard/wide-github/blob/v2/main.css
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Match_patterns#Testing_match_patterns

    var stylesheet = loadCSS( "https://github.com/yoannrenard/wide-github/blob/v2/main.css" );
    onloadCSS( stylesheet, function() {
        console.log( "Stylesheet has loaded." );
    });
}

browser.webRequest.onCompleted.addListener(
    logURL,
    {urls: [
        "*://*.github.com/*/compare/*",
        "*://*.github.com/*/commit/*",
        "*://*.github.com/*/pull/[0-9]*/files",
        "*://*.github.com/*/blob/*"
    ]}
);
