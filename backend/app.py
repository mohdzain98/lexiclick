from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from core import Core
load_dotenv()
import os


app = Flask(__name__)
cors=CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
status = "active"

os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')


@app.route('/')
def hello_world():
    return jsonify({"status":status,"Value":'lexitap server running successfully',"Version":1.0})


@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query')
    core=Core()
    chain = core.LLMResponse()
    result = chain.invoke(query)
    res = jsonify({"success":True,"result":result})
    return res


if __name__ == '__main__':
    app.run(debug=True)