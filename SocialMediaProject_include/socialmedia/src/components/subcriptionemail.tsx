import sendEmailFunction from "@/lib/email";

type StripeEventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | string;

type StripeEmailDetails = {
  planName?: string;
  currency?: string;
  billingPeriodStart?: Date | string;
  billingPeriodEnd?: Date | string;
  customerEmail: string;
};

const formatDate = (d?: Date | string) => {
  if (!d) return null ;
  const date = (typeof d === "string") ? new Date(d) : d ;
  return date.toLocaleDateString();
};

function buildSubscriptionEmail(eventType: StripeEventType,details: StripeEmailDetails) : { subject: string; html: string } {
  const planName = details.planName ? details.planName : "your subscription" ;
  const customerEmail = details.customerEmail ? details.customerEmail : null ;

  const periodStart = formatDate(details.billingPeriodStart);
  const periodEnd = formatDate(details.billingPeriodEnd);

  const baseHeader = `
    <tr>
      <td style="padding: 0 0 16px 0;">
        <div style="font-size: 14px; color:#6b7280;"><b>Briezl</b> • Subscription Update</div>
        <div style="font-size: 22px; font-weight: 800; color:#111827; margin-top: 6px;">Subscription Notification</div>
      </td>
    </tr>
  `;

  const baseFooter = `
    <tr>
      <td style="padding-top: 18px; font-size: 12px; color: #6b7280; line-height: 1.6;">
        <div>Need help? Contact our support team.</div>
        <div style="margin-top: 6px;">If you didn’t expect this email, you can ignore it.</div>
      </td>
    </tr>
  `;

  let subject = "Briezl subscription update";
  let title = "Subscription update";
  let bodyLines: string[] = [];
  let accentColor = "#f59e0b";

  switch (eventType) {
    case "checkout.session.completed":
      subject = "Welcome to Briezl — subscription activated";
      title = "Subscription activated";
      accentColor = "#16a34a";
      bodyLines = [
        `Hi${customerEmail ? ` ${customerEmail}` : ""},`,
        `Your payment was successful and your subscription is now active for (${planName}) plan.`,
      ];
      if (periodStart) bodyLines.push(`Your billing period started at ${periodStart}`)
      if (periodEnd) bodyLines.push(`Your billing period ends on ${periodEnd}.`);
      break;

    case "invoice.paid":
      subject = "Briezl billing successful";
      title = "Payment received";
      accentColor = "#16a34a";
      bodyLines = [
        `Hi${customerEmail ? ` ${customerEmail}` : ""},`,
        `We received your payment successfully.`,
      ];
      break;

    case "invoice.payment_failed":
      subject = "Action needed: Briezl payment failed";
      title = "Payment failed";
      accentColor = "#dc2626";
      bodyLines = [
        `Hi${customerEmail ? ` ${customerEmail}` : ""},`,
        `Unfortunately, we couldn’t process your payment for ${planName}.`,
      ];
      break;

    case "customer.subscription.updated":
      subject = "Briezl subscription updated";
      title = "Subscription updated";
      accentColor = "#2563eb";
      bodyLines = [
        `Hi${customerEmail ? ` ${customerEmail}` : ""},`,
        `Your subscription details have been updated (${planName}).`,
      ];
      break;

    case "customer.subscription.deleted":
      subject = "Your Briezl subscription was canceled";
      title = "Subscription canceled";
      accentColor = "#64748b";
      bodyLines = [
        `Hi${customerEmail ? ` ${customerEmail}` : ""},`,
        `Your subscription was canceled. You will not be billed further for ${planName} plan.`,
      ];
      break;

    default:
      accentColor = "#f59e0b";
      bodyLines = [
        `Hi${customerEmail ? ` ${customerEmail}` : ""},`,
        `We received a subscription event and are notifying you of the update for ${planName}.`,
        `Event type: ${eventType}.`,
      ];
  }

  const safeBodyLines = bodyLines.filter(Boolean).map((l) => `<div style="margin: 0 0 8px 0;">${l}</div>`);

  const primaryCtaText = eventType === "invoice.payment_failed" ? "Update payment method" : "Manage your subscription";

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>${subject}</title>
      </head>
      <body style="margin:0; padding:0; background:#f9fafb;">
        <table role="presentation" width="100%" style="background:#f9fafb;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 28px 16px;">
              <table role="presentation" width="640" style="width:640px; max-width:640px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td style="height: 6px; background:${accentColor};"></td>
                  </tr>
                  ${baseHeader}
                  <tr>
                    <td style="padding: 0 28px 10px 28px;">
                      <div style="font-size: 18px; font-weight: 800; color:#111827; margin: 0 0 10px 0;">${title}</div>
                      <div style="font-size: 14px; color:#374151; line-height: 1.7;">
                        ${safeBodyLines.join("")}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 28px 0 28px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" align="left">
                        <tr>
                          <td style="border-radius: 10px; background:${accentColor};">
                            <a href="#" style="display:inline-block; padding: 12px 16px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                              ${primaryCtaText}
                            </a>
                          </td>
                        </tr>
                      </table>
                      <div style="clear:both;"></div>
                      <div style="margin-top: 8px; font-size: 12px; color:#6b7280;">
                        If the link doesn’t work, you can manage your subscription from your account settings.
                      </div>
                    </td>
                  </tr>
                  ${baseFooter}
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { subject, html };
}

export async function sendSubscriptionNotificationEmail(eventType: StripeEventType , details: StripeEmailDetails ) {
  const { customerEmail } = details ;
  const { subject, html } = buildSubscriptionEmail(eventType,details);

  return sendEmailFunction({ to: customerEmail, subject, html });
}

