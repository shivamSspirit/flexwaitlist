/**
 * Email Templates for FlexIt Waitlist
 */

interface WelcomeEmailData {
  email: string;
  position: number;
  referralCode: string;
  referralUrl: string;
}

export function getWelcomeEmailHTML(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FlexIt Beta</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: 900;
      background: linear-gradient(135deg, #00ff88 0%, #00ddff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .position-badge {
      display: inline-block;
      background: linear-gradient(135deg, #00ff88 0%, #00ddff 100%);
      color: black;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
    }
    .referral-box {
      background: #f8f9fa;
      border: 2px dashed #00ff88;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .referral-code {
      font-size: 24px;
      font-weight: bold;
      color: #00ff88;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .referral-url {
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 12px;
      font-family: monospace;
      font-size: 12px;
      word-break: break-all;
      margin: 10px 0;
      color: #666;
    }
    .btn {
      display: inline-block;
      background: #00ff88;
      color: black;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
    .perks {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .perk-item {
      display: flex;
      align-items: center;
      margin: 12px 0;
    }
    .perk-icon {
      width: 24px;
      height: 24px;
      background: #00ff88;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #00ff88;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">FlexIt</div>
      <h1 style="margin: 10px 0; font-size: 28px;">You're on the list! 🎉</h1>
      <p style="color: #666; font-size: 16px;">Welcome to the future of creator monetization</p>
    </div>

    <div style="text-align: center;">
      <div class="position-badge">
        Position #${data.position}
      </div>
    </div>

    <p style="font-size: 16px; line-height: 1.8;">
      Hey there! 👋
    </p>
    <p style="font-size: 16px; line-height: 1.8;">
      You're officially on the FlexIt beta waitlist. You're one of the early believers, and we're stoked to have you.
    </p>

    <div class="perks">
      <h3 style="margin-top: 0; color: #00ff88;">🎁 What You Get as Beta Member:</h3>
      <div class="perk-item">
        <span class="perk-icon">✓</span>
        <span><strong>OG Founder Badge</strong> - Verified on-chain proof you were here first</span>
      </div>
      <div class="perk-item">
        <span class="perk-icon">✓</span>
        <span><strong>Priority Profile Mint</strong> - Reserve your handle before public launch</span>
      </div>
      <div class="perk-item">
        <span class="perk-icon">✓</span>
        <span><strong>Premium Forever</strong> - $100/month value, free for life</span>
      </div>
      <div class="perk-item">
        <span class="perk-icon">✓</span>
        <span><strong>10x Launch Boost</strong> - Featured placement for 30 days</span>
      </div>
      <div class="perk-item">
        <span class="perk-icon">✓</span>
        <span><strong>5% Revenue Share</strong> - Lifetime commission on referrals</span>
      </div>
    </div>

    <h3 style="color: #00ff88;">🚀 Move Up the List</h3>
    <p style="font-size: 16px; line-height: 1.8;">
      Share your referral link and jump ahead in line:
    </p>

    <div class="referral-box">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">YOUR REFERRAL CODE</p>
      <div class="referral-code">${data.referralCode}</div>
      <div class="referral-url">${data.referralUrl}</div>

      <a href="${data.referralUrl}" class="btn">Share Your Link</a>

      <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
        <strong>Each referral:</strong> +3 positions<br>
        <strong>3 referrals:</strong> Founder Badge<br>
        <strong>10+ referrals:</strong> Guaranteed Access
      </p>
    </div>

    <div class="social-links">
      <p style="margin-bottom: 10px; font-size: 14px; color: #666;">Share on:</p>
      <a href="https://twitter.com/intent/tweet?text=Just%20joined%20the%20FlexIt%20beta%20waitlist!%20Every%20post%20%3D%20coin.%20Every%20creator%20%3D%20asset.%20Join%20me%3A%20${encodeURIComponent(data.referralUrl)}" target="_blank">Twitter</a>
      <a href="https://t.me/share/url?url=${encodeURIComponent(data.referralUrl)}&text=Join%20me%20on%20FlexIt%20beta!" target="_blank">Telegram</a>
      <a href="https://wa.me/?text=Join%20me%20on%20FlexIt%20beta!%20${encodeURIComponent(data.referralUrl)}" target="_blank">WhatsApp</a>
    </div>

    <div style="background: #fff9e6; border-left: 4px solid #ffd700; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>💡 Pro Tip:</strong> Share on crypto Twitter and Telegram groups to maximize referrals!
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.8;">
      We're launching soon. Stay tuned for updates!
    </p>

    <p style="font-size: 16px; line-height: 1.8;">
      Let's build the future of creator monetization together 🚀
    </p>

    <p style="font-size: 16px; line-height: 1.8;">
      <strong>The FlexIt Team</strong>
    </p>

    <div class="footer">
      <p>FlexIt - Every Post = Coin. Every Creator = Asset.</p>
      <p>Built on Solana | $15K Grant Winner | Anti-Rug SocialFi</p>
      <p style="margin-top: 10px;">
        You're receiving this email because you joined the FlexIt beta waitlist at ${data.email}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getWelcomeEmailText(data: WelcomeEmailData): string {
  return `
Welcome to FlexIt Beta! 🎉

You're officially on the waitlist - Position #${data.position}

What You Get as Beta Member:
✓ OG Founder Badge - Verified on-chain proof you were here first
✓ Priority Profile Mint - Reserve your handle before public launch
✓ Premium Forever - $100/month value, free for life
✓ 10x Launch Boost - Featured placement for 30 days
✓ 5% Revenue Share - Lifetime commission on referrals

Move Up the List:
Share your referral link and jump ahead:

Your Referral Code: ${data.referralCode}
Your Referral Link: ${data.referralUrl}

Each referral: +3 positions
3 referrals: Founder Badge
10+ referrals: Guaranteed Access

Share on:
Twitter: https://twitter.com/intent/tweet?text=Just%20joined%20the%20FlexIt%20beta%20waitlist!%20Join%20me%3A%20${encodeURIComponent(data.referralUrl)}
Telegram: https://t.me/share/url?url=${encodeURIComponent(data.referralUrl)}
WhatsApp: https://wa.me/?text=Join%20me%20on%20FlexIt%20beta!%20${encodeURIComponent(data.referralUrl)}

We're launching soon. Stay tuned!

Let's build the future of creator monetization together 🚀

The FlexIt Team

---
FlexIt - Every Post = Coin. Every Creator = Asset.
Built on Solana | $15K Grant Winner | Anti-Rug SocialFi
  `.trim();
}
