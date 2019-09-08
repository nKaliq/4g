var addFormListener =  window.attachEvent||window.addEventListener;
addFormListener("message", receiveMessage, false);
window.messages = 0;
function receiveMessage(event)
{
    try
    {
        switch(event.data.message_type){
            case 'style':
                var style = document.createElement("style");
                style.type = "text/css";
                try {
                    style.innerHTML = decodeURIComponent(event.data.message_content);
                }
                catch (ex) {
                    style.styleSheet.cssText = decodeURIComponent(event.data.message_content);  // IE8 and earlier
                }
                document.head.appendChild(style);
            break;
            case 'font':
                var url = (event.data.message_content).replace(/^https?:\/\//,'');
                var font = document.createElement("link");
                font.rel = 'stylesheet';
                font.href = '//' + url;
                document.head.appendChild(font);
            break;
        }
    }
    catch (e)
    {
    }
}

addFormListener('load', function(){

    function init() {

        if (!(window.$ || window.jQuery || window.$x)) {
            setTimeout(init, 50);
            return;
        }

        (function (jQuery) {
            jQuery(document).ready(function () {
                jQuery(document).on('mousewheel DOMMouseScroll', function (event) {
                    sendScrollIframeMessage();
                });

                jQuery(document).keydown(function (e) {
                    switch (e.which) {
                        case 38: // up
                        case 40: // down
                            sendScrollIframeMessage();
                            break;
                        default:
                            return; // exit this handler for other keys
                    }
                });

                function sendScrollIframeMessage() {
                    if ('parentIFrame' in window) {
                        try {
                            window.parent.postMessage({message_type: 'event', message_content: 'scrollIframe'}, '*');
                        } catch (e) {
                        }
                    }
                }
            });
        })(window.$ || window.jQuery || window.$x);

    }

    init();

}, false);
