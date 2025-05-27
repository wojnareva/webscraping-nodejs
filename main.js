import * as cheerio from 'cheerio';
import axios from 'axios';

const url = 'https://knihobot.cz/p';

axios.get(url)
    .then((response) => {
        const $ = cheerio.load(response.data);

        $('.product-list__item').each(function () {
            const item = $(this);
            const author = item.find('ul[class*="ProductItemAuthors"] a').first().text().trim();
            const title = item.find('.ProductItemLink_root__BYR_c').text().trim();
            const state = item.find('span[class*="ProductItemState"]').text().trim();
            const price = item.find('.ProductItemPrice_root__vswyO').text().trim();
            const linkPath = item.find('.ProductItemLink_root__BYR_c').attr('href');
            const link = linkPath?.startsWith('http') ? linkPath : 'https://knihobot.cz' + linkPath;

            if (title) {
                console.log({ author, title, state, price, link });
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching the page:', error.message);
    });