// LISTEN AND RETRIEVE MESSAGE FROM popup.js 
chrome.runtime.onMessage.addListener((message, sender, response) => {

    if (message.from === "popup.js" && message.type === "RETRIEVE_REDIRECT") {
        (async () => {
            info = {};
            info.title = document.head.querySelector('[property="og:title"]').content; // GET WEBPAGE ARTICLE TITLE
            // console.log(info)
            response(await handleFetchSearch(info.title))
        })();
        return true
    }
})

var handleFetchSearch = async (articleTitle) => {
    response = await fetchSearchResults(articleTitle);
    return response
};

var fetchSearchResults = async (articleTitle) => {
    const headers = {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': 'https://www.bloomberg.com/',
        // 'Access-Control-Allow-Methods': "POST, GET, OPTIONS, DELETE, PUT",
        // 'Header always set Access-Control-Allow-Headers': "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
    }

    try {
        if(articleTitle===undefined || articleTitle===""){
            throw new Error("Error");
        }

        const SearchApiUrl = BNNDIRECT_API_HOST_URL
        const response = await fetch(SearchApiUrl, {
            method: "post",
               headers: headers,

            body: JSON.stringify({
                "title": articleTitle
            })
        })

        if (!response.ok) {
            console.log( "response.status: "+response.status)
            const message = response.status;
            return ({
                success:false,
                statusCode:response.status,
            });
        }

        const data = await response.json();
        console.log("data: " + JSON.stringify(data));
        return (data);
    }
    catch (error) {
        return ({
            success:false,
            statusCode:500,
            error,
        });
    };
}