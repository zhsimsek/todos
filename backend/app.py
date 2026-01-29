from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY"),
)

@app.route("/todos", methods=["GET"])
def get_todos():
    res = supabase.table("todos").select("*").order("created_at").execute()
    return jsonify(res.data)

@app.route("/todos", methods=["POST"])
def add_todo():
    data = request.json
    res = supabase.table("todos").insert({
        "title": data["title"]
    }).execute()
    return jsonify(res.data[0]), 201

@app.route("/todos/<id>/toggle", methods=["PATCH"])
def toggle_todo(id):
    todo = supabase.table("todos").select("completed").eq("id", id).single().execute()
    updated = supabase.table("todos").update({
        "completed": not todo.data["completed"]
    }).eq("id", id).execute()
    return jsonify(updated.data[0])

@app.route("/todos/<id>", methods=["DELETE"])
def delete_todo(id):
    print(f"Deleting todo with id: {id}")
    deleted = supabase.table("todos").delete().eq("id", id).execute()
    return jsonify(deleted.data[0])

if __name__ == "__main__":
    app.run(debug=True)
