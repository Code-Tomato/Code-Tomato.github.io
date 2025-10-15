import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// OG Image template - Satori requires all elements with children to have explicit display
const ogImageHTML = html`
<div style="display: flex; width: 1200px; height: 630px; background: linear-gradient(135deg, #ffffff, #fef9f5); position: relative;">
  <div style="display: flex; flex-direction: column; justify-content: center; padding: 80px; width: 100%; background: rgba(255, 107, 53, 0.08); border: 6px solid #ffe4d6; border-radius: 24px;">
    <!-- Logo with Circle Icon -->
    <div style="display: flex; align-items: center; margin-bottom: 30px;">
      <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #ff6b35, #ff4500); border-radius: 999px; display: flex;"></div>
      <div style="font-size: 52px; font-weight: 700; color: #ff6b35; margin-left: 25px; display: flex;">Code-Tomato</div>
    </div>
    
    <!-- Name -->
    <div style="font-size: 96px; font-weight: 700; color: #ff6b35; margin-bottom: 20px; line-height: 1; display: flex;">Nathan Lemma</div>
    
    <!-- Subtitle -->
    <div style="font-size: 38px; color: #4a4a4a; margin-bottom: 45px; display: flex;">ECE Student · Researcher · Systems Engineer</div>
    
    <!-- Tags -->
    <div style="display: flex; gap: 20px;">
      <div style="display: flex; padding: 14px 32px; background: #fff5ed; border: 2px solid #ffe4d6; border-radius: 50px; font-size: 26px; color: #4a4a4a; font-weight: 600;">Systems Programming</div>
      <div style="display: flex; padding: 14px 32px; background: #fff5ed; border: 2px solid #ffe4d6; border-radius: 50px; font-size: 26px; color: #4a4a4a; font-weight: 600;">Embedded Systems</div>
      <div style="display: flex; padding: 14px 32px; background: #fff5ed; border: 2px solid #ffe4d6; border-radius: 50px; font-size: 26px; color: #4a4a4a; font-weight: 600;">Hardware Design</div>
    </div>
  </div>
</div>
`;

async function generateOGImage() {
  console.log('🎨 Generating OG Image...');

  try {
    // Download fonts from a reliable CDN
    console.log('📥 Downloading fonts...');
    
    const [interRegular, interBold, notoSans] = await Promise.all([
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff').then(r => r.arrayBuffer()),
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff').then(r => r.arrayBuffer()),
      // Noto Sans has better emoji fallback support
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/latin-400-normal.woff').then(r => r.arrayBuffer()).catch(() => null),
    ]);
    
    console.log('✅ Fonts downloaded');
    
    const fonts = [
      {
        name: 'Inter',
        data: interRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interBold,
        weight: 700,
        style: 'normal',
      },
    ];
    
    if (notoSans) {
      fonts.push({
        name: 'Noto Sans',
        data: notoSans,
        weight: 400,
        style: 'normal',
      });
    }
    
    // Generate SVG using Satori
    const svg = await satori(ogImageHTML, {
      width: 1200,
      height: 630,
      fonts,
      embedFont: true,
    });

    console.log('✅ SVG generated');

    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Save to public directory
    const outputPath = path.join(__dirname, '../public/og-image.png');
    fs.writeFileSync(outputPath, pngBuffer);

    console.log('✅ PNG saved to:', outputPath);
    console.log('🎉 OG Image generated successfully!');
    console.log('📊 Size:', Math.round(pngBuffer.length / 1024), 'KB');

  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

// Run the generator
generateOGImage();

