import pandas as pd
import pyperclip as ppc

df = pd.read_csv("etc/people.csv", encoding="utf8")

res = []
for idx, row in df.iterrows():
    res.append(f"{{ rank: {row['rank']}, name: \"{row['name']}\", point: {row['point']} }},")

ppc.copy("\n".join(res))
print('copied.')
