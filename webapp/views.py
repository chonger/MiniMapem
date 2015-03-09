import os, sys

#import other views here

from webapp import app

from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash, send_from_directory, jsonify, Response, json

from collections import defaultdict
import json
from pprint import pprint

city = {'display_name' : 'Boston',
        'name' : 'Boston',
        'centerlat' : -71.091967,
        'centerlng' : 42.4028646,
        'zoom' : 200000,
        'timezone' : 'America/New_York'}


topwordJ = [json.loads(line) for line in open('webapp/static/topwords.json')]
wordprobJ = dict()
for line in open('webapp/static/wordprobs.json'):
    jj = json.loads(line)
    wordprobJ[jj['word']] = jj

@app.route('/')
def mainpage():
    return render_template("city_main.html", city=city)

@app.route('/topwords/<city>')
def topwords(city=None):

    def makewords(jin):
        jout = dict()
        for e in jin:
            wrds = sorted(e['words'].items(),key=lambda x: -x[1])
            jout[e['region']] = [x[0] for x  in wrds]
        
        return jout

    
    words = makewords(topwordJ)

    return jsonify(words)


@app.route('/wordprobs/<city>/<word>')
def wordprobs(city=None,word=None):

    result = wordprobJ[word]

    if result:
        #del result['_id']
        return jsonify(result)
    else:
        return jsonify({'error':'not found'})

