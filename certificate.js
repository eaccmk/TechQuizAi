function generateCertificate(score, userName = 'John Smith') {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 1000, 700);
    gradient.addColorStop(0, '#1a0b2e');
    gradient.addColorStop(1, '#3d1e5c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 700);

    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 940, 640);

    ctx.textAlign = 'center';

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px Arial';
    ctx.fillText('Certificate of Completion', 500, 150);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#f0abfc';
    ctx.fillText('This certifies that', 500, 220);

    ctx.font = 'bold 52px Georgia';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(userName, 500, 320);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#f0abfc';
    ctx.fillText('has successfully completed', 500, 380);

    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('AWS Basics Quiz', 500, 430);

    ctx.font = '16px Arial';
    ctx.fillStyle = '#cbd5e1';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(date, 500, 500);

    ctx.font = 'italic 16px Arial';
    ctx.fillStyle = '#9aa3b8';
    ctx.fillText('TechQuizAi - Master Cloud Computing', 500, 610);

    drawPassStamp(ctx, 800, 560);

    const link = document.createElement('a');
    link.download = `TechQuizAi-Certificate-AWS-Basics.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function drawPassStamp(ctx, centerX, centerY) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(-12 * Math.PI / 180);
    ctx.globalAlpha = 0.85;

    const radius = 75;

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-25, -5);
    ctx.lineTo(-8, 15);
    ctx.lineTo(28, -25);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED', 0, -38);

    ctx.font = 'bold 15px Arial';
    ctx.fillText('PASSED', 0, 45);

    ctx.restore();
}