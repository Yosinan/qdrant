import requests
import requests_mock
from utils import generate_fake_clinician_data

def get_clinician_data(clinician_id):
    url = f"https://api.example.com/clinicians/{clinician_id}"
    response = requests.get(url)
    return response.json()

def test_get_clinician_data():
    fake_clinician = generate_fake_clinician_data()
    clinician_id = fake_clinician["clinician_id"]
    with requests_mock.Mocker() as m:
        m.get(f"https://api.example.com/clinicians/{clinician_id}", json=fake_clinician)
        result = get_clinician_data(clinician_id)
        return result

test_get_clinician_data()