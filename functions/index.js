const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const BUSINESS_NAME = 'Kabab Hut Catering';
const BUSINESS_EMAIL = 'kababhutatlanta@gmail.com';
const BUSINESS_PHONE = '(770) 925-4440';
const BUSINESS_ADDRESS = '880 Indian Trail Lilburn Rd NW, Lilburn, GA 30047';
const BUSINESS_WEBSITE = 'https://kababhutatl.com/';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeEmail(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function isLikelyEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildEmailHtml({ orderId, order = {} }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const userDetails = order.userDetails || {};
  const addressParts = [
    userDetails.addressLine1,
    userDetails.addressLine2,
    userDetails.city,
    userDetails.state,
    userDetails.zipCode,
  ]
    .filter(Boolean)
    .join(', ');
  const rows = items
    .map((item, idx) => {
      const name = item?.name || 'Unnamed item';
      const type = item?.type || 'menu';
      const quantity = Number.isFinite(Number(item?.quantity)) ? Math.max(1, Number(item.quantity)) : 1;
      const priceLabel = item?.priceLabel || 'Contact for pricing';
      const price = Number.isFinite(Number(item?.price)) ? `$${Number(item.price).toFixed(2)}` : 'N/A';
      const lineTotal = Number.isFinite(Number(item?.price))
        ? `$${(Number(item.price) * quantity).toFixed(2)}`
        : 'N/A';

      return `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${name}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${type}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${priceLabel}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${price}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${lineTotal}</td>
        </tr>
      `;
    })
    .join('');

  const total = Number.isFinite(Number(order.total)) ? `$${Number(order.total).toFixed(2)}` : 'Contact for quote';

  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px;">
      <div style="max-width:760px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7f1d1d,#b91c1c);color:#fff;padding:18px 20px;">
          <h2 style="margin:0;font-size:22px;">New Catering Order</h2>
          <p style="margin:6px 0 0 0;opacity:0.95;">Order ID: <strong>${orderId}</strong></p>
        </div>

        <div style="padding:20px;">
          <h3 style="margin:0 0 10px 0;color:#111827;">Customer Details</h3>
          <p style="margin:0 0 6px 0;"><strong>Full Name:</strong> ${userDetails.fullName || 'N/A'}</p>
          <p style="margin:0 0 6px 0;"><strong>Phone:</strong> ${userDetails.phone || 'N/A'}</p>
          <p style="margin:0 0 6px 0;"><strong>User ID:</strong> ${order.userId || 'N/A'}</p>
          <p style="margin:0 0 6px 0;"><strong>Email:</strong> ${order.userEmail || 'N/A'}</p>
          <p style="margin:0 0 6px 0;"><strong>Address:</strong> ${addressParts || 'Not provided'}</p>
          <p style="margin:0 0 6px 0;"><strong>Event Date:</strong> ${order.eventDate || 'Not provided'}</p>
          <p style="margin:0 0 6px 0;"><strong>Guest Count:</strong> ${order.guestCount || 'Not provided'}</p>
          <p style="margin:0 0 14px 0;"><strong>Notes:</strong> ${order.notes || 'None'}</p>

          <h3 style="margin:0 0 10px 0;color:#111827;">Order Items (${items.length})</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">#</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Item</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Type</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Qty</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Price Label</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Price</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="7" style="padding:8px;border:1px solid #e5e7eb;">No items found.</td></tr>'}
            </tbody>
          </table>

          <p style="margin:14px 0 0 0;font-size:16px;color:#111827;"><strong>Estimated Total:</strong> ${total}</p>
        </div>
      </div>
    </div>
  `;
}

function buildEmailText({ orderId, order = {} }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const userDetails = order.userDetails || {};
  const addressParts = [
    userDetails.addressLine1,
    userDetails.addressLine2,
    userDetails.city,
    userDetails.state,
    userDetails.zipCode,
  ]
    .filter(Boolean)
    .join(', ');
  const itemLines = items
    .map((item, idx) => {
      const name = item?.name || 'Unnamed item';
      const type = item?.type || 'menu';
      const quantity = Number.isFinite(Number(item?.quantity)) ? Math.max(1, Number(item.quantity)) : 1;
      const priceLabel = item?.priceLabel || 'Contact for pricing';
      const price = Number.isFinite(Number(item?.price)) ? `$${Number(item.price).toFixed(2)}` : 'N/A';
      const lineTotal = Number.isFinite(Number(item?.price))
        ? `$${(Number(item.price) * quantity).toFixed(2)}`
        : 'N/A';
      return `${idx + 1}. ${name} (${type}) | qty ${quantity} | ${priceLabel} | unit ${price} | line ${lineTotal}`;
    })
    .join('\n');

  const total = Number.isFinite(Number(order.total)) ? `$${Number(order.total).toFixed(2)}` : 'Contact for quote';

  return [
    `New Catering Order: ${orderId}`,
    '',
    `Full Name: ${userDetails.fullName || 'N/A'}`,
    `Phone: ${userDetails.phone || 'N/A'}`,
    `User ID: ${order.userId || 'N/A'}`,
    `Email: ${order.userEmail || 'N/A'}`,
    `Address: ${addressParts || 'Not provided'}`,
    `Event Date: ${order.eventDate || 'Not provided'}`,
    `Guest Count: ${order.guestCount || 'Not provided'}`,
    `Notes: ${order.notes || 'None'}`,
    '',
    `Items (${items.length}):`,
    itemLines || 'No items found.',
    '',
    `Estimated Total: ${total}`,
  ].join('\n');
}

function buildCustomerEmailHtml({ orderId, order = {} }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const userDetails = order.userDetails || {};
  const customerName = userDetails.fullName || 'there';
  const rows = items
    .map((item, idx) => {
      const name = escapeHtml(item?.name || 'Unnamed item');
      const type = escapeHtml(item?.type || 'menu');
      const quantity = Number.isFinite(Number(item?.quantity)) ? Math.max(1, Number(item.quantity)) : 1;
      const priceLabel = escapeHtml(item?.priceLabel || 'Contact for pricing');

      return `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${name}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${type}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${priceLabel}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px;">
      <div style="max-width:720px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7f1d1d,#b91c1c);color:#fff;padding:18px 20px;">
          <h2 style="margin:0;font-size:22px;">We received your catering request</h2>
          <p style="margin:6px 0 0 0;opacity:0.95;">Order ID: <strong>${escapeHtml(orderId)}</strong></p>
        </div>

        <div style="padding:20px;color:#111827;">
          <p style="margin:0 0 14px 0;">Hi ${escapeHtml(customerName)},</p>
          <p style="margin:0 0 14px 0;">
            Thank you for placing your catering request with ${BUSINESS_NAME}. Our team has received
            your order details and will contact you shortly to confirm availability, pricing, and next steps.
          </p>

          <h3 style="margin:18px 0 10px 0;color:#111827;">Event Details</h3>
          <p style="margin:0 0 6px 0;"><strong>Event Date:</strong> ${escapeHtml(order.eventDate || 'Not provided')}</p>
          <p style="margin:0 0 6px 0;"><strong>Guest Count:</strong> ${escapeHtml(order.guestCount || 'Not provided')}</p>
          <p style="margin:0 0 14px 0;"><strong>Notes:</strong> ${escapeHtml(order.notes || 'None')}</p>

          <h3 style="margin:18px 0 10px 0;color:#111827;">Order Items (${items.length})</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">#</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Item</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Type</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Qty</th>
                <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Pricing</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="5" style="padding:8px;border:1px solid #e5e7eb;">No items found.</td></tr>'}
            </tbody>
          </table>

          <h3 style="margin:18px 0 10px 0;color:#111827;">Contact Kabab Hut</h3>
          <p style="margin:0 0 6px 0;"><strong>Email:</strong> ${BUSINESS_EMAIL}</p>
          <p style="margin:0 0 6px 0;"><strong>Phone:</strong> ${BUSINESS_PHONE}</p>
          <p style="margin:0 0 6px 0;"><strong>Address:</strong> ${BUSINESS_ADDRESS}</p>
          <p style="margin:0;"><strong>Website:</strong> <a href="${BUSINESS_WEBSITE}">${BUSINESS_WEBSITE}</a></p>
        </div>
      </div>
    </div>
  `;
}

function buildCustomerEmailText({ orderId, order = {} }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const userDetails = order.userDetails || {};
  const customerName = userDetails.fullName || 'there';
  const itemLines = items
    .map((item, idx) => {
      const name = item?.name || 'Unnamed item';
      const type = item?.type || 'menu';
      const quantity = Number.isFinite(Number(item?.quantity)) ? Math.max(1, Number(item.quantity)) : 1;
      const priceLabel = item?.priceLabel || 'Contact for pricing';
      return `${idx + 1}. ${name} (${type}) | qty ${quantity} | ${priceLabel}`;
    })
    .join('\n');

  return [
    `We received your catering request: ${orderId}`,
    '',
    `Hi ${customerName},`,
    '',
    `Thank you for placing your catering request with ${BUSINESS_NAME}. Our team has received your order details and will contact you shortly to confirm availability, pricing, and next steps.`,
    '',
    'Event Details:',
    `Event Date: ${order.eventDate || 'Not provided'}`,
    `Guest Count: ${order.guestCount || 'Not provided'}`,
    `Notes: ${order.notes || 'None'}`,
    '',
    `Order Items (${items.length}):`,
    itemLines || 'No items found.',
    '',
    'Contact Kabab Hut:',
    `Email: ${BUSINESS_EMAIL}`,
    `Phone: ${BUSINESS_PHONE}`,
    `Address: ${BUSINESS_ADDRESS}`,
    `Website: ${BUSINESS_WEBSITE}`,
  ].join('\n');
}

function getMailer() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('Missing SMTP config. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

exports.sendOrderEmailToAdmin = onDocumentCreated(
  {
    document: 'orders/{orderId}',
    secrets: [
      'ADMIN_ORDER_EMAIL',
      'FROM_EMAIL',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
    ],
  },
  async (event) => {
  const adminOrderEmail = process.env.ADMIN_ORDER_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;

  if (!adminOrderEmail) {
    logger.error('Missing ADMIN_ORDER_EMAIL env variable.');
    return;
  }

  if (!event.data) {
    logger.error('No event data found.');
    return;
  }

  const orderId = event.params.orderId;
  const order = event.data.data() || {};
  const customerEmail = normalizeEmail(order.userEmail);

  try {
    const transporter = getMailer();

    await transporter.sendMail({
      from: fromEmail,
      to: adminOrderEmail,
      subject: `New Catering Order #${orderId}`,
      text: buildEmailText({ orderId, order }),
      html: buildEmailHtml({ orderId, order }),
    });

    logger.info('Order email sent', { orderId, to: adminOrderEmail });

    let customerEmailDelivery = {
      status: 'skipped',
      reason: 'missing_or_invalid_customer_email',
      checkedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (isLikelyEmail(customerEmail)) {
      try {
        await transporter.sendMail({
          from: fromEmail,
          to: customerEmail,
          replyTo: adminOrderEmail,
          subject: `Kabab Hut Catering received your order #${orderId}`,
          text: buildCustomerEmailText({ orderId, order }),
          html: buildCustomerEmailHtml({ orderId, order }),
        });

        customerEmailDelivery = {
          status: 'sent',
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        logger.info('Customer order email sent', { orderId, to: customerEmail });
      } catch (customerError) {
        customerEmailDelivery = {
          status: 'failed',
          failedAt: admin.firestore.FieldValue.serverTimestamp(),
          error: customerError?.message || String(customerError),
        };

        logger.error('Failed to send customer order email', {
          orderId,
          to: customerEmail,
          error: customerError?.message || customerError,
        });
      }
    } else {
      logger.warn('Customer order email skipped', { orderId, customerEmail });
    }

    await admin.firestore().doc(`orders/${orderId}`).set(
      {
        emailDelivery: {
          status: 'sent',
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        customerEmailDelivery,
      },
      { merge: true }
    );
  } catch (error) {
    await admin.firestore().doc(`orders/${orderId}`).set(
      {
        emailDelivery: {
          status: 'failed',
          failedAt: admin.firestore.FieldValue.serverTimestamp(),
          error: error?.message || String(error),
        },
      },
      { merge: true }
    );

    logger.error('Failed to send order email', { orderId, error: error?.message || error });
  }
  }
);
