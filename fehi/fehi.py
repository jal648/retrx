import rethinkdb as r
import random
import time
from datetime import datetime

conn = r.connect('localhost', 28015)

biz_names = [
    "Cadeau Designs LLC",
    "Hall & Hall",
    "Mc Klein USA",
    "Decent Exposures",
    "Danny's Jewelry",
    "Fashion Avenue",
    "Pumpkin Glass",
    "Caramel",
    "Davriel Jewelers",
    "Dave's",
    "Wilson & Son Jewelers",
    "Gary Myers",
    "Leggs Hanes Bali Factory Outlet",
    "Liquid Light",
    "Sonetics Corporation",
    "Identity Solutions",
    "Bold Coast Charter Co",
    "Ace Uniform Svc Inc",
    "HollidayS Fashions",
    "Eternal Jewelers",
    "Jd's Snack Shack",
    "Lexington Center",
    "Solera Restaurant & Wine Bar",
    "Sonora Restaurant",
    "Downtown Marathon",
    "Silver Bullet Saloon",
    "Busy Bumble Bee Academy",
    "Harvest For The World",
    "Riverforest Park",
    "Mile High Pizza Pie",
]

def add_random_trx():
    res = r.table('transactions').insert(
        {
            "when": datetime.now().isoformat(),
            "amount": random.randint(1,8)*500 if random.random() < 0.2 else random.randint(-2000, -20),
            "where": random.choice(biz_names)
        }
    ).run(conn)

    print res

try:
    r.db('test').table_drop('transactions').run(conn)
except:
    pass

r.db('test').table_create('transactions').run(conn)
r.db('test').table('transactions').index_create('when').run(conn)

while (True):
    add_random_trx()
    time.sleep(random.randint(1,8))