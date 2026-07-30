function generateCertificate(score, userName = 'Learner', topicTitle = 'Completed Course', duration = '', skillsArray = null) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; // Increased resolution for better clarity
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    const appTitle = (typeof CONFIG !== 'undefined') ? CONFIG.appName : 'TechQuizAi';
    const primaryColor = (typeof CONFIG !== 'undefined' && CONFIG.branding) ? CONFIG.branding.primaryColor : '#0a66c2';
    const accentColor = (typeof CONFIG !== 'undefined' && CONFIG.branding) ? CONFIG.branding.purpleAccent : '#f3f2ef';

    // 1. Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle corner accents
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(250, 0);
    ctx.lineTo(0, 250);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width - 250, 0);
    ctx.lineTo(canvas.width, 250);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(250, canvas.height);
    ctx.lineTo(0, canvas.height - 250);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width - 250, canvas.height);
    ctx.lineTo(canvas.width, canvas.height - 250);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 2. Header / Logo Text
    ctx.textAlign = 'center';
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText(`${appTitle}`, canvas.width / 2, 120);

    // 3. Course Title
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '48px Arial, sans-serif'; // Clean, thin-looking font

    // Simple text wrapping for title
    const maxTitleWidth = 1000;
    const words = topicTitle.split(' ');
    let line = '';
    let y = 240;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxTitleWidth && n > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[n] + ' ';
            y += 60;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // 4. Completion details
    y += 80;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666666';
    ctx.font = '28px Arial, sans-serif';
    ctx.fillText('Course completed by', canvas.width / 2, y);

    y += 50;
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.fillText(userName, canvas.width / 2, y);

    y += 50;
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial, sans-serif';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    ctx.fillText(`${date}`, canvas.width / 2, y);

    // 5. Skills covered
    y += 115;
    ctx.fillStyle = '#666666';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('Skills learned', canvas.width / 2, y);

    y += 40;
    const skills = (skillsArray && skillsArray.length > 0 ? skillsArray : ['Core Concepts', 'Best Practices', 'Practical Application']).slice(0, 3);
    let skillX = canvas.width / 2 - 250; // Starting X, will adjust
    let totalSkillsWidth = 0;

    ctx.font = '18px Arial, sans-serif';
    // Calculate total width to center the pills
    skills.forEach(skill => {
        totalSkillsWidth += ctx.measureText(skill).width + 60; // text width + padding
    });

    skillX = (canvas.width - totalSkillsWidth) / 2 + 20;

    skills.forEach(skill => {
        const textWidth = ctx.measureText(skill).width;
        const pillWidth = textWidth + 40;
        const pillHeight = 36;

        // Draw Pill
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(skillX, y - 24, pillWidth, pillHeight, 18);
        ctx.stroke();

        // Draw Text
        ctx.fillStyle = '#444444';
        ctx.fillText(skill, skillX + pillWidth / 2, y);

        skillX += pillWidth + 20; // spacing between pills
    });

    // 6. Awarded by
    y += 165;
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText(`Awarded by ${appTitle} team`, canvas.width / 2, y);

    // Certificate ID
    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial, sans-serif';
    const safeTopic = topicTitle.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const idDateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    const certId = `Certificate ID: TQA-${safeTopic}-${idDateStr}`;
    ctx.fillText(certId, canvas.width / 2, canvas.height - 40);

    // 7. PASS Stamp
    drawPassStamp(ctx, canvas.width - 140, canvas.height - 130, primaryColor);

    const link = document.createElement('a');
    const sanitizedTitle = topicTitle.replace(/[^a-zA-Z0-9]/g, '-');
    link.download = `${appTitle}-Certificate-${sanitizedTitle}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (typeof showToast === 'function') {
        showToast('✅ Certificate generated successfully!');
    }
}

function drawPassStamp(ctx, centerX, centerY, primaryColor) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Natural slight rotation for a physical stamp impression
    ctx.rotate(-9 * Math.PI / 180);

    // Dark green ink tone for official verification rubber stamp
    const stampInk = (typeof CONFIG !== 'undefined' && CONFIG.branding) ? CONFIG.branding.greenSuccess : '#15803d';
    ctx.globalAlpha = 0.86;

    // Outer rubber stamp ring
    ctx.strokeStyle = stampInk;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.stroke();

    // Inner thin ring
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle inner beaded ring
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 43, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Main focal text "PASS"
    ctx.fillStyle = stampInk;
    ctx.font = 'bold 36px "Arial Black", "Arial", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PASS', 0, 1);

    // Micro ink-texture dots for a realistic stamped ink on paper feel
    ctx.fillStyle = stampInk;
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 52;
        const size = Math.random() * 1.4 + 0.4;
        ctx.globalAlpha = Math.random() * 0.2 + 0.05;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function showToast(message) {
    const existing = document.getElementById('certToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'certToast';
    toast.className = 'cert-toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
