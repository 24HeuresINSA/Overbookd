import csv
import requests

# =====================================================
# OBJECTIFS
# =====================================================

# Ce script permet d'ajouter des roles aux utilisateurs Zitadel.

# =====================================================
# CONSIGNES
# =====================================================

# Avant d'exécuter ce script, tu dois compléter la variable
# ZITADEL_API_BEARER_TOKEN.

# Tu dois également exporter les membres de la team vieux
# de la table "user" de la base de données sous forme de
# fichier CSV (,) et le mettre à côté du script.

# =====================================================
# CONFIGURATION
# =====================================================

ZITADEL_BASE_URL = "https://zitadel.24heures.org"
ZITADEL_API_BEARER_TOKEN = "xxxxxxxxxxxxxxxxx"

ZITADEL_OVERBOOKD_PROJECT_ID = "332175680848527383"
ZITADEL_WIKI_PROJECT_ID = "289024556977356803"
ZITADEL_OVERVIEW_PROJECT_ID = "330577475434184727"
ZITADEL_OVERBOOKD_PREPROD_PROJECT_ID = "332175680898859031"
ZITADEL_OVERBOOKD_CTMA_PROJECT_ID = "380922094134820868"
ZITADEL_VAULTWARDEN_PROJECT_ID = "386073964901826564"

OVERBOOKD_USER_ROLE = "overbookd_user"
OVERBOOKD_GUEST_ROLE = "overbookd_guest"
WIKI_EDITOR_ROLE = "wiki_editor"
OVERVIEW_VIEWER_ROLE = "overview_viewer"
VAULTWARDEN_USER_ROLE = "vaultwarden_user"

ORGANIZERS_ROLES = {
    {
        "role": OVERBOOKD_USER_ROLE,
        "projectId": ZITADEL_OVERBOOKD_PROJECT_ID,
    },
    {
        "role": WIKI_EDITOR_ROLE,
        "projectId": ZITADEL_WIKI_PROJECT_ID,
    },
    {
        "role": OVERVIEW_VIEWER_ROLE,
        "projectId": ZITADEL_OVERVIEW_PROJECT_ID,
    },
    {
        "role": OVERBOOKD_GUEST_ROLE,
        "projectId": ZITADEL_OVERBOOKD_PREPROD_PROJECT_ID,
    },
    {
        "role": OVERBOOKD_GUEST_ROLE,
        "projectId": ZITADEL_OVERBOOKD_CTMA_PROJECT_ID,
    },
    {
        "role": VAULTWARDEN_USER_ROLE,
        "projectId": ZITADEL_VAULTWARDEN_PROJECT_ID,
    },
}

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


def get_user_roles(user_id: str, project_id: str):
    payload = {
        "query": {
            "offset": "0",
            "limit": 1,
            "asc": True,
        },
        "queries": [
            {
                "projectIdQuery": {"projectId": project_id}
            },
            {
                "userIdQuery": {"userId": user_id}
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


def ensure_role(user_id: str, role_key: str, project_id: str) -> str:
    grant = get_user_roles(user_id, project_id)

    if not grant:
        add_role_to_user(user_id, role_key, project_id)
        return f"rôle {role_key} ajouté"

    current_roles = grant.get("roleKeys", [])

    if role_key not in current_roles:
        update_roles(
            user_id,
            grant["id"],
            current_roles + [role_key],
        )
        return f"rôle {role_key} ajouté"

    return f"rôle {role_key} OK"


def add_role_to_user(user_id: str, role_key: str, project_id: str):
    payload = {
        "projectId": project_id,
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

                user_id = existing_user["userId"]
                actions = []
                for role in ORGANIZERS_ROLES:
                    role_key = role["role"]
                    project_id = role["projectId"]
                    actions.append(ensure_role(user_id, role_key, project_id))

                print(f"[OK] ligne {row_number} - {email} rôle ajoutés | {" | ".join(actions)}")
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
