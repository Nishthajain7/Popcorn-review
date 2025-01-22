from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3 
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'your_secret_key'

USERNAME = 'admin'
PASSWORD = 'a123'

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS USERS (
                name TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                dob TEXT NOT NULL,
                genres TEXT NOT NULL,
                password TEXT NOT NULL)""")
    
    cursor.execute("""CREATE TABLE IF NOT EXISTS COMMENTS (
                movie_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
    
    cursor.execute("""CREATE TABLE IF NOT EXISTS WATCHLIST (
                movie_id INTEGER NOT NULL,
                username TEXT NOT NULL)""")
    print("made")
    conn.commit()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    phone = data.get('phone')
    whatsapp = data.get('whatsapp')
    dob = data.get('dob')
    genres = data.get('genres')
    password = data.get('password')

    if not name or not username or not password:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO USERS (name, username, email, phone, whatsapp, dob, genres, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",(name, username, email, phone, whatsapp, dob, genres, password))
        conn.commit()
        print("User successfully registered:", name, username)
        return jsonify({"status": "success", "message": "Registration successful"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "Username already exists"}), 409


@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM USERS WHERE username = ? AND password = ?",(username, password))
    user = cursor.fetchone()

    if user:
        session['username'] = user[1]
        session['name'] = user[0]
        session['email'] = user[2]
        session['phone'] = user[3]
        session['whatsapp'] = user[4]
        session['dob'] = user[5]
        session['genres'] = user[6]
        return jsonify({"status": "success", "message": "Login successful"})
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@app.route('/profile', methods=['GET'])
def profile():
    if 'username' not in session:
        return jsonify({"status": "error", "message": "Not logged in"}), 401
    
    return jsonify({
        "status": "success",
        "name": session.get('name'),
        "username": session.get('username'),
        "email": session.get('email'),
        "phone": session.get('phone'),
        "whatsapp": session.get('whatsapp'),
        "dob": session.get('dob'),
        "genres": session.get('genres')
    })


@app.route('/api/movies/<int:movie_id>/comments', methods=['POST'])
def post_comment(movie_id):
    print(f"Received request to add a comment for movie ID: {movie_id}")
    
    if 'username' not in session:
        return jsonify({"status": "error", "message": "Not logged in"}), 401

    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({"status": "error", "message": "Comment content is required"}), 400

    username = session.get('username')

    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO COMMENTS (movie_id, username, content) VALUES (?, ?, ?)",
                       (movie_id, username, content))
        conn.commit()
        return jsonify({
            "status": "success",
            "message": "Comment added successfully",
            "username": username,
            "content": content
        }), 201
    except Exception as e:
        print(f"Error adding comment: {e}")
        return jsonify({"status": "error", "message": "Failed to add comment"}), 500

@app.route('/api/movies/<int:movie_id>/comments', methods=['GET'])
def get_comments(movie_id):
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT username, content FROM COMMENTS WHERE movie_id = ? ORDER BY created_at DESC", (movie_id,))
        comments = cursor.fetchall()
        response = {
            "status": "success",
            "comments": [{"username": comment[0], "content": comment[1]} for comment in comments]
        }        
        conn.close()
        return jsonify(response), 200
    except Exception as e:
        print(f"Error fetching comments: {e}")
        return jsonify({"status": "error", "message": "Failed to fetch comments"}), 500

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return jsonify({"status": "success", "message": "Logged out"})

@app.route('/', methods=['GET'])
def check_login():
    if 'username' in session:
        return jsonify({"status": "success", "message": f"Logged in as {session['username']}"})
    return jsonify({"status": "error", "message": "Not logged in"})

@app.route('/api/movies/<int:movie_id>/watchlist', methods=['POST'])
def add_to_watchlist(movie_id):
    if 'username' not in session:
        return jsonify({"status": "error", "message": "Not logged in"}), 401
    data = request.get_json()
    id = data.get('id')
    if not id:
        return jsonify({"status": "error", "message": "watchlist movie is required"}), 400
    username = session.get('username')
    
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO WATCHLIST (movie_id, username) VALUES (?, ?)", (movie_id, username))
        conn.commit()
        return jsonify({
            "status": "success",
            "message": "Movie added successfully",
            "username": username,
            "id": id
        }), 201
    except Exception as e:
        return jsonify({"status": "error", "message": "Failed to add movie to watchlist"}), 500
    
@app.route('/watchlist', methods=['GET'])
def get_watchlist():
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT username, movie_id FROM WATCHLIST")
        movies = cursor.fetchall()
        response = {
            "status": "success",
            "movies": [{"username": movie[0], "movie_id": movie[1]} for movie in movies]
        }
        conn.close()
        return jsonify(response), 200
    except Exception as e:
        print(f"Error fetching watchlist: {e}")
        return jsonify({"status": "error", "message": "Failed to fetch watchlist"}), 500


if __name__ == '__main__':
    init_db()
    app.run(debug=True)