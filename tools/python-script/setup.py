from setuptools import setup, find_packages
import sys

if sys.version_info.major < 3:
    sys.exit("Python 3 is required")

setup(name='overbookd',
      version='1.0',
      packages=find_packages(include=['overbookd.*']),
      install_requires=['urllib3'],
      author="club des 24h de l'INSA",
      author_email="dsi@24heures.org",
      description="Python wrapper for overbookd",
      url="https://gitlab.com/24-heures-insa/overbookd-mono",
      license="https://gitlab.com/24-heures-insa/overbookd-mono/-/raw/main/LICENSE?ref_type=heads",
      )
