const mainUrl = "bloomberg.com";
const targetUrl = "bnnbloomberg.ca"
const articlePath = ["news/articles", "opinion/articles", "news/newsletters", "news/features", "news/storythreads","en/news"];

function checkArticleUrl(url) {
    for (path of articlePath) {
        if (url.includes(path)) { // CHECK IF URL MATCHES WITH ANY ARTICLE PATH
            return true;
        }
    }
    return false;
}

function toggleStatusIcon(iconNum, state) {
    const loader = '.loader-' + iconNum;
    const mark = '.mark-' + iconNum;

    if (state === 2) { // LOADING STATE
        $(loader).toggleClass('pending');
        pending = false;
    } else if (state === 3) { // COMPLETE STATE
        $(loader).toggleClass('load-complete');
        $(loader + '.initial-state').toggleClass('initial-state');
        $(mark).toggle();
    }
}

const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

document.addEventListener("DOMContentLoaded", () => { // WAIT FOR DOM TO BE FULLY LOADED
    (async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        var url = tab.url;
        console.log(url)

        //IN bloomberg.com ARTICLE
        if (url.includes(mainUrl) && checkArticleUrl(url)) {

            //PHASE-1
            toggleStatusIcon(1, 2);/*toggleStatusIcon(iconNum, phase)*/
            await wait(1000);
            toggleStatusIcon(1, 3)

            //PHASE-2
            document.getElementById("header-3").innerText = "Finding article on BNNBloomberg";
            toggleStatusIcon(2, 2)
            await wait(1000);

            // COMMUNICATE WITH contentSCript.js BY SENDING MESSAGE TO GET RESULT FROM API AND WAIT FOR RESULT
            const response = await chrome.tabs.sendMessage(tab.id, {
                from: "popup.js",
                type: "RETRIEVE_REDIRECT"
            });

            if (response.success === true) { //SUCCESSFUL REQUEST
                console.log("API Response: Success!")
                console.log(response.result.title + " " + response.result.url)
                toggleStatusIcon(2, 3)

                if (response.titleAccuracy <= 60) {
                    var innerBody = document.getElementById('inner-body');
                    innerBody.innerHTML = '<object style="height: 65px" type="text/html" data="../layout/popup_error.html"></object>';

                    // Wait for the content to be fully loaded
                    var objectElement = innerBody.querySelector('object');
                    objectElement.addEventListener('load', function () {
                        var header3Element = objectElement.contentDocument.getElementById('header-3');
                        var text1Element = objectElement.contentDocument.getElementById('text-1');

                        header3Element.innerHTML = 'Oops! Article Match Not Found &#128373';
                        text1Element.innerHTML = "We couldn't locate an identical article on<br>BNNBloomberg. Please refresh your website or <br>try another Bloomberg article."
                    });
                }
                else {
                    //PHASE-3
                    document.getElementById("header-3").innerText = "Article found! Anytime now...";
                    toggleStatusIcon(3, 2)
                    await wait(1000);
                    toggleStatusIcon(3, 3);
                    await wait(2000);
                    chrome.tabs.create({ url: response.result.url });
                }
            } else { //FAILED REQUEST
                console.log("API Response: Failed!")
                console.log(JSON.stringify(response))

                document.body.style.height = "78px"
                const statusCode = response.statusCode
                var statusText = "";
                if (statusCode === 400) {
                    statusText = "Bad Request"
                } else if (statusCode === 500) {
                    statusText = "Internal Server Error"
                } else if (statusCode === 503) {
                    statusText = "Service Unavailable"
                }

                // Set div innerbody of popup.html to popup_error.html
                var innerBody = document.getElementById('inner-body');
                innerBody.innerHTML = '<object style="height: 100%" type="text/html" data="../layout/popup_error.html"></object>';

                // Wait for the content to be fully loaded
                var objectElement = innerBody.querySelector('object');
                objectElement.addEventListener('load', function () {
                    var errorCodeElement =
                        objectElement.contentDocument.getElementById('error-code');
                    errorCodeElement.innerText = `Error: ${statusCode} ${statusText}`;
                });
            }

        } else if (url.includes(targetUrl)) {
            document.getElementById("header-3").innerHTML = "You're on BNNBloomberg &#128079";
            document.getElementById("text-1").innerText = "You've bypassed the paywall maze. Enjoy\nunrestricted access to Bloomberg News!";
        }
    })().catch((err) => { console.log(err) });
});