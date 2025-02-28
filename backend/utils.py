from faker import Faker
import random

fake = Faker()

def generate_fake_clinician_data():
    clinician = {
        "clinician_id": fake.uuid4(),
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "specialty": random.choice(["Cardiology", "Pediatrics", "Dermatology", "Neurology"]),
        "credentials": random.choice(["MD", "DO"]),
        "phone": fake.phone_number(),
        "email": fake.email(),
        "affiliation": fake.company(),
        "expertise": [fake.word() for _ in range(random.randint(1, 3))]
    }
    return clinician

def generate_fake_patient_data():
    patient = {
        "patient_id": fake.uuid4(),
        "name": fake.name(),
        "age": random.randint(18, 90),
        "diagnosis": random.choice(["Hypertension", "Diabetes", "Asthma", "Healthy"]),
        "medications": [fake.word() for _ in range(random.randint(0, 3))],
        "notes": fake.text(max_nb_chars=200)
    }
    return patient