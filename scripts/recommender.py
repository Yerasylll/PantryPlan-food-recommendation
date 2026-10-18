import json
import math
from pathlib import Path

CATALOG = Path(__file__).resolve().parents[1] / "catalog.json"


def eligible(recipe, profile):
    diet = profile.get("diet", "any")
    return (
        (diet == "any" or recipe.get(diet) is True)
        and recipe["minutes"] <= profile.get("maxMinutes", 60)
        and not set(profile.get("excluded", [])).intersection(
            i["productId"] for i in recipe["ingredients"]
        )
        and not set(profile.get("avoidAllergens", [])).intersection(recipe["allergens"])
        and recipe["id"] not in profile.get("disliked", [])
    )


def recommend(catalog, profile, mode="tfidf", meal=None):
    if mode not in ("tfidf", "baseline"):
        raise ValueError("Unknown ranking mode")
    if profile.get("diet", "any") not in ("any", "vegetarian", "vegan"):
        raise ValueError("Unsupported diet")
    maximum = profile.get("maxMinutes", 60)
    if (
        not isinstance(maximum, (int, float))
        or not math.isfinite(maximum)
        or not 1 <= maximum <= 240
    ):
        raise ValueError("Invalid maximum cooking time")

    def tokens(r):
        return [i["productId"] for i in r["ingredients"]] + [
            "style:" + r["style"].lower()
        ]

    docs = [tokens(r) for r in catalog["recipes"]]
    vocab = {t for doc in docs for t in doc}
    idf = {
        t: 1 + math.log((1 + len(docs)) / (1 + sum(t in d for d in docs)))
        for t in vocab
    }

    def vector(ts):
        v = {}
        for t in ts:
            if t in idf:
                v[t] = v.get(t, 0) + idf[t]
        norm = math.sqrt(sum(w * w for w in v.values()))
        return {t: w / norm for t, w in v.items()} if norm else {}

    query = vector(
        profile.get("preferred", [])
        + [
            t
            for r in catalog["recipes"]
            if r["id"] in profile.get("liked", [])
            for t in tokens(r)
        ]
    )
    results = []
    for recipe in catalog["recipes"]:
        if eligible(recipe, profile) and (meal is None or recipe["meal"] == meal):
            v = vector(tokens(recipe))
            score = sum(w * v.get(t, 0) for t, w in query.items())
            results.append(dict(recipe, score=score))
    return sorted(
        results,
        key=lambda r: (-r["score"] if mode == "tfidf" else 0, r["minutes"], r["id"]),
    )


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--profile", help="Path to a JSON profile; omitted for demo preferences"
    )
    parser.add_argument("--mode", choices=["tfidf", "baseline"], default="tfidf")
    args = parser.parse_args()
    profile = (
        json.loads(Path(args.profile).read_text())
        if args.profile
        else {"diet": "vegan", "preferred": ["chickpeas", "tomato"], "maxMinutes": 45}
    )
    catalog = json.loads(CATALOG.read_text())
    print(
        json.dumps(
            [
                {"id": r["id"], "name": r["name"], "score": round(r["score"], 8)}
                for r in recommend(catalog, profile, args.mode)
            ],
            indent=2,
        )
    )
