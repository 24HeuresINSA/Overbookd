import requests
import json

class Issue:
    def __init__(self, repo, token, data=None, milestone=None, git_platform=None):
        """
        :param repo: the github repository to push issues with format username|organisation/project for github
        and username|organisation/[subproject]/project for gitlab
        :param token: the github token with repo scope ( to get one : https://github.com/settings/tokens/new)
        :param data: the json structure of the issue
        :param git_platform: String "github" or "gitlab". Platform to push issue
        """

        self.repo = repo
        self.token = token
        self.issues = []
        self.newrepo = "31598236"

    def getIssuenb(self):
        url = f"https://gitlab.com/api/v4/projects/{self.repo.replace('/', '%2F')}/issues"

        payload = {}
        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        response = requests.request("GET", url, headers=headers, data=payload)
        jsonResponse = json.loads(response.text)
        return int(jsonResponse[0]["iid"])

    def getIssues(self):
        """
        Get issues to github or gitlab
        :return: the list of github or gitlab issues
        """

        url = f"https://gitlab.com/api/v4/projects/{self.repo.replace('/', '%2F')}/issues?per_page={self.getIssuenb()}"

        payload = {}
        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        print(url)

        response = requests.request("GET", url, headers=headers, data=payload)
        jsonResponse = json.loads(response.text)
        self.issues = jsonResponse

    def issuesStr(self):
        return self.issues
    
    def issueID(self):
        return [json["id"] for json in self.issues]

    def issueNb(self):
        return len(self.issueID())

    def issueName(self):
        return [jsonIssue["title"] for jsonIssue in self.issues]


    def moveIssue(self):

        headers = {
        'Authorization': f'Bearer {self.token}',
        'Content-Type': 'application/x-www-form-urlencoded'
        }

        payload = f"to_project_id={self.newrepo}"

        for i in range(1, self.getIssuenb() + 1 ):
            url = f"https://gitlab.com/api/v4/projects/{self.repo.replace('/', '%2F')}/issues/{i}/move"
            response = requests.request("POST", url, headers=headers, data=payload)
            print(response)


if __name__ == "__main__":
    i = Issue("24-heures-insa/overbookd/documentation", "glpat-n2uZMLWxtzVmtPBz9Ngg")
    i.moveIssue()
    # i.getProjects()
