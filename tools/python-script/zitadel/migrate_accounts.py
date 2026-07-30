import csv
import re
import requests
from datetime import datetime
from base64 import b64encode

# =====================================================
# OBJECTIFS
# =====================================================

# Ce script permet de migrer les utilisateurs de la base de données Overbookd vers ZITADEL.
# Il ajoute également le rôle "overbookd_user" à chaque utilisateur créé ou existant.
# Si un utilisateur avec le même email existe déjà dans ZITADEL, 
# le script ne le recrée pas mais vérifie que le rôle "overbookd_user" est bien présent.

# =====================================================
# CONSIGNES
# =====================================================

# Avant d'exécuter ce script, tu dois compléter les variables 
# ZITADEL_API_BEARER_TOKEN et ZITADEL_OVERBOOKD_PROJECT_ID.

# Tu dois également exporter la table "user" de la base de données
# sous forme de fichier CSV (,) et le mettre à côté du script.

# =====================================================
# CONFIGURATION
# =====================================================

ZITADEL_BASE_URL = "https://zitadel.24heures.org"
ZITADEL_API_BEARER_TOKEN = "xxxxxxxxxxxxxxxx"
ZITADEL_ORGANIZATION_ID = "277560954105954307"

ZITADEL_OVERBOOKD_PROJECT_ID = "xxxxxxxxxxxxxxxx"
OVERBOOKD_ROLE = "overbookd_user"

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


def get_field(row: dict, name: str, required: bool = True) -> str:
    value = row.get(name)
    if value is not None and str(value).strip() != "":
        return str(value).strip()

    if required:
        raise ValueError(f"Champ obligatoire manquant : {name}")

    return ""


def normalize_birth_date(value: str) -> str:
    value = value.strip()

    formats = ["%Y-%m-%d", "%Y-%m-%d %H:%M:%S"]
    for fmt in formats:
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass

    raise ValueError(f"Date de naissance invalide : '{value}'")


def normalize_phone_number(phone: str) -> str:
    phone = re.sub(r"\s+", "", phone.strip())

    if phone.startswith("+33"):
        return phone

    if phone.startswith("0033"):
        return "+" + phone[2:]

    if phone.startswith("0"):
        return "+33" + phone[1:]

    raise ValueError(f"Numéro de téléphone invalide : {phone}")


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


def get_user_roles(user_id: str):
    payload = {
        "query": {
            "offset": "0",
            "limit": 1,
            "asc": True,
        },
        "queries": [
            {
                "projectIdQuery": {
                    "projectId": ZITADEL_OVERBOOKD_PROJECT_ID,
                }
            },
            {
                "userIdQuery": {
                    "userId": user_id,
                }
            },
        ],
    }

    response = requests.post(
        f"{ZITADEL_BASE_URL}/management/v1/users/grants/_search",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    body = handle_zitadel_response(response)
    result = body.get("result", [])

    return result[0] if result else None


def ensure_overbookd_role(user_id: str):
    grant = get_user_roles(user_id)

    if not grant:
        add_role_to_user(user_id, OVERBOOKD_ROLE)
        return

    current_roles = grant.get("roleKeys", [])

    if OVERBOOKD_ROLE not in current_roles:
        update_roles(
            user_id,
            grant["id"],
            current_roles + [OVERBOOKD_ROLE],
        )


def create_user(row: dict):
    email = get_field(row, "email").lower()
    first_name = get_field(row, "first_name")
    last_name = get_field(row, "last_name")
    nick_name = get_field(row, "nickname")
    phone_number = get_field(row, "phone_number")
    birth_date = get_field(row, "birth_date")
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
                "phone": normalize_phone_number(phone_number),
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

    created_user = handle_zitadel_response(response)
    user_id = created_user["id"]

    add_role_to_user(user_id, OVERBOOKD_ROLE)

    return created_user


def add_role_to_user(user_id: str, role_key: str):
    payload = {
        "projectId": ZITADEL_OVERBOOKD_PROJECT_ID,
        "roleKeys": [role_key],
    }

    response = requests.post(
        f"{ZITADEL_BASE_URL}/management/v1/users/{user_id}/grants",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    return handle_zitadel_response(response)


def update_roles(user_id: str, grant_id: str, roles: list[str]):
    payload = {
        "roleKeys": roles,
    }

    response = requests.put(
        f"{ZITADEL_BASE_URL}/management/v1/users/{user_id}/grants/{grant_id}",
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
                    ensure_overbookd_role(existing_user["userId"])
                    print(f"[SKIP] ligne {row_number} - {email} déjà présent (rôle vérifié)")
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
