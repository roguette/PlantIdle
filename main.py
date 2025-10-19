from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route("/")
def serve_idex():
    return render_template("index.html")

@app.route("/api/get_plants", methods=["GET"])
def api_data_plants():
    with open("static/data/data.json", "r") as f:
        content = f.read()
        f_data = json.loads(content)
        return jsonify({'data': f_data})


if __name__ == "__main__":
    app.run(debug=True)