from flask import Flask, render_template, request, jsonify, abort
from flask_mail import Mail, Message
import os

app = Flask(__name__)

# --- GMAIL CONFIGURATION ---
# IMPORTANT: You must use an "App Password" from your Google Account settings
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'kadariyoucef663@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-app-password'  # Replace with your app password
app.config['MAIL_DEFAULT_SENDER'] = 'kadariyoucef663@gmail.com'

mail = Mail(app)

# --- PROJECTS DATA ---
PROJECTS = {
    'taxi_app': {
        'name': 'Taxi App',
        'icon': '🚖',
        'image': 'taxi_app.png',
        'tags': ['Flutter', 'Firebase', 'Maps API'],
        'short_desc': 'A full-featured ride-hailing application similar to Uber/Bolt.',
        'full_desc': 'A comprehensive taxi booking platform built with Flutter. It features real-time GPS tracking for both riders and drivers, an intelligent matching algorithm, secure in-app payments via Stripe/PayPal integration, and a complete trip history. The backend is powered by Firebase for real-time data synchronization and authentication.',
        'languages': 'Dart (Flutter), JavaScript (Firebase Functions)',
        'features': ['Real-time location tracking', 'Driver matching system', 'Integrated payments', 'Ratings & Reviews']
    },
    'language_app': {
        'name': 'Language Learning App',
        'icon': '📚',
        'image': 'language_app.png',
        'tags': ['Flutter', 'SQLite', 'TTS'],
        'short_desc': 'An interactive app with lessons, quizzes, and flashcards.',
        'full_desc': 'An immersive language learning experience designed to make education fun and effective. The app includes structured lessons across multiple levels, interactive quizzes with instant feedback, and a smart flashcard system for vocabulary retention. It uses Text-to-Speech (TTS) for accurate pronunciation guidance and SQLite for offline progress tracking.',
        'languages': 'Dart (Flutter)',
        'features': ['Interactive Quizzes', 'Smart Flashcards', 'Text-to-Speech Pronunciation', 'Offline Mode Support']
    },
    'quran_app': {
        'name': 'Quran App',
        'icon': '☪️',
        'image': 'quran_ap.png',
        'tags': ['Flutter', 'API', 'Audio'],
        'short_desc': 'A beautiful Quran reading app with multi-reciter audio.',
        'full_desc': 'A spiritually enriching Quran application featuring a clean, readable Arabic font with multiple translation options. Users can listen to various world-renowned reciters with high-quality audio streaming. The app also includes prayer times, Qibla direction, and advanced bookmarking features to keep track of daily reading goals.',
        'languages': 'Dart (Flutter)',
        'features': ['Multi-Reciter Audio', 'Verse Translations', 'Prayer Times & Qibla', 'Night Mode Optimized UI']
    },
    'instagram_clone': {
        'name': 'Instagram Clone',
        'icon': '📷',
        'image': 'instagram_clone.png',
        'tags': ['Flutter', 'Firebase', 'Storage'],
        'short_desc': 'Social media clone with photo uploading and stories.',
        'full_desc': 'A pixel-perfect social media platform mimicking the core functionalities of Instagram. Users can upload photos with filters, share stories that disappear after 24 hours, follow friends, and interact through likes and comments. The app utilizes Firebase Storage for high-speed media hosting and Cloud Firestore for real-time social interactions.',
        'languages': 'Dart (Flutter), NoSQL (Firestore)',
        'features': ['Photo & Story Uploads', 'Real-time Likes/Comments', 'User Following System', 'Dynamic Activity Feed']
    },
    'camera_app': {
        'name': 'Camera Surveillance',
        'icon': '📹',
        'image': 'camera_app.png',
        'tags': ['Python', 'OpenCV', 'Flask'],
        'short_desc': 'Smart surveillance system with motion detection.',
        'full_desc': 'An AI-powered security solution that turns any camera into a smart surveillance tool. Using Python and OpenCV, the system detects motion and trigger alerts or recordings automatically. It features a web-based dashboard built with Flask for live streaming and reviewing historical footage securely from any device.',
        'languages': 'Python, HTML/CSS/JS',
        'features': ['Real-time Motion Detection', 'Live Web Streaming', 'Auto-recording on Event', 'Email/Push Notifications']
    },
    'farmer_app': {
        'name': 'Farmer App (AGRI-LOC)',
        'icon': '🌾',
        'image': 'farmer_app.png',
        'tags': ['Flutter', 'SQLite', 'Maps'],
        'short_desc': 'Agricultural platform for renting/lending equipment.',
        'full_desc': 'AGRI-LOC is a community-driven platform designed to modernize agricultural logistics. Farmers can list their machinery for rent or find equipment available nearby using an interactive map. The app handles the entire reservation process, generates PDF invoices, and supports both Arabic and French to serve a diverse user base.',
        'languages': 'Dart (Flutter), SQLite (Local Storage)',
        'features': ['Machinery Marketplace', 'Interactive Map Search', 'Multi-Language Support', 'PDF Invoice Generation']
    },
    'cooperative_app': {
        'name': 'Cooperative App',
        'icon': '🤝',
        'image': 'farmer_app.png', # Reusing farmer app image as per request
        'tags': ['Flutter', 'PostgreSQL', 'Flask'],
        'short_desc': 'Management system for agricultural cooperatives.',
        'full_desc': 'A robust organizational tool for cooperative managers to track member contributions, inventory, and shared equipment. It provides detailed financial reporting, member management dashboards, and automated reservation systems. Built with a scalable Flask backend and PostgreSQL database to ensure data integrity.',
        'languages': 'Dart (Flutter), Python (Flask), SQL',
        'features': ['Member Management', 'Financial Reporting', 'Inventory Tracking', 'Equipment Scheduling']
    },
    'autoparts_app': {
        'name': 'Auto Parts App',
        'icon': '🔧',
        'image': 'autoparts_app.png',
        'tags': ['Flutter', 'PostgreSQL', 'Python'],
        'short_desc': 'E-commerce platform for automotive parts.',
        'full_desc': 'A high-performance e-commerce solution tailored for the automotive industry. It features an advanced search engine that filters parts by car make, model, and year. The application includes a secure shopping cart, detailed order tracking, and a seller dashboard for managing listings and orders in real-time.',
        'languages': 'Dart (Flutter), Python (FastAPI/Flask)',
        'features': ['Advanced Part Filtering', 'Secure Checkout Flow', 'Seller Inventory Tools', 'Order Status Tracking']
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/project/<project_id>')
def project_detail(project_id):
    project = PROJECTS.get(project_id)
    if not project:
        abort(404)
    return render_template('project.html', project=project)

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name', '')
        email = data.get('email', '')
        msg_body = data.get('message', '')

        print(f"\n[CONTACT FORM] New message from {name} ({email})")

        # Check if password is still placeholder
        if app.config['MAIL_PASSWORD'] == 'your-app-password':
            print("WARNING: MAIL_PASSWORD is still set to placeholder. Email not sent.")
            return jsonify({
                'status': 'success', 
                'message': 'Message received on server, but Gmail sending is not yet configured by the user (App Password missing).'
            })

        # Create and send the email
        msg = Message(
            subject=f"New Portfolio Message from {name}",
            recipients=['kadariyoucef@gmail.com'], 
            body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{msg_body}"
        )
        mail.send(msg)
        return jsonify({'status': 'success', 'message': 'Email sent successfully!'})
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'status': 'success', 'message': f'Message received (Email error: {str(e)})'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
