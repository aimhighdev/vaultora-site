const resend = require('resend')({ apiKey: process.env.RESEND_API_KEY });

exports.handler = async (event) => {
    const { formType, recipientEmail } = JSON.parse(event.body);

    let subject, html;

    switch (formType) {
        case 'investment':
            subject = 'Investment Inquiry';
            html = `<html><body><h1>Thank You for Your Investment Inquiry</h1><p>We appreciate your interest in Vaultora. Our team will reach out to you shortly.</p></body></html>`;
            break;
        case 'loan':
            subject = 'Loan Application Submitted';
            html = `<html><body><h1>Thank You for Your Loan Application</h1><p>Your loan application has been received. We will review it and get back to you soon.</p></body></html>`;
            break;
        case 'eligibility':
            subject = 'Eligibility Form Submission';
            html = `<html><body><h1>Thank You for Your Eligibility Submission</h1><p>We have received your eligibility details and will contact you shortly.</p></body></html>`;
            break;
        case 'partnership':
            subject = 'Partnership Inquiry';
            html = `<html><body><h1>Thank You for Your Partnership Inquiry</h1><p>We appreciate your interest in partnering with Vaultora. Our team will review your request and contact you soon.</p></body></html>`;
            break;
        default:
            return { statusCode: 400, body: 'Invalid form type.' };
    }

    // Sending email through Resend API
    try {
        await resend.emails.send({
            from: 'no-reply@vaultora.com',
            to: recipientEmail,
            subject: subject,
            html: html,
        });

        return { statusCode: 200, body: 'Email sent successfully.' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { statusCode: 500, body: 'Failed to send email.' };
    }
};
