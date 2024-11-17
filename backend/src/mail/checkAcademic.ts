import fs from "fs";
import path from "path";

// Function to check if an email has a valid college domain
function checkCollegeEmail(email: string): boolean {
  // Use process.cwd() to get the current directory
  const filePath = path.join(process.cwd(), "/src/mail/emails.json");

  // Read the domains from the JSON file
  const domains: string[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Extract the domain from the email
  const emailDomain = email.split("@")[1];

  // Check if the domain exists in the JSON file
  return domains.includes(emailDomain);
}

export default checkCollegeEmail;
