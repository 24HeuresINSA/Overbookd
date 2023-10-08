from overbookd import overbookd
import logging


if __name__ == "__main__":

    logging.basicConfig(
        level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    ob = overbookd.Overbookd(
        email="admin@24h.me",
        password="password",
        environement="dev"
    )

    print(ob.httpConnectionPool.request(
        "GET", ob.apiPathHelper("/users")).data.decode("utf-8"))
