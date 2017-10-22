const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', function (req, res) {

    var json = {};
    json.itemArray = [];
    json.pageCounter = 0;

    try {
        function scrape() {
            return new Promise((resolve, reject) => {
                // function loop(json) {
                for (var i = 1; i < 20; i++) {
                    // let url = json.urlArray[i];
                    // var i = 1;
                    // var url = `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&N=-1&IsNodeId=1&Description=i7&bop=And&Page=${i}&PageSize=96&order=BESTMATCH`;
                    // var url = 'https://www.newegg.com/Weekend-Deals/EventSaleStore/ID-969';
                    // var url = `https://www.newegg.com/Weekend-Deals/EventSaleStore/ID-969/Page-${i}?PageSize=96&order=BESTMATCH`;
                    var url = `https://www.newegg.com/Internal-SSDs/SubCategory/ID-636/Page-${i}?Tid=11693&PageSize=96&order=BESTMATCH`
                    //var url = `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&N=-1&IsNodeId=1&Description=all&bop=And&Page=${i}&PageSize=96&order=BESTMATCH`

                    function loop(url) {

                            request(url, function (error, response, html) {
                                // First we'll check to make sure no errors occurred when making the request
                                if (error){
                                    console.log(error);
                                }
                                else {
                                    // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                                    var $ = cheerio.load(html);
                                    json.pageCounter++;

                                    $('.item-info').each(function (index, object) {

                                        var itemObj = {};
                                        var data = $(this);

                                        itemObj.name = data.find('.item-title').text();

                                        var price1 = data.find('.price-current').find('strong').text();
                                        var price2 = data.find('.price-current').find('sup').text();
                                        itemObj.price = '$' + price1 + price2;
                                        json.itemArray.push(itemObj);

                                    })
                                    if (json.pageCounter = 19) {
                                        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
                                            console.log('File successfully written! - Check your project directory for the output.json file');
                                            resolve();
                                        })

                                    }
                                }
                            })
                    }
                    setTimeout(loop, 2000, url)
                }
            })
        }
        scrape()
        .then(data => {
            res.json({ "result": "Hey! Check your output file!",
             "data": json})
        })
        .catch(err => {
            console.log(err);
        })
        

    } catch (err) {
        console.log(err);
        res.send(err);
    }

});

app.listen('8080')

console.log('Magic happens on port 8080');

exports = module.exports = app;