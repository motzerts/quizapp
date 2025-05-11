import os
from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from functools import wraps

app = Flask(__name__)

questions = [
    {
        "id": 1,
        "question": "¿Qué gas toman las plantas del aire durante la fotosíntesis?",
        "answer": "dióxido de carbono"
    },
    {
        "id": 2,
        "question": "¿Qué tipo de energía usan las plantas para la fotosíntesis?",
        "answer": "energía lumínica"
    },
    {
        "id": 3,
        "question": "¿Qué producen las plantas al final de la fotosíntesis?",
        "answer": "oxígeno y glucosa"
    }
]

# Dummy users and classes
USERS = {
    'teacher1': {'id': 1, 'username': 'teacher1', 'password': 'pass', 'role': 'teacher'},
    'teacher2': {'id': 2, 'username': 'teacher2', 'password': 'pass', 'role': 'teacher'},
    'student1': {'id': 3, 'username': 'student1', 'password': 'pass', 'role': 'student'},
}
CLASSES = [
    {'id': 1, 'name': 'Class A', 'teacher_id': 1},
    {'id': 2, 'name': 'Class B', 'teacher_id': 1},
    {'id': 3, 'name': 'Class C', 'teacher_id': 2},
]
# Dummy progress data: class_id -> metrics
CLASS_METRICS = {
    1: {'avg_score': 80, 'vocab_mastered': 50, 'quizzes_taken': 15, 'time_spent': 120},
    2: {'avg_score': 85, 'vocab_mastered': 60, 'quizzes_taken': 18, 'time_spent': 140},
    3: {'avg_score': 90, 'vocab_mastered': 70, 'quizzes_taken': 20, 'time_spent': 160},
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def teacher_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('role') != 'teacher':
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function

# ---------- Pages ----------
@app.route("/")
def home():
    return render_template("index.html")

@app.route('/medieval-history-quiz')
def medieval_history_quiz():
    """Serves the Medieval History Quiz game page."""
    return render_template('medieval_history_quiz.html', game_type='medieval_history')

@app.route("/quiz")
def quiz():
    return render_template("quiz.html", game_type="quiz")

@app.route("/ancient-history-quiz")
def ancient_history_quiz():
    return render_template("ancient_history_quiz.html", game_type="ancient_history")

@app.route("/vocabulary")
def vocabulary():
    return render_template("vocabulary.html", game_type="vocabulary")

@app.route("/progress")
def progress():
    return render_template("progress.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = USERS.get(username)
        if user and user['password'] == password:
            session['user_id'] = user['id']
            session['role'] = user['role']
            return redirect(url_for('compare_classes'))
        return render_template('login.html', error='Invalid credentials')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/compare')
@login_required
@teacher_required
def compare_classes():
    user_id = session['user_id']
    # Only show classes for this teacher
    teacher_classes = [c for c in CLASSES if c['teacher_id'] == user_id]
    # Parse query params
    class_ids = request.args.get('classes')
    start = request.args.get('start')
    end = request.args.get('end')
    if class_ids:
        class_ids = [int(cid) for cid in class_ids.split(',') if cid.isdigit()]
        selected = [c for c in teacher_classes if c['id'] in class_ids]
    else:
        selected = teacher_classes
    # Dummy: always return all metrics for selected classes
    metrics = {c['id']: CLASS_METRICS.get(c['id'], {}) for c in selected}
    if request.args.get('json') == '1':
        return jsonify({'classes': selected, 'metrics': metrics})
    return render_template('compare.html', classes=teacher_classes, selected=selected, metrics=metrics, start=start, end=end)

# ---------- API ----------
@app.get("/questions")
def get_questions():
    return jsonify([{"id": q["id"], "question": q["question"]} for q in questions])

@app.post("/check_answer")
def check_answer():
    data = request.get_json()
    q_id = data.get("id")
    user_answer = data.get("user_answer", "").strip().lower()

    q = next((q for q in questions if q["id"] == q_id), None)
    if not q:
        return jsonify({"error": "Invalid question ID"}), 400

    if user_answer in q["answer"].lower():
        return jsonify({"result": "correct"})
    return jsonify({"result": "incorrect", "correct_answer": q["answer"]})

# ---------- Local dev ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
