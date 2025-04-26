# CleanUpMap

CleanUpMap is a community-driven web application that allows users to report garbage spots on an interactive map.  
The goal is to raise environmental awareness and help coordinate local cleanup efforts by providing a simple platform for users to mark problem areas and track progress in real time.

## Features

- User Registration and Login (Firebase Authentication)
- Report garbage spots by clicking on the map
- Real-time marker updates using Firebase Firestore
- Users can delete their own reports
- Admin can mark reports as "Completed" (turns marker green)
- Admin dashboard for managing reports
- Responsive design for mobile and desktop devices

## Tech Stack

- HTML, CSS, JavaScript
- Firebase (Authentication + Firestore)
- Google Maps JavaScript API

## Google Technologies Used

- **Google Maps API**: Displays the map, handles user clicks, and places custom markers.
- **Firebase Authentication**: Manages user registration and login.
- **Firebase Firestore**: Stores marker data with real-time synchronization.
- **Firebase Hosting** (optional): Can be used to deploy the application online.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/CleanUpMap.git
   ```

2. Add your Firebase project configuration to `firebase-config.js`.

3. Add your Google Maps API key in `index.html` (replace the placeholder key).

4. Open `index.html` in your browser to run the app locally.

5. (Optional) Deploy the project using Firebase Hosting.

## License

This project is open source and free to use.
