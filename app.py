import os
from flask import Flask, jsonify, request, render_template
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
