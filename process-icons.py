#!/usr/bin/env python3
import json
import os
from argparse import ArgumentParser

import yaml

if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("output", default="./client/src/assets/bs-icons.json")

    args = parser.parse_args()
    icons_dir = os.path.join(os.path.dirname(__file__), "bs-icons/docs/content/icons/")
    output = {}
    for f in os.listdir(icons_dir):
        if os.path.splitext(f)[1] == ".md":
            iconname = os.path.splitext(f)[0]
            with open(os.path.join(icons_dir, f)) as file:
                icon_raw_data = file.read()
            icon_raw_data = icon_raw_data.replace("---", "")
            icon_data = yaml.safe_load(icon_raw_data)

            def process_tag(tag: str | bool):
                if isinstance(tag, str):
                    return tag
                elif tag is True:
                    return "true"
                else:
                    return "false"

            icon_data["tags"] = (
                [process_tag(tag) for tag in icon_data["tags"]]
                if icon_data["tags"]
                else []
            )
            icon_data["title"] = str(icon_data["title"])
            icon_data["categories"] = (
                icon_data["categories"] if icon_data["categories"] else []
            )
            output[iconname] = icon_data.copy()

    with open(args.output, "w") as file:
        file.write(json.dumps(output, indent=4))
