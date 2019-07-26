// Domain Grabber - Custom sub-domain finder for Pentesting recon.
// @author James Rogers

import dotenv from 'dotenv';
import axios from 'axios';
import fse from 'fs-extra';
import ora from 'ora';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import WebCapture from 'webpage-capture';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// ENV Setup
dotenv.config();

// Express Init
const app = express();
app.use(bodyParser.json());

// Root - Forbidden
app.get('/', (req, res) => res.json({'status': 'Forbidden entry'}));

// Domain - Query given domain
app.get('/domain', async (req, res) => {
    const data = await run(req.body);
    res.send(data);
});

async function run(query) {
    const spinner = ora(`Finding sub-domains for - ${query.domain}`).start();

    // Make requests to crt.sh and certspotter
    const resp = await axios(`https://crt.sh/?q=%.${query.domain}`);

    // Create Directory for domain screenshots
    try {   
        await fse.mkdir(`./screenshots/${query.domain}`);
    } catch (err) {
        console.error(err);
    }

    const capturer = new WebCapture({
        outputDir: `./screenshots/${query.domain}`
    });
    
    const dom = new JSDOM(resp.data);
    const domains = dom.window.document.querySelectorAll("body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td:nth-child(5)");

    let crtSH = [];
    let crtshDomainsHTTPS = [];

    domains.forEach((domain) => {
        crtSH.push(domain.innerHTML);
    });

    crtSH.forEach((domain) => {
        crtshDomainsHTTPS.push(`https://${domain}`);
    });

    spinner.stop();
    console.log('\r\n');
    console.log(`CRT.SH Found: ${crtSH.length} domains!`);

    if (query.action === 'list') {
        let domainList = {
            'domains': crtshDomainsHTTPS
        }
        return domainList;
    } else if (query.action === 'S') {
        spinner.start('Screenshotting Domains...');
        console.log(__dirname + '/images');
        const res = await capturer.capture(crtshDomainsHTTPS);
        console.log(res);
    } else if (query.action === 'PS') {
        spinner.start('Probing & Screenshotting All Domains...');        
    } else {
        spinner.fail('Please enter a valid option: P S PS');
    }
}

// Start App Listen on Port 5000 set in .env
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Started on port http://localhost:${PORT}`);
});