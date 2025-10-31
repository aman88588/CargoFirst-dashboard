Build a frontend dashboard application using React + Tailwind CSS + React Router + Axios + Recharts that connects to the deployed backend
👉 https://cargofirst-dashboard-productio-backend.up.railway.app

🔐 Authentication Flow
Start by creating two pages:

Signup Page → POST /api/v1/auth/signup

Request body:

{
  "email": "user@example.com",
  "password": "Test1234",
  "role": "recruiter",
  "address": "123 Main Street, New York"
}
Signin Page → POST /api/v1/auth/signin

Request body:

{
  "email": "user@example.com",
  "password": "Test1234"
}
On successful signup/signin, store the returned JWT token in localStorage and redirect the user to the Dashboard page.

If the user is already logged in, redirect them to the Dashboard automatically.

🧭 Dashboard Layout
Once signed in, the user lands on a Dashboard Page with a clean and light UI —
Use a white + light blue color scheme, soft shadows, rounded corners, and a minimal, modern layout.

The layout should have:

Left Sidebar Navigation (sticky)

Job Posted

Profile

Customer Analysis

Logout

Main Content Area

Changes dynamically based on selected menu option.

💼 1. Job Posted Page
When the user clicks Job Posted, show:

Job Post Form
In the center of the page, display a form with these inputs:


{
  "jobTitle": "Senior Full Stack Developer",
  "jobDescription": "We are looking for an experienced Full Stack Developer proficient in React, Node.js, and MongoDB.",
  "lastDateToApply": "2025-12-31",
  "companyName": "Tech Innovations Inc"
}
Submit → POST /api/v1/dashboard/create

Use JWT token for authorization (Authorization: Bearer <token>).

Below the Form:
Display a Job History List of all jobs using:
GET /api/v1/dashboard/list

Each job card should have:

Job title

Company name

Last date to apply

Buttons: Edit and Delete

Update → PUT /api/v1/dashboard/update/:id

Delete → DELETE /api/v1/dashboard/delete/:id

Editing a job should prefill the form.

👤 2. Profile Page
When the user clicks Profile, show their profile data from:
GET /api/v1/auth/profile

Display:

Email

Role

Address

Design the profile in a card format with light colors and subtle shadow.

📊 3. Customer Analysis Page
When the user clicks Customer Analysis, display dummy analytical data using Recharts or Chart.js.

Example:

Pie chart: Distribution of job roles

Bar chart: Number of jobs posted per month

Keep the colors light and smooth — blue, sky, teal, white.

🚪 4. Logout Flow
When the user clicks Logout, show a confirmation modal:

Text:

"Are you sure you want to log out?"

Buttons:

Cancel (closes modal)

Logout (clears localStorage token and redirects to Signin page)

🧩 Tech Stack & Styling
React Router DOM → for navigation

Axios → for backend API calls

Recharts → for data visualization

Tailwind CSS → for modern and responsive UI

SweetAlert2 or ShadCN UI Modal → for logout confirmation

Use JWT Token from localStorage for all /api/v1/dashboard/* and /api/v1/auth/profile routes

🎨 Design Notes
Light theme (white + sky blue + soft gray + touch of navy for contrast)

Rounded corners (rounded-2xl)

Soft shadows for cards

Use icons from lucide-react or react-icons

Dashboard layout should be responsive and modern



Add loading spinners when API calls are in progress.

Show toast notifications on job creation, update, or delete.

Protect dashboard routes using a PrivateRoute wrapper that checks for JWT token.