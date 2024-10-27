// backend/src/controllers/jobController.js
const axios = require("axios");
const cheerio = require("cheerio");

const getJobs = async (req, res) => {
   try {
      const jobs = await scrapeJobs(req.query);
      res.json(jobs);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
   }
};

const scrapeJobs = async (filters) => {
   const jobs = [];
   const jobPortals = [
      { url: "https://www.naukri.com", selector: ".jobClass" },
      // Add other portals with selectors here
   ];

   for (const portal of jobPortals) {
      const { data } = await axios.get(portal.url);
      const $ = cheerio.load(data);

      $(portal.selector).each((_, element) => {
         const title = $(element).find(".titleClass").text();
         const company = $(element).find(".companyClass").text();
         const location = $(element).find(".locationClass").text();
         const description = $(element).find(".descClass").text();

         jobs.push({ title, company, location, description });
      });
   }
   return jobs;
};

module.exports = { getJobs };
