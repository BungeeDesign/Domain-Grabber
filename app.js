// Domain Grabber - Custom sub-domain finder for Pentesting recon.
// @author James Rogers

'use strict';

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
app.use(cors());
app.use(bodyParser.json());

// Root - Forbidden
app.get('/', (req, res) => res.json({'status': 'Forbidden entry'}));

// Domain - Query given domain
app.post('/domain', async (req, res) => {
    req.setTimeout(7 * 60 * 1000);
    const data = await run(req.body[0]);
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

    let i = 0;
    domains.forEach((domain) => {
        crtSH.push({key: i++, domain: domain.innerHTML});
    });

    crtSH.forEach((domain) => {
        crtshDomainsHTTPS.push(`https://${domain}`);
    });

    spinner.stop();
    console.log('\r\n');
    console.log(`CRT.SH Found: ${crtSH.length} domains!`);

    if (query.action === 'list' && query.probe === false) {
        let domainList = {
            'domains': crtSH,
            'domainName': query.domain
        }
        return domainList;
    }
    
    if (query.action === 'S') {
        spinner.start('Screenshotting Domains...');
        console.log(__dirname + '/images');
        const res = await capturer.capture(crtshDomainsHTTPS);
        console.log(res);
    }
    
    if (query.probe === true) {
        spinner.start('Probing All Domains...');

        const probedDomains = await probeDomains(crtshDomainsHTTPS);

        let domainList = {
            'domains': probedDomains,
            'domainName': query.domain
        }

        return domainList;
    }
}

async function probeDomains(domains) {
    let probedDomains = [];
    for (let i = 0; i < domains.length; i++) {
        try {            
            const res = await axios(domains[i], { validateStatus: false }, { timeout: 2 });
            if (res.status == 200) {
                probedDomains.push(domains[i].replace('https://', ''));
            }
            console.log(res.status);
        } catch (error) {
            console.log('Error');
        }
    }
    console.log('Finished....');
    return probedDomains;
}

// Start App Listen on Port 5000 set in .env
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Started on port http://localhost:${PORT}`);
});