// const cheerio = require("cheerio");
import * as cheerio from 'cheerio';
import axios from 'axios';

axios.get('https://www.slovensky.eu/slova-na-5-pismen/')
    .then((response) => {
        const $ = cheerio.load(response.data);
        $('#searchresults li a').each(function(){
            console.log($(this).text());
        });
    })
    .catch((error) => {
        console.log('error');
    })
    .then(() => {

    });