import typing
import logging
import urllib3
import json

environementTypeHints = typing.Literal["dev", "preprod", "prod", "ctma"]


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
            self.logger.error(
                "Environement must be 'dev', 'preprod' or 'prod'")
            raise ValueError("Environement must be 'dev', 'preprod' or 'prod'")

        self.environement = environement

        self.login()

        self.setUpHttpConnectionPool()

        self.logger.info("Overbookd object created")

    def isCorrectEnvironement(self, env) -> bool:
        if env in list(typing.get_args(environementTypeHints)):
            return True
        return False

    def setUpHttpConnectionPool(self) -> None:
        if self.environement == "dev":
            self.httpConnectionPool = urllib3.HTTPConnectionPool(
                self.baseUrlMap[self.environement],
                port=3000,
                headers={"Content-Type": "application/json",
                         "Authorization": f"Bearer {self.jwt}"},
            )

        if self.environement in ["preprod", "prod", "ctma"]:
            self.httpConnectionPool = urllib3.HTTPSConnectionPool(
                self.baseUrlMap[self.environement],
                port=443,
                headers={"Content-Type": "application/json",
                         "Authorization": f"Bearer {self.jwt}"},
            )

    def setUpBaseUrlMap(self) -> None:
        self.devBaseUrl = "https://overbookd.traefik.me"
        self.preprodBaseUrl = "https://preprod.overbookd.24heures.org"
        self.prodBaseUrl = "https://overbookd.24heures.org"
        self.ctmaBaseUrl = "https://cetaitmieuxavant.24heures.org"
        self.baseUrlMap = {
            "dev": self.devBaseUrl[8:],
            "preprod": self.preprodBaseUrl[8:],
            "prod": self.prodBaseUrl[8:],
            "ctma": self.ctmaBaseUrl[8:]
        }

    def login(self) -> None:
        self.logger.info(f"Try to Login with {self.email}")

        path = "/login" if self.environement == "dev" else "/api/login"
        url = f"{'http' if self.environement == 'dev' else 'https'}://{self.baseUrlMap[self.environement]}:{3000 if self.environement == 'dev' else ''}{path}"
        self.logger.debug(f"Login url : {url}")

        data = {"email": self.email, "password": self.password}

        response = urllib3.request("POST", url, body=json.dumps(
            data), headers={"Content-Type": "application/json"})

        if response.status in [200, 201]:
            self.logger.info("Login successful")
            self.logger.debug(
                f"login response : {response.data.decode('utf-8')}")
            jsonResponse = json.loads(response.data.decode("utf-8"))
            if "accessToken" in jsonResponse:
                self.jwt = jsonResponse["accessToken"]

            if "access_token" in jsonResponse:
                self.jwt = jsonResponse["access_token"]

        else:
            self.logger.error("Login failed")
            raise Exception(
                f"Login failed : {response.status} {response.data.decode('utf-8')}")

    def apiPathHelper(self, path: str) -> str:
        if self.environement == "dev":
            return path
        return f"/api{path}"
