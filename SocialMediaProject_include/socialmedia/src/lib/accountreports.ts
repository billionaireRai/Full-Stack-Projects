import puppeteer from 'puppeteer';
import { renderTemplate } from '@/components/reportwrapper';

export const generateReportInPDF = async (data:any) => { 
    console.log('[PDF Generation] Starting PDF generation...');
    
        // Launch Puppeteer with proper configs...
        let browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--disable-web-security','--font-render-hinting=none']
        });

        const page = await browser.newPage();
        const html = await renderTemplate(data);

        // Set content with config options...
        await page.setContent(html, { waitUntil: ['networkidle0', 'domcontentloaded'],timeout: 30000 });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            margin: {top: '20px',right: '20px',bottom: '20px',left: '20px'}
        });

        await browser.close();
    
        return pdfBuffer;

}
