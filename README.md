# BNNDirect ![alt text](https://github.com/weiliang8/BNNDirect/blob/master/assert/icons/icon32.png "BNNDirect")

<img src="https://github.com/weiliang8/BNNDirect/blob/master/assert/sample_video_speed_1_5_canva.gif" width="700">

BNNDirect is a Chrome extension designed to streamline the process of accessing articles from Bloomberg on BNNBloomberg's platform. With just one click, users can seamlessly redirect from a Bloomberg article to its corresponding one on BNNBloomberg. This extension aims to enhance the reader's experience by eliminating the need to navigate paywalls, thereby facilitating uninterrupted reading and saving valuable time

## About Bloomberg and BNNBloomberg
* Bloomberg is a  online platform renowned for providing up-to-date global news covering financial markets, business, technology, and politics. Widely utilized in financial services, Bloomberg requires a subscription for access to its articles
* BNNBloomberg offers similar content to Bloomberg but provides it for free, making it an attractive alternative for those seeking financial news without subscription barriers
* BNNDirect bridges the gap between these platforms, offering users a convenient solution for accessing Bloomberg articles on BNNBloomberg effortlessly

## Features
1. BNNDirect simplifies the process of accessing Bloomberg articles on BNNBloomberg with a single click, ensuring a smooth transition between platforms
2. By bypassing paywalls, BNNDirect ensures easy access to Bloomberg content on BNNBloomberg, enhancing the overall accessibility of financial news
3. Users can save time by seamlessly accessing articles without the hassle of subscription requirements, allowing for a more efficient reading experience



## How the chrome extension works?
Written in Javascript and Chrome Extension Manifest V3<br><br>
``background.js``
* Run continuously in the background, interacting with the Chrome browser by monitoring Chrome events
* Comprises events triggered when the user navigates to a new URL or changes tabs. After either event occurs, it checks the current website URL and updates the popup UI accordingly

``contentScript.js``
* Run within the context of the webpage, enabling access to and modification of the webpage's DOM
* Listens and responds to messages from popup.js, sending requests to the  [BNNDirect_API](https://github.com/weiliang8/BNNDirect_API/) to retrieve the corresponding BnnBloomberg article

``popup.js``
* Executes when the extension's popup window is opened
* Waits for the page DOM to be fully loaded, including all deferred scripts, and updates the popup UI based on the webpage
* Communicates with contentScript.js to send a request to [BNNDirect_API](https://github.com/weiliang8/BNNDirect_API/tree/main) to retrieve the corresponding BnnBloomberg article.

## Installation
1. Download the main repository as zip file and unzip it
2. Replace ``BNNDIRECT_API_HOST_URL`` in ContentScript.js line 33 with ypur BNNDirect_API Host URL that return the result URL to be redirected to
3. Open your Chrome browser and go to ``chrome://extensions/``
4. Turn on developer mode by toggling the button located at the top right of the page
5. Click load unpacked to upload the unzipped folder
6. Chrome extension's plugin will shows in both the main page and on the toolbar and ready to use

## Contributor
* [Wei Liang](https://www.linkedin.com/in/chee-wei-liang/) Developer (Chrome Extension and Backend API) <br>
* [Sherman](https://www.linkedin.com/in/shermannntan/) Designer (Chrome Extension UI)




