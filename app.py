from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

questions = [
    {
        "id": 1,
        "question": "¿Qué gas toman las plantas del aire durante la fotosíntesis?",
        "answer": "Las plantas toman dióxido de carbono (CO₂) del aire."
    },
    {
        "id": 2,
        "question": "¿Qué tipo de energía usan las plantas para la fotosíntesis?",
        "answer": "Las plantas utilizan energía lumínica proveniente del sol."
    },
    {
        "id": 3,
        "question": "¿Qué producen las plantas al final de la fotosíntesis?",
        "answer": "Producen oxígeno y glucosa como resultado principal."
    }
]
@app.route('/quiz')
def quiz():
    """Serves the Quiz game page."""
    return render_template('quiz.html', game_type='quiz') # Pass game_type

@app.route('/ancient-history-quiz')
def ancient_history_quiz():
    """Serves the Ancient History Quiz game page."""
    # Pass the game_type matching the data-attribute in the HTML
    return render_template('ancient_history_quiz.html', game_type='ancient_history')

@app.route('/vocabulary')
def vocabulary():
    """Serves the Vocabulary game page."""
    return render_template('vocabulary.html', game_type='vocabulary') # Pass game_type

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/questions", methods=["GET"])
def get_questions():
    data = [{"id": idx, "question": q["question"]} for idx, q in enumerate(questions, start=1)]
    return jsonify(data)

@app.route("/check_answer", methods=["POST"])
def check_answer():
    payload = request.json
    question_id = payload.get("id")
    user_answer = payload.get("user_answer", "").strip().lower()

    if question_id is None or question_id <= 0 or question_id > len(questions):
        return jsonify({"error": "Invalid question ID"}), 400

    correct_answer = questions[question_id - 1]["answer"].strip().lower()
    if user_answer in correct_answer:
        return jsonify({"result": "correct"})
    else:
        return jsonify({"result": "incorrect", "correct_answer": questions[question_id - 1]["answer"]})

@app.route('/progress')
def progress():
    """Serves the progress tracking page."""
    # Assuming your homepage function is named 'home'
    # Adjust if necessary for url_for in progress.html's header/back link
    return render_template('progress.html')
if __name__ == "__main__":
    # local testing only
    app.run(port=5001, debug=False)