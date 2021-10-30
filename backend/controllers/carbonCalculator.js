const nodeParser = require("node-html-parser");
var parse = nodeParser.parse;
var axios = require("axios");
var qs = require("qs");
var variables = require("../misc-string-data/carbon-calculator-variables");

//Function that takes in number of kilometers as it's argument and returns
// Total Car Footprint in tonnes of CO2e
module.exports.calculate = async (req, res) => {
  var distance = req.body.distance;
  if (!distance) {
    res.send(400, "'distace' parameter undefined");
  }
  var data = qs.stringify({
    rtsCalc_ClientState:
      '{"selectedIndexes":["3"],"logEntries":[],"scrollState":{"-1":18}}',
    ctl05$cdsCar$txtMileage: distance,
    ctl05$cdsCar$ddlMileageUnit: "1",
    ctl05$ddlCarDerivative: variables.carDerivative,
    ctl05$btnAddCar: "Calculate",
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __LASTFOCUS: "",
    __VIEWSTATE: variables.viewstate,
    __VIEWSTATEGENERATOR: "10DAA136",
  });
  var config = {
    method: "post",
    url: "https://calculator.carbonfootprint.com/calculator.aspx?tab=4",
    headers: {
      authority: "calculator.carbonfootprint.com",
      "cache-control": "max-age=0",
      "upgrade-insecure-requests": "1",
      origin: "https://calculator.carbonfootprint.com",
      "content-type": "application/x-www-form-urlencoded",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "sec-gpc": "1",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      referer: "https://calculator.carbonfootprint.com/calculator.aspx?tab=4",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      cookie:
        "CFp4Session=; CFp4CookieCheck=OK; CFp3TextSize=0.8em; CFpAffiliate=RADsite; CFp4Session=tfyqrgq5rtxlar3uujuljcii; CFpAffiliate=RADsite",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      var htmlElement = parse(response.data);
      var lblTotalSpan = htmlElement.querySelector("#lblTabTotal");
      var emmissionValue = lblTotalSpan.innerText
        .split(/(\s+)/)
        .filter(function (e) {
          return e.trim().length > 0;
        })[4];
      console.log(emmissionValue);
      res.send(200, {
        "emmision-value": Math.max(0.01, emmissionValue),
        "baby-trees-saved": Math.max(0.01, emmissionValue) / 0.06,
        "annual-trees-saved": (Math.max(0.01, emmissionValue) / 0.06) * 365,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};
