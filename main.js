import * as cheerio from 'cheerio';
import axios from 'axios';
import { writeFileSync } from 'fs';

const url = 'https://knihobot.cz/p';

axios.get(url)  // Send HTTP GET request to the target page
    .then((response) => {
        // Load the HTML response into Cheerio for parsing
        const $ = cheerio.load(response.data);

        // Initialize an empty array to store the scraped book data
        const results = [];

        $('.product-list__item').each(function () {
            const item = $(this); // Store the current DOM element context for reuse
            const author = item.find('ul[class*="ProductItemAuthors"] a').first().text().trim();
            const title = item.find('.ProductItemLink_root__BYR_c').text().trim();
            const state = item.find('span[class*="ProductItemState"]').text().trim();
            const price = item.find('.ProductItemPrice_root__vswyO').text().trim();
            const linkPath = item.find('.ProductItemLink_root__BYR_c').attr('href');
            const link = linkPath?.startsWith('http') ? linkPath : 'https://knihobot.cz' + linkPath;

            // Only push the book to results if it has a title (basic filter)
            if (title) {
                // console.log({ author, title, state, price, link });
                results.push({ author, title, state, price, link });
            }
        });

        // Output total number of books found
        console.log(`Total books scraped: ${results.length}`);

        // Save the results to a JSON file
        // JSON.stringify(...):
        // - results: the array of book objects
        // - null: no custom replacer function (not needed here)
        // - 2: pretty-print with 2-space indentation for readability
        // writeFileSync(...):
        // - 'books.json': target filename
        // - 'utf-8': ensures the file is written using UTF-8 encoding (important for accented characters)
        writeFileSync('books.json', JSON.stringify(results, null, 2), 'utf-8');
    })
    .catch((error) => { // Handling errors with Axios
        console.error('Error fetching the page:', error.message);
    });

