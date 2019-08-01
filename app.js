// Domain Grabber - Custom sub-domain finder for Pentesting recon.
// @author James Rogers
'use strict';

import dotenv from 'dotenv';
import axios from 'axios';
import fse, { existsSync } from 'fs-extra';
import ora from 'ora';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import WebCapture from 'webpage-capture';
import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

// ENV Setup
dotenv.config();

// Express Init
const app = express();
app.use(cors());
app.use(bodyParser.json());

// GCS Firebase Storage Init
admin.initializeApp({
    credential: admin.credential.cert('./firebase-admin-cred/domain-grabber-307840b47ecd.json'),
    storageBucket: 'domain-grabber.appspot.com'
});

const bucket = admin.storage().bucket();

// Globals
let screenshotURLs = [],
dirSaved = '';

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
    let dirOffset = Math.floor(Math.random()*9000) + 1000;
    try {
        if (existsSync(`./screenshots/${query.domain}`)) {
            await fse.mkdir(`./screenshots/${query.domain}-${dirOffset}`);
            dirSaved = `${query.domain}-${dirOffset}`;
        } else {
            await fse.mkdir(`./screenshots/${query.domain}`);
            dirSaved = query.domain;
        }   
    } catch (err) {
        console.log('Folder already exsists');
    }

    const capturer = new WebCapture({
        outputDir: `./screenshots/${dirSaved}`
    });
    
    const dom = new JSDOM(resp.data);
    const domains = dom.window.document.querySelectorAll("body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td:nth-child(5)");

    let crtSH = [];
    let crtshDomainsHTTPS = [];
    let screenshotDomainArray = [];

    let i = 0;
    domains.forEach((domain) => {
        crtSH.push({key: i++, domain: domain.innerHTML, screenshot: ''});
    });

    let j = 0;
    crtSH.forEach((domain) => {
        crtshDomainsHTTPS.push({ key: j++, domain: `https://${domain.domain}`});
        screenshotDomainArray.push(`https://${domain.domain}`);
    });

    spinner.stop();
    console.log('\r\n');
    console.log(`CRT.SH Found: ${crtSH.length} domains!`);

    if (query.action === 'list' && query.probe === false) {
        let domainList = {
            'domains': crtSH,
            'domainName': query.domain,
            'noResults': crtSH.length == 0 ? true : false
        }
        if (query.screenshot) {
            spinner.start('Screenshotting Domains...');
            const res = await capturer.capture(screenshotDomainArray);
        
            let paths = [];
            for (const results of res) {
                paths.push(results.output);
            }

            // Upload Screenshots
            const uploadedScreenshots = uploadScreenshots(paths);

            for (let i = 0; i < crtSH.length; i++) {
                crtSH[i].screenshot = getScreenShots(i);
            }
            
            function getScreenShots(i) {
                if (i >= uploadedScreenshots.length) {
                    return 'offline.png';
                }
                return uploadedScreenshots[i];
            }

            domainList = {
                'domains': crtSH,
                'domainName': query.domain,
                'noResults': crtSH.length == 0 ? true : false
            }
        } else {
            return domainList;
        }

        return domainList;
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
    let k = 0;

    for (const domain of domains) {
        try {            
            const res = await axios(domain.domain, { validateStatus: false }, { timeout: 2 });
            if (res.status == 200) {
                probedDomains.push({key: k++, domain: domain.domain.replace('https://', '')});
            }
            console.log(res.status);
        } catch (error) {
            console.log('Error');
        }
    };

    console.log('Finished....');
    return probedDomains;
}

function uploadScreenshots(paths) {
    // console.log('UPLOAD SCREENSHOT', paths);
    paths.forEach(async pathName => {
        // Format Windows path 
        let pathFormatted = path.resolve(pathName);
        bucket.upload(pathFormatted);
        const fileName = path.basename(pathFormatted);
        screenshotURLs.push(`https://storage.googleapis.com/domain-grabber.appspot.com/${fileName}`);
    });
    // console.log('RETURN SCREENSHIT', screenshotURLs);
    return screenshotURLs;
}

// Start App Listen on Port 5000 set in .env
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Started on port http://localhost:${PORT}`);
});