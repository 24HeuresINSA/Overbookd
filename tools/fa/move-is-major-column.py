import json
import logging

import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Overbookd - migrate isMajor property to Animation Publish")

TOKEN = "YOUR_TOKEN"
DOMAIN = "overbookd.traefik.me"

def getAllFa():
  return requests.get(f"https://{DOMAIN}/api/fa", headers={"Authorization": f"Bearer {TOKEN}"}).json()

def getAllFaSitePusblishAnimation():
  return requests.get(f"https://{DOMAIN}/api/fa-site-publish-animation", headers={"Authorization": f"Bearer {TOKEN}"}).json()

def main():
  fas = getAllFa()
  faSitePublishAnimations = getAllFaSitePusblishAnimation()
  for faSitePublishAnimation in faSitePublishAnimations:
    fa = next((fa for fa in fas if fa["id"] == faSitePublishAnimation["faId"]), None)
    if fa is None or not fa["isMajor"]:
      continue
        
    faSitePublishAnimationData = json.dumps({"isMajor": True})
    requests.put(f"https://{DOMAIN}/api/fa/{fa.id}/fa-site-publish-animation/{faSitePublishAnimation.id}", data=faSitePublishAnimationData, headers={"Authorization": f"Bearer {TOKEN}"})



