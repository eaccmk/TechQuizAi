Create a GitHub repository
Go to github.com, create a new repository (e.g., 'TechQuizAi'). Upload all your files (index.html, style.css, app.js, quiz.html, quiz.css, quiz.js, certificate.js) to it. This gives Netlify a source to deploy from and also gives you version history for free.
2
Sign up for Netlify
Go to netlify.com and sign up using your GitHub account. This lets Netlify access your repositories directly without extra steps.
3
Create a new site from Git
In the Netlify dashboard, click 'Add new site' then 'Import an existing project'. Choose GitHub, then select your TechQuizAi repository.
4
Configure build settings
Since this is a static site with no build step, leave the 'Build command' field empty and set the 'Publish directory' to the root folder (usually just a single dot: '.'). Click Deploy.
5
Wait for deployment
Netlify will deploy your site in under a minute. You'll get a free URL like 'random-name-12345.netlify.app'. Your site is now live and publicly accessible.
6
Optional: set a custom subdomain
In Site settings > Domain management, you can change the auto-generated name to something like 'TechQuizAi-yourname.netlify.app' at no cost. A fully custom domain (like TechQuizAi.com) would require buying that domain separately, but the netlify.app subdomain is completely free.
7
Enable auto-deploy on future changes
This is automatic by default: any time you push new changes to your GitHub repository's main branch, Netlify redeploys the site within seconds. No manual redeployment needed going forward.