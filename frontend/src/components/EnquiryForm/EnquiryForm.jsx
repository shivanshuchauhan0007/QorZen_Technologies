import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
  HelpCircle,
  Tag
} from 'lucide-react';
import './EnquiryForm.css';
import { submitContactForm } from '../../api/publicApi';

// Subject options for backend sorting & lead categorization
const subjectOptions = [
  'Project Enquiry',
  'Course Doubt & Counseling',
  'Internship Query',
  'Enterprise IT Services',
  'General Inquiry'
];

// Service / Domain interest options
const serviceOptions = [
  'AI & Automation Solutions',
  'Web & Enterprise Software Development',
  'Digital Marketing & Growth',
  'Cyber Security Auditing',
  'Cloud & DevOps Solutions',
  'Course Guidance & Curriculum Help',
  'Internship Duration & Stipend Info'
];

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string} props.badge
 * @param {string} props.defaultSubject
 * @param {string} props.buttonText
 */
const EnquiryForm = ({
  title = 'Start Your Project Today!',
  subtitle = 'Schedule a consultation with our senior architects or specialists. Tell us about your enterprise goals or doubts.',
  
  defaultSubject = 'Project Enquiry',
  buttonText = 'Submit Enquiry'
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: defaultSubject,
    service: serviceOptions[0],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Backend expects `name`, the form tracks it as `fullName`
      await submitContactForm({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        service: formData.service,
        message: formData.message
      });

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: defaultSubject,
        service: serviceOptions[0],
        message: ''
      });
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message || 'Something went wrong while submitting your enquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="enquiry-global-section">
      <div className="container">
        <div className="enquiry-card-wrapper">
       
          <div className="enquiry-left-info">
           
            <h2 className="enquiry-title">{title}</h2>
            <p className="enquiry-description">{subtitle}</p>

            <div className="enquiry-highlights">
              <div className="highlight-item">
                <CheckCircle2 size={18} className="highlight-check" />
                <span>24-Hour Guaranteed Response Time</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={18} className="highlight-check" />
                <span>Direct Access to Senior Architects & Advisors</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="enquiry-right-form">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="enquiry-success-box"
              >
                <CheckCircle2 size={56} className="success-icon" />
                <h3>Request Received!</h3>
                <p>
                  Thank you for contacting QorZen Technologies. Your enquiry (Category: <strong>{formData.subject || defaultSubject}</strong>) has been logged. An expert will reach out within 2 hours.
                </p>
                <button
                  className="btn-send-another"
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="enquiry-form">
                <div className="form-header-row">
                  <h3 className="form-heading">Send Your Details</h3>
                </div>

                <div className="form-group-grid">
                  {/* Full Name */}
                  <div className="form-field">
                    <label htmlFor="fullName">Full Name *</label>
                    <div className="input-with-icon">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        autoComplete="name"
                        required
                        placeholder="e.g., Rahul Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Work / Personal Email */}
                  <div className="form-field">
                    <label htmlFor="email">Email Address *</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-grid">
                  {/* Phone Number */}
                  <div className="form-field">
                    <label htmlFor="phone">Phone Number *</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        autoComplete="tel"
                        required
                        placeholder="+91 99175 29504"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Subject / Query Type (For Backend Lead Sorting) */}
                  <div className="form-field">
                    <label htmlFor="subject">Subject / Lead Category *</label>
                    <div className="input-with-icon">
                      <HelpCircle size={16} className="input-icon" />
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        {subjectOptions.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Service / Domain Interest */}
                <div className="form-field">
                  <label htmlFor="service">Service / Area of Interest *</label>
                  <div className="input-with-icon">
                    <Briefcase size={16} className="input-icon" />
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="form-field">
                  <label htmlFor="message">Message / Doubts / Project Details *</label>
                  <div className="input-with-icon textarea-icon-wrap">
                    <MessageSquare size={16} className="input-icon textarea-icon" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={3}
                      placeholder="Briefly describe your requirements, questions, or doubts..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                {submitError && (
                  <p className="enquiry-error-text" role="alert" style={{ color: '#dc2626', fontSize: '0.875rem', margin: '4px 0 0' }}>
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit-enquiry"
                >
                  <span>{isSubmitting ? 'Submitting...' : buttonText}</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
