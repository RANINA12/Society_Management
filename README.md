<div align="center">
  <img src="client/public/logo.png" alt="Society Manage Logo">
</div>

<h1>Society Manage</h1>
<p>
  Welcome to <strong>Society Manage</strong>, your one-stop platform for local services. Whether you need a handyman, plumber, maid, or any other service, Society Manage connects you with trusted professionals in your area. Our easy-to-use interface lets you quickly find and book the services you need, making life easier and more convenient.
</p>

<br>

<h2>Features 🎯</h2>
<ul>
  <li><strong>Service Selection:</strong> Browse and select from a wide range of local services.</li>
  <li><strong>Service Details:</strong> View detailed information, including descriptions, availability, and estimated completion times.</li>
  <li><strong>Service Booking:</strong> Book services directly through the platform, choosing your preferred date and time.</li>
  <li><strong>Service Provider Ratings:</strong> Read and contribute to ratings and reviews to make informed decisions.</li>
  <li><strong>Service History:</strong> Track your service history, including past bookings and completed services.</li>
  <li><strong>Service Search:</strong> Use the search bar to find specific services or providers in your area.</li>
</ul>

<h2>Technologies Used 🛠️</h2>
<ul>
  <li><strong>React.js:</strong> A JavaScript library for building user interfaces.</li>
  <li><strong>React Router:</strong> A library for routing in React applications.</li>
  <li><strong>Node.js:</strong> A JavaScript runtime for server-side development.</li>
  <li><strong>Express:</strong> A minimalist web framework for Node.js.</li>
  <li><strong>MongoDB:</strong> A NoSQL database for storing and retrieving data.</li>
</ul>

<h2>Architecture 🏗️</h2>
<p>
  Society Manage follows a client-server architecture. The client-side, built with React.js, ensures a seamless user experience. The server-side, powered by Node.js and Express, handles requests and manages data stored in MongoDB. RESTful APIs facilitate communication between the client and server.
</p>

<br>

<h1>🚀 Getting Started</h1>
<p>
  To get started, download the zip file of the repository or use:
  <br>
  <code>git clone https://github.com/ranina12/society_management.git</code>
</p>
<p>
  Navigate to the project's root directory. The project consists of two folders: <code>client</code> and <code>server</code>.
</p>
<p>
  Before starting the servers, install dependencies by running <code>npm install</code> in both folders.
</p>

<h3>Environment Variables</h3>
<p>
  Create the following <code>.env</code> files:
</p>

<ul>
  <li>
    <strong>Client-side (.env in <code>client</code>):</strong><br>
    <code>REACT_APP_MAPBOX_ACCESS_TOKEN</code> – API key for Mapbox<br>
    <code>REACT_APP_BACKEND_API</code> – Base URL of the API server (e.g., <code>http://localhost:3000</code>)<br>
    <code>REACT_APP_STRIPE_KEY</code> – API key for Stripe
  </li>
  <li>
    <strong>Server-side (.env in <code>server</code>):</strong><br>
    <code>MONGODB_URI</code> – Connection string for MongoDB Atlas<br>
    <code>NODE_MAILER_USER</code> – Email address for sending notifications<br>
    <code>NODE_MAILER_PASS</code> – Email password<br>
    <code>JWT_SECRET</code> – Secret key for JWT tokens
  </li>
</ul>

<p>
  <strong>Start the Servers:</strong><br>
  Client-side: <code>npm start</code><br>
  Server-side: <code>npm start</code> or <code>nodemon index.js</code>
</p>

<br>

<h1>👉 How to Use the Site</h1>
<p>Here's a guide to navigating Society Manage:</p>

<ul>
  <li><strong>Browse Services:</strong> On the homepage, view a list of services or use the search bar. Click on a service for details.</li>
  <li><strong>Service Details:</strong> Find descriptions, availability . Click "Book Now" to proceed.</li>
  <li><strong>Login or Signup:</strong> Log in or create a new account to complete the booking.</li>
  <li><strong>Confirmation and Payment:</strong> Review booking details and proceed to secure payment.</li>

  <li><strong>User Dashboard:</strong> Manage your profile, view history, and adjust preferences.</li>
</ul>

<br>

<h1>👥 Our Team</h1>
<ul>
  <li>
    <strong>Nikunj Bisani:</strong><br>
    Connect on <a href="https://www.linkedin.com/in/nikunjbisani/">LinkedIn</a> and <a href="https://github.com/ranina12">GitHub</a>.
  </li>
</ul>

<br>

<h1>🙌 Contributions</h1>
<p>
  We welcome contributions! If you have suggestions or improvements, submit a pull request or open an issue.
</p>
