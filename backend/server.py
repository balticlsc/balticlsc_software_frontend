import os, time, datetime, json
import random

from flask import Flask, request, jsonify, current_app
from Database import Database
from flask_apscheduler import APScheduler

# from flask import Flask, request, jsonify, send_from_directory
# from flask import make_response, request, current_app

import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'yess!'
db = Database()
app.config["db"] = db
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')

    return response


@app.route('/')
def get_index():
    return "Super duper server is ON. Stay tuned..."


@app.route('/app')
def get_app():
    resp = {}
    if request.args.get('appId'):
        database = current_app.config["db"]
        resp = database.get_app(request.args.get('appId'))
    return jsonify(resp)


@app.route('/app/shelf', methods = ['GET', 'POST'])
def get_app_shelf():
    database = current_app.config["db"]
    if request.method == "POST":
        if request.args.get('appId'):
            appl = database.get_app(request.args.get('appId'))
            if appl:
                database.add_app_to_shelf(appl)
    resp = database.get_shelf()
    return jsonify(resp)


@app.route('/app/list')
def get_app_list():
    database = current_app.config["db"]
    resp = database.get_apps()
    return jsonify(resp)


@app.route('/task')
def get_task():
    resp = {}
    if request.args.get('computationTaskId'):
        database = current_app.config["db"]
        resp = database.get_task(request.args.get('computationTaskId'))
    return jsonify(resp)


@app.route('/task/list')
def get_task_list():
    database = current_app.config["db"]
    resp = database.get_tasks()
    for task in resp:
        task["jobList"] = database.get_task_jobs(task["id"])
    return jsonify(resp)


@app.route('/task/job')
def get_job():
    resp = {}
    if request.args.get('computationJobId'):
        database = current_app.config["db"]
        resp = database.get_job(request.args.get('computationJobId'))
    return jsonify(resp)


@app.route('/task/joblist')
def get_job_list():
    resp = []
    database = current_app.config["db"]
    task_id = request.args.get('computationTaskId')
    if task_id:
        resp = database.get_task_jobs(task_id)
    return jsonify(resp)


@app.route('/task/activate')
def activate_task():
    database = current_app.config["db"]
    task_id = request.args.get('computationTaskId')
    if task_id:
        task = database.get_task(task_id)
        if task:
            database.activate_task(task_id)
            scheduler.add_job(func=scheduled_finish_task, trigger='date', args=[task_id], id='finish_'+str(task_id), next_run_time=datetime.datetime.now()+datetime.timedelta(seconds=30))
    resp = database.get_task(task_id)
    resp["jobList"] = database.get_task_jobs(task_id)
    return jsonify(resp)

@app.route('/task/delete')
def delete_task():
    database = current_app.config["db"]
    task_id = request.args.get('computationTaskId')
    if task_id:
        task = database.get_task(task_id)
        if task:
            database.delete_task(task_id)

            return jsonify(task_id)
    return jsonify(-1)


@app.route('/app/run', methods=['POST'], )
def create_task():
    resp = {}
    json = request.get_json()
    database = current_app.config["db"]
    task_id = database.add_task({
			"computationApplicationReleaseId": json["computationApplicationReleaseId"],
			"consumedCredits": 0,
			"estimatedCredits": 50 + random.randint(-15,15),
			"isPrivate": json["isPrivate"],
			"jobList": [],
			"priority": json["priority"],
			"progress": 0,
			"reservedCredits": json["reservedCredits"],
			"safeMode": True,
			"startTime": datetime.datetime.now(),
			"status": "submitted",
			"userId": 15
		})
    resp = database.get_task(task_id)
    resp["jobList"] = database.get_task_jobs(task_id)
    return jsonify(resp)


@app.route('/resources/shelf')
def get_resource_list():
    database = current_app.config["db"]
    resp = database.get_clusters()
    return jsonify(resp)


def scheduled_finish_task(task_id):
    with app.app_context():
        database = current_app.config["db"]
        database.finish_task(task_id)


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000, threaded=True)

