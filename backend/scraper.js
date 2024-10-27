const axios = require('axios');
const cheerio = require('cheerio');

const scrapeJobs = async () => {
  const url = 'https://www.indeed.com/q-software-developer-jobs.html'; // Example URL
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  const jobs = [];
  
  $('.jobsearch-SerpJobCard').each((index, element) => {
    const title = $(element).find('.jobTitle').text(); // Selector for job titles on Indeed
    jobs.push({ id: index + 1, title });
  });
  
  return jobs;
};

module.exports = scrapeJobs;
