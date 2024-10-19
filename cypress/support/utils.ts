export function getTime() {
  let currentDate = new Date();
  let timestamp = currentDate.getTime();
  return timestamp;
}

export function getRandomCharCode() {
  return Math.floor(Math.random() * (122 - 97 + 1)) + 97;
}

// Function to generate a random date string in "YYYY-MM-DD" format
export function getRandomDateString() {
  // Generate random year between 1990 and 2004
  const randomYear = Math.floor(Math.random() * (2004 - 1990 + 1)) + 1990;

  // Generate random month between 1 and 12
  const randomMonth = Math.floor(Math.random() * 12) + 1;

  // Generate random date between 1 and 28 (assuming all months have 28 days for simplicity)
  const randomDate = Math.floor(Math.random() * 28) + 1;

  // Construct random date string in "YYYY-MM-DD" format
  const randomDateString = `${randomYear}-${randomMonth
    .toString()
    .padStart(2, "0")}-${randomDate.toString().padStart(2, "0")}`;

  return randomDateString;
}

export const server_env = "dev";

export const nurseEmail = Cypress.env("nurseEmail");
export const nursePassword = Cypress.env("nursePassword");
export const prescriberEmail = Cypress.env("prescriberEmail");
export const prescriberPassword = Cypress.env("prescriberPassword");
export const nurseName = "SCSS Nurse";
export const doctorName = "Rick Cooper";
export const options = { yes: "Yes", no: "No" };
export const emailDomain = "@scssconsulting.com";
export const emailPrefix = "suraj.anand";
export const patientEmail = `${emailPrefix}+${getTime()}${emailDomain}`;
export const patientPassword = "Test@123";

// Function to get the current date and future date in various formats
export const getDateInfo = (daysToAdd = 0) => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + daysToAdd);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    return { year, month, day, fullDate: `${year}-${month}-${day}` };
  };

  return {
    current: formatDate(currentDate),
    future: formatDate(futureDate),
  };
};

// Function to get the current date in "DD MMM YYYY" format
export const getCurrentFormattedDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[currentDate.getMonth()];
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${day} ${month} ${year}`;
};

export const applicationStatus = {
  nurseApproved: "Nurse Approved",
  prescriberConsultationPending: "Prescriber Consultation Pending",
  prescribed: "Prescribed",
};

export const expectedUrl = {
  login: "/login",
  dashboard: "/dashboard",
  paymentSuccessUrl: "/dashboard?status=success&page=1",
  bookingSuccess: "/booking-success",
};

export const gender = ["Male", "Female", "Others"];

export function getRandomGender(): string {
  return Cypress._.sample(gender) as string;
}

export const cardDetail = {
  cardNo: "4111111111111111",
  month: "06",
  year: "2025",
  cvv: "123",
};

/**
 * Format a Date object to "DD/MM/YYYY" format.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parse a date string in "DD/MM/YYYY" format to a Date object.
 * @param {string} dateStr - The date string to parse.
 * @returns {Date} - The parsed Date object.
 */
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Generate a start date that is one day later than today in the format "DD/MM/YYYY".
 * @returns {string} - The formatted start date.
 */
export function generateFormattedStartDate(): string {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // Start date is one day after today
  return formatDate(startDate);
}

/**
 * Generate an end date that is 30 days after the start date in the format "DD/MM/YYYY".
 * @param {string} startDateStr - The start date in "DD/MM/YYYY" format.
 * @returns {string} - The formatted end date.
 */
export function generateFormattedEndDate(startDateStr: string): string {
  const startDate = parseDate(startDateStr);
  startDate.setDate(startDate.getDate() + 30); // End date is 30 days after the start date
  return formatDate(startDate);
}
