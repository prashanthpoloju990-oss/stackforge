import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import path from "path";

/* ── 5 randomised funny-yet-informative email templates ── */
const TEMPLATES = [
  {
    subject: "You're in the StackForge club 🎉 (No secret handshake required)",
    headline: "Welcome aboard, legend! 🚀",
    body: `
      <p style="font-size:15px;">Hey there, future High-Performance legend,</p>
      <p style="font-size:15px;">First, the legal stuff: You have successfully subscribed to the StackForge newsletter. Yes, you did this to yourself. No, we cannot write your CSS for you in your sleep (though we genuinely wish we could).</p>
      <p style="font-size:15px;">Now for the fun stuff: We promise to protect your inbox like we protect our Lighthouse scores — <strong>100/100 or bust</strong>. You'll only get zero-bloat updates, occasional developer memes, and absolute masterpieces of web engineering. Plus we've got some <strong>massive surprises</strong> dropping soon that you absolutely do not want to miss.</p>
      <p style="font-size:15px;">To show our unbridled appreciation, here's a thank-you card from the StackForge team. We made this just for you! (Okay, we made it for everyone, but you feel special, right? Right?)</p>
    `,
    footer: "Stay tuned, keep scrolling, and keep those bundles lightweight.",
  },
  {
    subject: "StackForge just slid into your inbox 📬 (the good kind)",
    headline: "Oh look, someone with great taste! 👀",
    body: `
      <p style="font-size:15px;">Congratulations — you've made one of the best decisions of your digital life today.</p>
      <p style="font-size:15px;">We're StackForge, a small-but-terrifyingly-good web studio from Hyderabad. We build fast, beautiful websites that don't collapse under pressure (unlike some CSS frameworks we won't name).</p>
      <p style="font-size:15px;">What's coming your way? Behind-the-scenes dev updates, the occasional "we shipped something wild" announcement, and maybe a meme or two if you're lucky. Our newsletter is optimised the same way our code is — <strong>zero bloat, all signal</strong>.</p>
      <p style="font-size:15px;">Meanwhile, enjoy this little token of our appreciation. We spent at least 3 minutes on it. That's basically love.</p>
    `,
    footer: "See you in the next drop. Don't touch that unsubscribe button.",
  },
  {
    subject: "Your inbox just levelled up ⚡ — StackForge is here",
    headline: "Error 404: Boring newsletters not found 🔥",
    body: `
      <p style="font-size:15px;">We're going to skip the part where we pretend this is a surprise — you clicked Subscribe, we saw it, we screenshotted it. Evidence secured. 📸</p>
      <p style="font-size:15px;">But seriously, welcome to the StackForge inner circle. We're a crew of developers who believe a website should load in under a second or not load at all (dramatic, but we stand by it).</p>
      <p style="font-size:15px;">From here on, your inbox gets first dibs on project launches, dev insights, performance deep-dives, and the occasional "how on earth did they build that?" breakdown. All human-written, no AI filler, maximum flavour.</p>
      <p style="font-size:15px;">Here's a thank-you treat from us — consider it a high-five, but make it digital.</p>
    `,
    footer: "Stay fast, stay beautiful, and ship it clean. — StackForge",
  },
  {
    subject: "🎊 You subscribed to StackForge! Your inbox has officially become 10% cooler",
    headline: "New subscriber detected. Deploying welcome sequence... ✅",
    body: `
      <p style="font-size:15px;">System check complete. Subscription confirmed. Fun imminent.</p>
      <p style="font-size:15px;">Welcome to the StackForge newsletter — where every email is as optimized as our code, which means you get 100% of the value in a fraction of the bloat. If only life worked like that, right?</p>
      <p style="font-size:15px;">Things you can look forward to: new project reveals, honest dev takes, performance tips that actually work, and the kind of announcements that make you go <em>"wait, they did WHAT?"</em></p>
      <p style="font-size:15px;">As a token of our appreciation, we're attaching a card that sums up our feelings about you joining. (Hint: they are overwhelmingly positive.)</p>
    `,
    footer: "Thanks for trusting us with your inbox — we won't waste it.",
  },
  {
    subject: "Someone subscribed to StackForge 👀 (it was you, just confirming)",
    headline: "Let's be honest — you have excellent taste 🎯",
    body: `
      <p style="font-size:15px;">Most people scroll past newsletter signups. You clicked it. That already puts you in the top 1% of internet citizens, and we respect that immensely.</p>
      <p style="font-size:15px;">StackForge is where we build websites that make your competitors uncomfortable. Fast, clean, conversion-focused — and somehow still beautiful. We're the kind of devs who argue about padding values at 2am. Voluntarily.</p>
      <p style="font-size:15px;">You'll hear from us when we ship something worth talking about. No spam, no weekly "thought leadership" essays, no LinkedIn cringe. Just real updates from a real team doing real work. Wild concept, we know.</p>
      <p style="font-size:15px;">Here's a little gift to commemorate this momentous occasion. Frame it. Put it on your fridge. You've earned it.</p>
    `,
    footer: "Welcome to the team. You're one of us now. There's no going back. 😄",
  },
];

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS via STARTTLS on port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function buildHtml(template: (typeof TEMPLATES)[number]): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${template.subject}</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" style="max-width:560px; width:100%; border-radius:14px; overflow:hidden; border:1px solid #e0e0e0; background:#ffffff;">

          <!-- Header -->
          <tr>
            <td style="background:#0A0A0A; padding:28px 32px; text-align:center; border-bottom:4px solid #FF6A00;">
              <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif;">STACKFORGE</h1>
              <p style="color:#FF6A00; margin:6px 0 0; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Web Studio · Hyderabad</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px;">
              <h2 style="color:#FF6A00; margin-top:0; font-size:20px; font-weight:700;">${template.headline}</h2>
              ${template.body}
            </td>
          </tr>

          <!-- Thank-you image -->
          <tr>
            <td style="padding:8px 32px 24px; text-align:center;">
              <img src="cid:thankyou-img" alt="Thank You from StackForge!" style="max-width:100%; height:auto; border-radius:10px; display:block; margin:0 auto;" />
            </td>
          </tr>

          <!-- Divider + sign-off -->
          <tr>
            <td style="padding:0 32px 28px; border-top:1px solid #eee;">
              <p style="font-size:14px; color:#555; line-height:1.6; margin:20px 0 0;">
                ${template.footer}<br/>
                <strong style="color:#1a1a1a;">— The StackForge Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer bar -->
          <tr>
            <td style="background:#f5f5f7; padding:18px 32px; text-align:center; color:#86868b; font-size:11px; border-top:1px solid #e0e0e0; line-height:1.6;">
              StackForge Studio · Hyderabad, India<br/>
              <span style="color:#aaa;">If you didn't mean to sign up, you can unsubscribe any time — but we'll be genuinely devastated.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    await db.newsletter.create({ data: { email: trimmed } });

    // Pick a random template
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

    // Send welcome email — best-effort, never blocks the success response
    try {
      const transporter = createTransporter();

      // Verify connection before sending
      await transporter.verify();

      await transporter.sendMail({
        from: `"StackForge Studio" <${process.env.SMTP_USER}>`,
        to: trimmed,
        subject: template.subject,
        html: buildHtml(template),
        // Plain-text fallback (improves deliverability & avoids spam filters)
        text: `Welcome to StackForge!\n\n${template.headline}\n\nThank you for subscribing. Stay tuned for updates from the StackForge team.\n\n— The StackForge Team\nstackforge.co.in`,
        attachments: [
          {
            filename: "thankyou.png",
            path: path.join(process.cwd(), "public", "thankyou.png"),
            cid: "thankyou-img",
          },
        ],
        headers: {
          // Improve deliverability — mark as transactional, not bulk
          "X-Priority": "1",
          "X-Mailer": "StackForge-Mailer/1.0",
          "List-Unsubscribe": `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
        },
      });

      console.log(`[NEWSLETTER] Welcome email sent to ${trimmed} (template: ${template.subject.slice(0, 40)}...)`);
    } catch (emailErr) {
      console.error("[NEWSLETTER-EMAIL] Failed to send subscriber email:", emailErr);
      // Don't fail the request — the DB subscription was successful
    }

    return Response.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";

    if (message.includes("Unique constraint")) {
      return Response.json(
        { error: "You're already subscribed!" },
        { status: 409 }
      );
    }

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
