import csv
import requests

# =====================================================
# OBJECTIFS
# =====================================================

# Ce script permet de mettre à jour les informations de profil
# des utilisateurs ZITADEL à partir de la base de données Overbookd.

# =====================================================
# CONSIGNES
# =====================================================

# Avant d'exécuter ce script, tu dois compléter la variable
# ZITADEL_API_BEARER_TOKEN.

# Tu dois également exporter la table "user" de la base de données
# sous forme de fichier CSV (,) et le mettre à côté du script.

# =====================================================
# CONFIGURATION
# =====================================================

ZITADEL_BASE_URL = "https://zitadel.24heures.org"
ZITADEL_API_BEARER_TOKEN = "xxxxxxxxxxxxxxxxx"

CSV_FILE = "user.csv"

# =====================================================

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {ZITADEL_API_BEARER_TOKEN}",
}


def get_field(row: dict, name: str, required: bool = True) -> str:
    value = row.get(name)
    if value is not None and str(value).strip() != "":
        return str(value).strip()

    if required:
        raise ValueError(f"Champ obligatoire manquant : {name}")

    return ""


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
        f"{ZITADEL_BASE_URL}/v2/users",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    body = handle_zitadel_response(response)
    result = body.get("result", [])

    return result[0] if result else None


def update_user_information(user: dict, row: dict):
    first_name = get_field(row, "first_name")
    last_name = get_field(row, "last_name")
    nick_name = get_field(row, "nickname")

    user_id = user["userId"]
    payload = {
        "profile": {
            "givenName": first_name,
            "familyName": last_name,
            "nickName": nick_name,
        },
    }

    response = requests.put(
        f"{ZITADEL_BASE_URL}/v2/users/human/{user_id}",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    handle_zitadel_response(response)
    return "profil mis à jour"


def main():
    updated = 0
    missing = 0
    errors = 0

    with open(CSV_FILE, encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)

        for row_number, row in enumerate(reader, start=2):
            email = row.get("email", "").strip().lower() or "<email inconnu>"
            is_deleted = row.get("is_deleted") == "1"
            if is_deleted:
                print(f"[SKIP] ligne {row_number} - {email} supprimé")
                continue

            try:
                existing_user = get_user_by_email(email)

                if not existing_user:
                    print(f"[SKIP] ligne {row_number} - {email} non existant")
                    missing += 1
                    continue

                update_user_information(existing_user, row)

                print(f"[OK] ligne {row_number} - {email} mis à jour")
                updated += 1

            except Exception as exc:
                print(f"[ERROR] ligne {row_number} - {email}: {exc}")
                errors += 1

    print("\n===== RAPPORT =====")
    print(f"Mis à jour    : {updated}")
    print(f"Non existants : {missing}")
    print(f"Erreurs       : {errors}")


if __name__ == "__main__":
    main()
