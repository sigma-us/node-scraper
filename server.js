const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', function (req, res) {

    var json = {};
    json.itemArray = [];
    json.urlArray = [];

    var siteMap = 'https://www.newegg.com/Info/SiteMap.aspx';
    try {
        // request(siteMap, function (error, response, html) {
        //     if (!error) {
        //         var $ = cheerio.load(html);
        //         $('#siteMap').find('a').each(function (index, object) {
        //             json.urlArray.push($(this).attr('href'));
        //         })
        //         fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
        //             console.log('File successfully written! - Check your project directory for the output.json file');
        //         })
        //         res.send("Hey! Check your output file!");
        //     }
        // })



        // setTimeout(loop(json), 10000);

        // function loop(json) {
        for (var i = 1; i < 4; i++) {
        // let url = json.urlArray[i];
        // var i = 1;
        // var url = `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&N=-1&IsNodeId=1&Description=i7&bop=And&Page=${i}&PageSize=96&order=BESTMATCH`;
        // var url = 'https://www.newegg.com/Weekend-Deals/EventSaleStore/ID-969';
        var url = `https://www.newegg.com/Weekend-Deals/EventSaleStore/ID-969/Page-${i}?PageSize=96&order=BESTMATCH`;
        request(url, function (error, response, html) {
            // First we'll check to make sure no errors occurred when making the request
            if (!error) {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                $('.item-info').each(function (index, object) {

                    // Let's store the data we filter into a variable so we can easily see what's going on.
                    var itemObj = {};
                    var data = $(this);

                    // In examining the DOM we notice that the title rests within the first child element of the header tag. 
                    // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                    itemObj.name = data.find('.item-title').text();


                    var price1 = data.find('.price-current').find('strong').text();
                    var price2 = data.find('.price-current').find('sup').text();
                    itemObj.price = '$' + price1 + price2;
                    json.itemArray.push(itemObj);

                })
                fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
                    console.log('File successfully written! - Check your project directory for the output.json file');
                })
            }
        })
    }
    res.send("Hey! Check your output file!");
        // }

        // }
        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.

    } catch (err) {
        console.log(err);
        res.send(err);
    }

});

app.listen('8080')

console.log('Magic happens on port 8080');

exports = module.exports = app;