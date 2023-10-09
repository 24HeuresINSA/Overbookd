import typing
import logging
import urllib3
import json
import ssl
import sys

if sys.version_info.major < 3:
    sys.exit("Python 3 is required")

environementTypeHints = typing.Literal["dev-container",
                                       "dev-baremetal",
                                       "preprod",
                                       "prod",
                                       "ctma"]


class Overbookd:

    def __init__(self,
                 email: str,
                 password: str,
                 environement: environementTypeHints
                 ) -> None:

        self.logger = logging.getLogger("Overbookd")

        self.setUpBaseUrlMap()

        self.email = email
        self.password = password

        if not self.isCorrectEnvironement(environement):
            errorMsg = f"Environement must be one off {list(typing.get_args(environementTypeHints))}"
            self.logger.error(errorMsg)
            raise ValueError(errorMsg)

        self.environement = environement

        self.login()

        self.setUpHttpConnectionPool()

        self.logger.info("Overbookd object created")

    def isCorrectEnvironement(self, env) -> bool:
        if env in list(typing.get_args(environementTypeHints)):
            return True
        return False

    def setUpHttpConnectionPool(self) -> None:
        if self.environement == "dev-container":
            self.httpConnectionPool = urllib3.HTTPConnectionPool(
                self.baseUrlMap[self.environement],
                port=3000,
                headers={"Content-Type": "application/json",
                         "Authorization": f"Bearer {self.jwt}"},
            )

        if self.environement in ["preprod", "prod", "ctma", "dev-baremetal"]:
            self.httpConnectionPool = urllib3.HTTPSConnectionPool(
                self.baseUrlMap[self.environement],
                port=443,
                cert_reqs=ssl.CERT_NONE if self.environement == "dev-baremetal" else ssl.CERT_REQUIRED,
                headers={"Content-Type": "application/json",
                         "Authorization": f"Bearer {self.jwt}"},
            )

    def setUpBaseUrlMap(self) -> None:
        self.baseUrlMap = {
            "dev-baremetal": "overbookd.traefik.me",
            "dev-container": "overbookd.traefik.me",
            "preprod": "preprod.overbookd.24heures.org",
            "prod": "overbookd.24heures.org",
            "ctma": "cetaitmieuxavant.24heures.org",
        }

    def login(self) -> None:
        self.logger.info(f"Try to Login with {self.email}")

        path = self.apiPathHelper("/login")
        url = f"{'http' if self.environement == 'dev-container' else 'https'}://{self.baseUrlMap[self.environement]}{':3000' if self.environement == 'dev-container' else ''}{path}"
        self.logger.debug(f"Login url : {url}")

        data = {"email": self.email, "password": self.password}

        response = urllib3.request(
            "POST",
            url,
            body=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )

        if response.status in [200, 201]:
            self.logger.info("Login successful")
            self.logger.debug(
                f"login response : {response.data}")
            jsonResponse = json.loads(response.data)

            if "accessToken" in jsonResponse:
                self.jwt = jsonResponse["accessToken"]

            if "access_token" in jsonResponse:
                self.jwt = jsonResponse["access_token"]

        else:
            self.logger.error("Login failed")
            raise Exception(
                f"Login failed : {response.status} {response.data.decode('utf-8')}")

    def apiPathHelper(self, path: str) -> str:
        return path if self.environement == "dev-container" else f"/api{path}"
