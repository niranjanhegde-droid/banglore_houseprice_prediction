from flask import Flask, request, jsonify, render_template
import util

app = Flask(
    __name__,
    template_folder='../templates',
    static_folder='../static'
)

# Load model and columns when application starts
print("Loading artifacts...")
util.load_saved_artifacts()
print("Artifacts loaded successfully!")

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def index():
    return render_template('app.html')


@app.route('/get_location_names')
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })

    response.headers.add(
        'Access-Control-Allow-Origin',
        '*'
    )

    return response


@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():

    try:
        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']
        bhk = int(request.form['bhk'])
        bath = int(request.form['bath'])

        estimated_price = util.get_estimated_price(
            location,
            total_sqft,
            bhk,
            bath
        )

        response = jsonify({
            'estimated_price': estimated_price
        })

        response.headers.add(
            'Access-Control-Allow-Origin',
            '*'
        )

        return response

    except Exception as e:

        response = jsonify({
            'error': str(e)
        })

        response.headers.add(
            'Access-Control-Allow-Origin',
            '*'
        )

        return response, 500


if __name__ == "__main__":
    print("Starting Flask Server...")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )