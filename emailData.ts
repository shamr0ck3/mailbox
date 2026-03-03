// Simulated email data generator

const domains = [
  'tempvault.io',
  'vaultbox.dev',
  'ghostmail.cc',
  'nullbox.net',
  'dispomail.xyz',
];

const adjectives = [
  'shadow', 'ghost', 'cyber', 'phantom', 'stealth',
  'void', 'nexus', 'zero', 'dark', 'silent',
  'rapid', 'iron', 'frost', 'bolt', 'drift',
];

const nouns = [
  'fox', 'hawk', 'wolf', 'eagle', 'viper',
  'node', 'byte', 'core', 'shell', 'proxy',
  'agent', 'guard', 'hunter', 'scout', 'runner',
];

export function generateEmail(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${adj}.${noun}${num}@${domain}`;
}

export interface Email {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  preview: string;
  body: string;
  time: Date;
  read: boolean;
  hasAttachment: boolean;
}

const senderNames = [
  'GitHub Notifications',
  'AWS Security',
  'Docker Hub',
  'npm Registry',
  'Cloudflare',
  'DigitalOcean',
  'Stripe Alerts',
  'Slack',
  'Vercel Deploy',
  'LinkedIn',
  'Reddit',
  'HackerOne',
  'BugCrowd',
  'TryHackMe',
  'Notion',
  'Firebase',
  'Supabase',
  'GitLab CI',
  'Jira Service',
  'Atlassian',
];

const senderDomains = [
  'github.com', 'aws.amazon.com', 'docker.com', 'npmjs.com',
  'cloudflare.com', 'digitalocean.com', 'stripe.com', 'slack.com',
  'vercel.com', 'linkedin.com', 'reddit.com', 'hackerone.com',
  'bugcrowd.com', 'tryhackme.com', 'notion.so', 'firebase.google.com',
  'supabase.com', 'gitlab.com', 'atlassian.com', 'atlassian.net',
];

const subjects = [
  'Verify your email address',
  'Your security alert for recent login',
  'Action required: Confirm your account',
  'New sign-in from Chrome on Windows',
  'Your verification code: 847291',
  'Password reset request',
  'Welcome to the platform!',
  'Your deployment was successful',
  'New comment on your pull request',
  'Weekly security digest',
  'Invoice #INV-2024-0382',
  'Your trial expires in 3 days',
  'Important: Update your billing info',
  'New vulnerability disclosed',
  'Build #1847 passed ✓',
  'You have a new connection request',
  'Upvotes on your post',
  'New bounty submission received',
  'Room completed: SOC Level 1',
  'API rate limit warning',
];

const bodies = [
  `<p>Hello,</p><p>We noticed a new sign-in to your account from a device we don't recognize.</p><p><strong>Device:</strong> Chrome on Windows 11<br/><strong>Location:</strong> Kuala Lumpur, MY<br/><strong>Time:</strong> ${new Date().toLocaleString()}</p><p>If this was you, no further action is needed. If you don't recognize this activity, please secure your account immediately.</p><p>— Security Team</p>`,

  `<p>Hi there,</p><p>Your verification code is: <strong style="font-size:24px;letter-spacing:4px;">847291</strong></p><p>This code expires in 10 minutes. Do not share it with anyone.</p><p>If you didn't request this code, please ignore this email.</p>`,

  `<p>Your deployment to <strong>production</strong> was successful.</p><p><strong>Project:</strong> tempvault-app<br/><strong>Branch:</strong> main<br/><strong>Commit:</strong> <code>a3f8c2d</code><br/><strong>Duration:</strong> 42s</p><p>View your deployment at: <a href="#">https://tempvault.io</a></p>`,

  `<p>Weekly Security Digest — ${new Date().toLocaleDateString()}</p><p><strong>3 new vulnerabilities</strong> were disclosed this week affecting packages in your dependency tree:</p><ul><li><code>lodash</code> — Prototype Pollution (HIGH)</li><li><code>axios</code> — SSRF via proxy (MEDIUM)</li><li><code>jsonwebtoken</code> — Algorithm confusion (CRITICAL)</li></ul><p>Run <code>npm audit</code> to check your projects.</p>`,

  `<p>Congratulations! 🎉</p><p>You've completed the <strong>SOC Level 1</strong> learning path.</p><p><strong>Score:</strong> 92/100<br/><strong>Time:</strong> 4h 23m<br/><strong>Rank:</strong> Top 8%</p><p>Your next recommended path: <strong>Threat Intelligence Analyst</strong></p>`,

  `<p>New pull request activity:</p><p><strong>PR #247:</strong> Fix CORS headers in API gateway</p><p>@devops-bot commented:<br/><em>"LGTM. The preflight headers look correct now. Approved."</em></p><p>2 approvals received. Ready to merge.</p>`,

  `<p>Hello,</p><p>Your API usage is approaching the rate limit.</p><p><strong>Current usage:</strong> 9,247 / 10,000 requests<br/><strong>Reset time:</strong> ${new Date(Date.now() + 3600000).toLocaleString()}</p><p>Consider upgrading your plan or implementing request caching.</p>`,

  `<p>Invoice Details</p><p><strong>Invoice #:</strong> INV-2024-0382<br/><strong>Amount:</strong> $29.00<br/><strong>Period:</strong> Dec 1 - Dec 31, 2024<br/><strong>Status:</strong> <span style="color:#34d399;">Paid</span></p><p>Thank you for your continued subscription.</p>`,
];

let emailCounter = 0;

export function generateIncomingEmail(): Email {
  emailCounter++;
  const nameIdx = Math.floor(Math.random() * senderNames.length);
  const subjIdx = Math.floor(Math.random() * subjects.length);
  const bodyIdx = Math.floor(Math.random() * bodies.length);
  const domainIdx = Math.min(nameIdx, senderDomains.length - 1);

  const subject = subjects[subjIdx];

  return {
    id: `email-${Date.now()}-${emailCounter}`,
    fromName: senderNames[nameIdx],
    from: `noreply@${senderDomains[domainIdx]}`,
    subject,
    preview: subject,
    body: bodies[bodyIdx],
    time: new Date(),
    read: false,
    hasAttachment: Math.random() > 0.75,
  };
}

export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatTimeLeft(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
