// Domain Grabber - Custom sub-domain finder for Pentesting recon.
// @author James Rogers

import axios from 'axios';
import fse from 'fs-extra';
import ora from 'ora';
import prompts from 'prompts';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import WebCapture from 'webpage-capture';
import express from 'express';

// Express Init
const app = express();

async function run() {
    let response = await prompts({
        type: 'text',
        name: 'domain',
        message: 'Enter Domain: '
    });

    const spinner = ora(`Finding sub-domains for - ${response.domain}`).start();

    // Make requests to crt.sh and certspotter
    const resp = await axios(`https://crt.sh/?q=%.${response.domain}`);

    // Create Directory for domain screenshots
    try {   
        await fse.mkdir(`./screenshots/${response.domain}`);
    } catch (err) {
        console.error(err);
    }

    const capturer = new WebCapture({
        outputDir: `./screenshots/${response.domain}`
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

    let actionMenu = await prompts({
        type: 'text',
        name: 'action',
        message: 'Action Menu: - P (Probe Domains) S (Screenshot All Domains) PS (Probe then Screenshot)'
    });

    if (actionMenu.action === 'P') {
        spinner.start('Probing Domains...');
    } else if (actionMenu.action === 'S') {
        spinner.start('Screenshotting Domains...');
        console.log(__dirname + '/images');
        const res = await capturer.capture(crtshDomainsHTTPS);
        console.log(res);
    } else if (actionMenu.action === 'PS') {
        spinner.start('Probing & Screenshotting All Domains...');        
    } else {
        spinner.fail('Please enter a valid option: P S PS');
    }

    // console.log('');
    // console.log(crtSH.join('\r\n'));
}
run();