import emailjs from '@emailjs/browser';

// =============================================
// EmailJS Configuration
// Replace these with your actual EmailJS credentials
// See EMAIL_SETUP.md for step-by-step instructions
// =============================================
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_xxxxxxx',        // Your EmailJS service ID
    TEMPLATE_VERIFICATION: 'template_verify',  // Verification code template ID
    TEMPLATE_ALERT: 'template_alert',          // Attendance alert template ID
    PUBLIC_KEY: 'your_public_key_here',        // Your EmailJS public key
};

let initialized = false;

function init() {
    if (!initialized) {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        initialized = true;
    }
}

/**
 * Generate a random 6-digit verification code
 */
export function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Send a verification code to the user's email
 * @param {string} toEmail - recipient email
 * @param {string} toName - recipient name
 * @param {string} code - 6-digit code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendVerificationCode(toEmail, toName, code) {
    init();
    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_VERIFICATION, {
            to_email: toEmail,
            to_name: toName,
            verification_code: code,
            from_name: 'Greenwood Institute of Technology',
        });
        return { success: true };
    } catch (err) {
        console.error('EmailJS verification error:', err);
        return { success: false, error: err?.text || 'Failed to send verification email' };
    }
}

/**
 * Send a low-attendance alert email
 * @param {string} toEmail - recipient (student or guardian email)
 * @param {string} studentName - student name
 * @param {string} courseName - course with low attendance
 * @param {number} percentage - current attendance %
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendAttendanceAlert(toEmail, studentName, courseName, percentage) {
    init();
    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ALERT, {
            to_email: toEmail,
            student_name: studentName,
            course_name: courseName,
            attendance_percentage: percentage,
            from_name: 'Greenwood Institute of Technology',
            threshold: '75%',
        });
        return { success: true };
    } catch (err) {
        console.error('EmailJS alert error:', err);
        return { success: false, error: err?.text || 'Failed to send alert email' };
    }
}
