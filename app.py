from flask import Flask, request, jsonify
import openai

app = Flask(__name__)



if __name__ == '__main__':
    app.run(debug=True)
