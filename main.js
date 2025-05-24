import * as cheerio from 'cheerio';
import axios from 'axios';

const url = 'https://knihobot.cz/';

axios.get(url)
    .then((response) => {
        const $ = cheerio.load(response.data);

        $('.swiper-slide').each(function () {
            const author = $(this).find('ul[class*="ProductItemAuthors"] a').first().text().trim();
            const title = $(this).find('.ProductItemLink_root__BYR_c').text().trim();
            const state = $(this).find('span[class*="ProductItemState"]').text().trim();
            const price = $(this).find('.ProductItemPrice_root__vswyO').text().trim();
            const linkPath = $(this).find('.ProductItemLink_root__BYR_c').attr('href');
            const link = linkPath?.startsWith('http') ? linkPath : 'https://knihobot.cz' + linkPath;

            if (title) {
                console.log({ author, title, state, price, link });
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching the page:', error.message);
    });