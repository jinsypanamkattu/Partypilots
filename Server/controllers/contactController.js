const sendMail = require('../mailer/mailer.js');
const User = require('../models/User.js');

const contactFormSubmit = async (req, res) => {
    console.log("enetere");
    const { name, email, subject, message } = req.body;
    console.log(req.body);
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find admin user
        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const adminEmail = admin.email;

        // Prepare email content
        /* const emailContent = `
             Name: ${name}
             Email: ${email}
             Subject: ${subject}
             Message: ${message}
         `;*/
        const emailContent = `
  <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; background: #ffffff; border: 1px solid #E0E0E0;">
    
    <!-- Header with site name -->
    <div style="background: #3f51b5; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0; font-size: 1.8em;">PartyPilot</h1>
      <p style="margin: 5px 0; font-size: 1em;">Event Management Platform</p>
    </div>

    <div style="padding: 20px;">
      <h2 style="color: #3f51b5; margin-bottom: 20px; border-bottom: 2px solid #3f51b5; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      <div style="margin-bottom: 20px;">
        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3f51b5; text-decoration: none;">${email}</a></p>
        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
      </div>
      <div style="padding: 15px; background: #f5f5f5; border-radius: 4px; border: 1px solid #e0e0e0;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="white-space: pre-line; margin: 0;">${message}</p>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <p style="font-size: 0.9em; color: #757575;">This message was sent via the <strong>PartyPilot</strong> contact form.</p>
      </div>
    </div>
  </div>
`;


        // Use the reusable mailer function
        await sendMail(adminEmail, `Partypilot: Contact Form Submission: ${subject}`, emailContent);

        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send messadddge. Please try again later.' });
    }
};

module.exports = { contactFormSubmit };
