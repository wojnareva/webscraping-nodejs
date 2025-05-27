import * as cheerio from 'cheerio'; // Import Cheerio for parsing HTML
import axios from 'axios'; // For HTTP requests
import { writeFileSync } from 'fs'; // For writing to files

const url = 'https://knihobot.cz/p';

axios.get(url)  // Send HTTP GET request to the target page
    .then((response) => {
        // Load the HTML response into Cheerio for parsing:
        const $ = cheerio.load(response.data);

        // Initialize an empty array to store the scraped book data:
        const results = [];

        $('.product-list__item').each(function () {
            const item = $(this); // Store the current DOM element context for reuse
            const author = item.find('.ProductItemAuthors_link__Hu64q').text().trim();            
            const title = item.find('.ProductItemLink_root__BYR_c').text().trim();
            const state = item.find('.ProductItemState_root__Y3q3p').text().trim();
            const priceText = item.find('.ProductItemPrice_root__vswyO').text().trim();
            // Remove non-breaking spaces and "Kč", then parse to number:
            const price = parseFloat(priceText.replace(/\s/g, '').replace('Kč', ''));
            const ratingText = item.find('.ProductItemRating_rating__CdLUd').text().trim();   
            // Extract rating text and convert comma to dot:         
            const rating = ratingText ? parseFloat(ratingText.replace(',', '.')) : null;
            const linkPath = item.find('.ProductItemLink_root__BYR_c').attr('href');
            const link = linkPath?.startsWith('http') ? linkPath : 'https://knihobot.cz' + linkPath;

            // Only push the book to results if it has a title (basic filter)
            if (title) {
                // console.log({ author, title, state, price, link });
                results.push({ author, title, state, priceText, price, ratingText, rating, link });
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

