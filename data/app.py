import os
import json
import math

import pandas as pd
from flask import Flask, send_from_directory, request

app = Flask(__name__)
df = pd.read_pickle('models/item_month_avg.pickle')

def get_avg(item_code):
    result = None

    try:
        result = df.loc[df['ITEM_CODE'] == int(item_code)]["ITEM_QTY"].values[0]
    except Exception:
        pass
    
    return result

@app.route('/item')
def predict():
    item_code = request.args.get('item_code')
    pred = get_avg(item_code)

    result = {'monthly_quantity': pred, 'item_code': item_code}

    return result

if __name__ == '__main__':
    app.run(threaded=True, port=5000)