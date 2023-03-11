import json
import logging

import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Overbookd - assign a reviewer to exting FTs")

TOKEN = "YOUR_TOKEN"
DOMAIN = "preprod.overbookd.24heures.org"

reviewer_candidate_ids = []

def fetchExistingFts():
    return requests.get(f"https://{DOMAIN}/api/ft", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=3).json()

def setReviewersToFts(fts):
    for ft in fts:
        reviewer_index = int(ft['id']) % len(reviewer_candidate_ids)
        reviewer_id = reviewer_candidate_ids[reviewer_index]

        body = json.dumps({"id": reviewer_id})
        url = f"https://{DOMAIN}/api/ft/{ft['id']}/humanReviewer"
        headers = {"Authorization": f"Bearer {TOKEN}", 'Content-Type': 'application/json'}
        reviewer = requests.put(url, data=body, headers=headers, timeout=3).json()
        logger.info(f"For FT #{ft['id']}: {reviewer}")

def main():
    existing_fts = fetchExistingFts()
    setReviewersToFts(existing_fts)

main()
