const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', function (req, res) {

    //All the web scraping magic will happen here
    // The URL we will scrape from - in our example Anchorman 2.
    var json = {};
    json.itemArray = [];

    var urlArray = [];
    var siteMap = 'https://www.newegg.com/Info/SiteMap.aspx';
    request(siteMap, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            $('#siteMap').find('a').each(function (index, object) {
                urlArray.push($(this).attr('href'));
            })



            // var url = 'https://www.newegg.com/DailyDeal.aspx?IsNodeId=1&bop=And&Order=ratingNum&name=DailyDeal';
            json.urlArray = urlArray;

            // The structure of our request call
            // The first parameter is our URL
            // The callback function takes 3 parameters, an error, response status code and the html
            for (var i = 0; i < 5; i++) {

                let url = json.urlArray[i];

                request(url, function (error, response, html) {

                    // First we'll check to make sure no errors occurred when making the request

                    if (!error) {
                        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                        var $ = cheerio.load(html);

                        // Finally, we'll define the variables we're going to capture

                        // $('.item-container').each(function (index, obj) {
                        //     json.container.push($(this).html());
                        // });


                        $('.item-info').each(function (index, object) {

                            // Let's store the data we filter into a variable so we can easily see what's going on.
                            var itemObj = {};
                            var data = $(this);

                            // In examining the DOM we notice that the title rests within the first child element of the header tag. 
                            // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                            //title = data.find('.item-title').text();
                            itemObj.name = data.find('.item-title').text();
                            // Once we have our title, we'll store it to the our json object.

                            // json.title = title;

                            var price1 = data.find('.price-current').find('strong').text();
                            var price2 = data.find('.price-current').find('sup').text();
                            itemObj.price = '$' + price1 + price2;
                            // json.price = price;
                            json.itemArray.push(itemObj);
                            console.log(index);
                        })
                    }
                    // To write to the system we will use the built in 'fs' library.
                    // In this example we will pass 3 parameters to the writeFile function
                    // Parameter 1 :  output.json - this is what the created filename will be called
                    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
                    // Parameter 3 :  callback function - a callback function to let us know the status of our function


                })
            }
        }
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send("Hey! Check your output file!");
    })

});

app.listen('8080')

console.log('Magic happens on port 8080');

exports = module.exports = app;