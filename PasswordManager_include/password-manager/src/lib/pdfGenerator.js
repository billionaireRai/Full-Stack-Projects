import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { calculateObjectSize } from 'bson';
import { createRequire } from 'module';
// importing from the commonjs configured file...
const require = createRequire(import.meta.url);
const { generateBarChart, generatePieChart } = require('./chartandpiegenerator.cjs'); 


// Main report generation function
export const generateVaultReport = async (vaults,user) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Brand logo
  const brandLogoPath = path.join(process.cwd(), 'public', 'images', 'brandLogo.png');
  const logoBuffer = await fs.readFile(brandLogoPath);
  const logoImage = await pdfDoc.embedPng(logoBuffer);
  const logoDims = logoImage.scale(0.2);

  // extracting required data for 
  const sizes = vaults.map(v => calculateObjectSize(v.encryptedCurrentData) / 1024);
  const privateCount = vaults.filter(v => v.vaultType.access === 'private').length;
  const barBuffer = await generateBarChart(vaults.map((v, i) => ({ _id: v._id, sizeMB: sizes[i] })));
  const pieBuffer = await generatePieChart(privateCount, vaults.length - privateCount);

  if (!pieBuffer || pieBuffer.length === 0) {
    throw new Error('Pie chart buffer is empty or invalid');
  }

  // Embed chart images..
  const barChartImage = await pdfDoc.embedPng(barBuffer);
  const pieChartImage = await pdfDoc.embedPng(pieBuffer);

  // === PAGE 1: Overview ===
  const chartPage = pdfDoc.addPage();
  const { width: w, height: h } = chartPage.getSize();

  chartPage.drawText('Vault Report | Overview Charts', {
    x: 50,
    y: h - 50,
    size: 18,
    font,
    color: rgb(0, 0, 0)
  });

  chartPage.drawText(`Generated for: ${user.name} (${user.email})`, {
    x: 50,
    y: h - 70,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  chartPage.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: 50,
    y: h - 90,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  chartPage.drawText('Vault Size Distribution (Bar Chart)', { x: 50, y: h - 130, size: 12, font });
  chartPage.drawImage(barChartImage, {
    x: 50,
    y: h - 400,
    width: 500,
    height: 200,
  });

  chartPage.drawText('Access Level Distribution (Pie Chart)', { x: 50, y: h - 420, size: 12, font });
  chartPage.drawImage(pieChartImage, {
    x: 200,
    y: h - 620,
    width: 200,
    height: 200,
  });

   // Brand logo and footer design (chartPage)
   const footerY = 30;
   const footerFontSize = 10;

   // Draw a separator line
   chartPage.drawLine({
     start: { x: 40, y: footerY + 15 },
     end: { x: w - 40, y: footerY + 15 },
     thickness: 0.5,
     color: rgb(0.8, 0.8, 0.8),
   });

   // Footer text
   chartPage.drawText(`Vault Manager • Page 1 of ${vaults.length + 1}`, {
     x: 50,
     y: footerY,
     size: footerFontSize,
     font,
     color: rgb(0.45, 0.45, 0.45),
   });

    // Embed logo neatly aligned to the right
    const footerLogoWidth = 50; // smaller logo
    const footerLogoHeight = (logoDims.height / logoDims.width) * footerLogoWidth;

    chartPage.drawImage(logoImage, {
      x: w - footerLogoWidth - 50,
      y: footerY - 5,
      width: footerLogoWidth,
      height: footerLogoHeight,
    });


  // rendering vaults per page...
  vaults.forEach((vault, index) => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let y = height - 50;

    page.drawText(`📁 Vault Report: ${vault.vaultType.vaultCategory}-${vault._id}`, { x: 50, y, size: 16, font });
    y -= 30;

    page.drawText(`Created: ${vault.createdAt}`, { x: 60, y, size: 12, font });
    y -= 18;
    page.drawText(`Access Level: ${vault.vaultType.access}`, { x: 60, y, size: 12, font });
    y -= 18;
    page.drawText(`Size: ${(calculateObjectSize(vault.encryptedCurrentData) / 1024).toFixed(2)} MB`, { x: 60, y, size: 12, font });
    y -= 30;

    // Footer design for vault pages
    const footerY = 30;
    const footerFontSize = 10;

    // Separator line
    page.drawLine({
      start: { x: 40, y: footerY + 15 },
      end: { x: width - 40, y: footerY + 15 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Footer text
    page.drawText(`lockRift • Page ${index + 2} of ${vaults.length + 1}`, {
      x: 50,     
      y: footerY,
      size: footerFontSize,
      font,
      color: rgb(0.45, 0.45, 0.45),
    });

     // Embed footer logo neatly
     const footerLogoWidth = 50;
     const footerLogoHeight = (logoDims.height / logoDims.width) * footerLogoWidth;

     page.drawImage(logoImage, {
       x: width - footerLogoWidth - 50,
       y: footerY - 5,
       width: footerLogoWidth,
       height: footerLogoHeight,
     });
});

  return await pdfDoc.save(); // returns Uint8Array for download
};
