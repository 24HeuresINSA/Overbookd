import json
import logging

import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Overbookd - migrate isMajor property to Animation Publish")

TOKEN = "YOUR_TOKEN"
DOMAIN = "overbookd.traefik.me"

def getAllFa():
  fas = requests.get(f"https://{DOMAIN}/api/fa", headers={"Authorization": f"Bearer {TOKEN}"}, verify=False).json()
  return [requests.get(f"https://{DOMAIN}/api/fa/{fa['id']}", headers={"Authorization": f"Bearer {TOKEN}"}, verify=False).json() for fa in fas]

def getAllFaSitePusblishAnimation():
  return requests.get(f"https://{DOMAIN}/api/fa-site-publish-animation", headers={"Authorization": f"Bearer {TOKEN}"}, verify=False).json()

def main():
  fas = getAllFa()
  print(fas)
  faSitePublishAnimations = getAllFaSitePusblishAnimation()
  for faSitePublishAnimation in faSitePublishAnimations:
    fa = next((fa for fa in fas if fa["id"] == faSitePublishAnimation["fa"]["id"]), None)
    if fa is None or not fa["is_major"]:
      continue
        
    faSitePublishAnimationData = json.dumps({"isMajor": True})
    requests.put(f"https://{DOMAIN}/api/fa-site-publish-animation/{faSitePublishAnimation['faId']}", data=faSitePublishAnimationData, headers={"Authorization": f"Bearer {TOKEN}"})

main()
