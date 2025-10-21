from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route("/")
def serve_idex():
    return render_template("index.html")

@app.route("/api/get_items", methods=["GET"])
def api_data_items():
    with open("./data/items.json", "r", encoding='utf-8') as f: # changed encoding to read polish characters properly
        content = f.read()
        f_data = json.loads(content)
        return jsonify({'items': f_data})


if __name__ == "__main__":
    app.run(debug=True)