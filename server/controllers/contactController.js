import Contact from "../models/Contact.js";
import { sendContactNotificationEmail } from "../utils/sendEmail.js";

// @desc   Submit a contact form (public)
// @route  POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, service, message } = req.body;

    const contact = await Contact.create({ name, email, phone, subject, service, message });

    // Fire off the email notification, but never let an SMTP hiccup fail
    // the enquiry itself — it's already safely saved above.
    try {
      await sendContactNotificationEmail({ name, email, phone, subject, service, message });
    } catch (emailError) {
      console.error("Failed to send contact notification email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all contact submissions (admin only)
// @route  GET /api/contacts
export const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a contact submission (admin only)
// @route  DELETE /api/contacts/:id
export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Contact.findByIdAndDelete(req.params.id);

    if (!submission) {
      const error = new Error("Submission not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};