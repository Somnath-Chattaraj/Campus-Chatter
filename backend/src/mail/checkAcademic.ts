import fs from 'fs';
import path from 'path';

// Function to check if an email has a valid college domain
function checkCollegeEmail(email: string): boolean {
    // Get the directory name of the current module
    const __dirname = path.resolve(); // CommonJS way to get the directory path

    const filePath = path.join(__dirname, '/src/mail/emails.txt');
    const domains = fs.readFileSync(filePath, 'utf8').split('\n').map(domain => domain.trim());

    // Extract the domain from the email
    const emailDomain = email.split('@')[1];

    // Check if the email domain is in the list of college domains
    return domains.includes(emailDomain);
}

export default checkCollegeEmail;
