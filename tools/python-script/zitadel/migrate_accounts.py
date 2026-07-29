import csv
import re
import requests
from datetime import datetime
from base64 import b64encode

# =====================================================
# CONFIGURATION
# =====================================================

ZITADEL_BASE_URL = "https://zitadel.24heures.org"
ZITADEL_API_BEARER_TOKEN = "xxxxxxxxxxxxxxxx"
ZITADEL_ORGANIZATION_ID = "277560954105954307"

CSV_FILE = "user.csv"

SEARCH_USERS_ENDPOINT = "/v2/users"
CREATE_USER_ENDPOINT = "/v2/users/new"

# =====================================================

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {ZITADEL_API_BEARER_TOKEN}",
}


BCRYPT_REGEX = re.compile(r"^\$2[aby]\$\d{2}\$.{53}$")


def get_field(row: dict, *names: str, required: bool = True) -> str:
    for name in names:
        value = row.get(name)
        if value is not None and str(value).strip() != "":
            return str(value).strip()

    if required:
        raise ValueError(f"Champ obligatoire manquant parmi : {', '.join(names)}")

    return ""


def normalize_birth_date(value: str) -> str:
    value = value.strip()

    try:
        parsed_date = datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        raise ValueError(
            f"Date de naissance invalide : '{value}'. Format attendu : YYYY-MM-DD"
        )

    return parsed_date.strftime("%Y-%m-%d")


def build_metadata(date_of_birth: str):
    normalized_date = normalize_birth_date(date_of_birth)

    return [
        {
            "key": "dateOfBirth",
            "value": b64encode(normalized_date.encode("utf-8")).decode("utf-8"),
        }
    ]


def validate_bcrypt_hash(password_hash: str):
    if not password_hash:
        raise ValueError("Hash bcrypt vide")

    if not BCRYPT_REGEX.match(password_hash):
        raise ValueError(
            "Hash bcrypt invalide. Format attendu : $2a$..., $2b$... ou $2y$..."
        )


def handle_zitadel_response(response: requests.Response):
    try:
        body = response.json()
    except Exception:
        body = response.text

    if response.status_code >= 400:
        raise RuntimeError(f"ZITADEL {response.status_code}: {body}")

    return body


def get_user_by_email(email: str):
    payload = {
        "query": {
            "offset": "0",
            "limit": 1,
            "asc": True,
        },
        "sortingColumn": "USER_FIELD_NAME_EMAIL",
        "queries": [
            {
                "emailQuery": {
                    "emailAddress": email,
                    "method": "TEXT_QUERY_METHOD_EQUALS",
                }
            }
        ],
    }

    response = requests.post(
        f"{ZITADEL_BASE_URL}{SEARCH_USERS_ENDPOINT}",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    body = handle_zitadel_response(response)
    result = body.get("result", [])

    return result[0] if result else None


def create_user(row: dict):
    email = get_field(row, "email").lower()
    first_name = get_field(row, "firstName", "first_name")
    last_name = get_field(row, "lastName", "last_name")
    nick_name = get_field(row, "nickname", "nick_name")
    phone_number = get_field(row, "phoneNumber", "phone_number")
    birth_date = get_field(row, "birthDate", "birth_date")
    password_hash = get_field(row, "password")

    validate_bcrypt_hash(password_hash)

    payload = {
        "organizationId": ZITADEL_ORGANIZATION_ID,
        "username": email,
        "human": {
            "hashedPassword": {
                "hash": password_hash,
                "changeRequired": False,
            },
            "email": {
                "email": email,
            },
            "phone": {
                "phone": phone_number,
                "isVerified": True,
            },
            "profile": {
                "givenName": first_name,
                "familyName": last_name,
                "nickName": nick_name,
                "preferredLanguage": "fr",
            },
            "metadata": build_metadata(birth_date),
        }
    }

    response = requests.post(
        f"{ZITADEL_BASE_URL}{CREATE_USER_ENDPOINT}",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    return handle_zitadel_response(response)


def main():
    created = 0
    existing = 0
    errors = 0

    with open(CSV_FILE, encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)

        for row_number, row in enumerate(reader, start=2):
            email = row.get("email", "").strip().lower() or "<email inconnu>"

            try:
                existing_user = get_user_by_email(email)

                if existing_user:
                    print(f"[SKIP] ligne {row_number} - {email} déjà présent")
                    existing += 1
                    continue

                create_user(row)

                print(f"[OK] ligne {row_number} - {email} créé")
                created += 1

            except Exception as exc:
                print(f"[ERROR] ligne {row_number} - {email}: {exc}")
                errors += 1

    print("\n===== RAPPORT =====")
    print(f"Créés     : {created}")
    print(f"Existants : {existing}")
    print(f"Erreurs   : {errors}")


if __name__ == "__main__":
    main()
