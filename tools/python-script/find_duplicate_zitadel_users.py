import csv
import requests

# =====================================================
# OBJECTIFS
# =====================================================

# Ce script permet de trouver les utilisateurs ZITADEL en double
# à partir des utilisateurs Overbookd.

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


def get_user_by_name(name: str):
    payload = {
        "query": {
        "offset": "0",
        "limit": "0",
        "asc": True,
        },
        "sortingColumn": "USER_FIELD_NAME_DISPLAY_NAME",
        "queries": [
            {
                "displayNameQuery": {
                    "displayName": name,
                    "method": "TEXT_QUERY_METHOD_CONTAINS_IGNORE_CASE",
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

    return result


def get_matching_users(row: dict) -> set(str):
    first_name = get_field(row, "first_name")
    last_name = get_field(row, "last_name")

    first_name_matches = get_user_by_name(first_name)
    first_name_set = {match["human"]["email"]["email"] for match in first_name_matches}

    last_name_matches = get_user_by_name(last_name)
    last_name_set = {match["human"]["email"]["email"] for match in last_name_matches}

    return first_name_set & last_name_set


def main():
    duplicate = 0
    no_account = 0
    non_duplicate = 0
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
                matching_users = get_matching_users(row)
                existing_user = get_user_by_email(email)

                if existing_user is not None and len(matching_users) <= 1:
                    print(f"[SKIP] ligne {row_number} - {email} un seul compte")
                    non_duplicate += 1
                    continue
                
                if len(matching_users) == 0:
                    print(f"[WARNING] ligne {row_number} - {email} pas de compte")
                    no_account += 1
                    continue

                print(f"[WARNING] ligne {row_number} - {email} plusieurs comptes : {" | ".join(matching_users)}")
                duplicate += 1

            except Exception as exc:
                print(f"[ERROR] ligne {row_number} - {email}: {exc}")
                errors += 1

    print("\n===== RAPPORT =====")
    print(f"Plusieurs comptes : {duplicate}")
    print(f"Pas de compte     : {no_account}")
    print(f"Un seul compte    : {non_duplicate}")
    print(f"Erreurs           : {errors}")


if __name__ == "__main__":
    main()
