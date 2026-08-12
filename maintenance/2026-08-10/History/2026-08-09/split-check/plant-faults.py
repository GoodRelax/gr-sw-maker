# plant-faults - build one faulted copy of the skeleton per detection, so that
# "the list was empty" can be distinguished from "the query never ran".
#
# usage: python plant-faults.py <skeleton.md> <out-root>

import io
import os
import shutil
import sys


def read(path):
    return io.open(path, encoding="utf-8").read()


def write(path, text):
    io.open(path, "w", encoding="utf-8").write(text)


def drop_node(text, uid):
    """Remove the node whose UID line matches, from its heading to the next heading."""
    marker = "**UID**: " + uid + "\n"
    at = text.index(marker)
    start = text.rindex("\n#### ", 0, at) + 1
    nxt = text.find("\n#### ", at)
    alt = text.find("\n### ", at)
    if nxt == -1 or (alt != -1 and alt < nxt):
        nxt = alt
    if nxt == -1:
        nxt = len(text)
    return text[:start] + text[nxt + 1:]


def drop_relations(text, uid):
    """Remove the Relations block that follows the node with this UID."""
    at = text.index("**UID**: " + uid + "\n")
    rel = text.index("**Relations**:", at)
    nxt = text.find("\n#### ", rel)
    alt = text.find("\n### ", rel)
    if nxt == -1 or (alt != -1 and alt < nxt):
        nxt = alt
    return text[:rel] + text[nxt + 1:]


def drop_all(text, *uids):
    for uid in uids:
        text = drop_node(text, uid)
    return text


# TC and TR are a single running sequence across the three test families, so the
# family a number belongs to is not guessable: TC-001/002 verify use cases,
# TC-003/004 software specifications, TC-005/006 non-functional requirements.
FAULTS = {
    "d17": lambda t: drop_relations(t, "FR-001"),
    "d16a": lambda t: drop_all(t, "TR-001", "TC-001"),
    "d16b": lambda t: drop_all(t, "TR-003", "TC-003"),
    "d16c": lambda t: drop_all(t, "TR-005", "TC-005"),
    "d16d": lambda t: drop_all(t, "TR-003", "TC-003", "SWS-001"),
    "d19": lambda t: drop_node(t, "TR-001"),
    "d20": lambda t: t.replace("  **ID**: `SWS-001`\n  **Role**: `Verifies`",
                               "  **ID**: `FR-001`\n  **Role**: `Verifies`"),
    "d21": lambda t: t.replace("SWS-001", "SW-001"),
}

skeleton, out_root = sys.argv[1], sys.argv[2]
grammar = os.path.join(os.path.dirname(skeleton), "spec-anms.sgra")
source = read(skeleton)

for name, apply in FAULTS.items():
    directory = os.path.join(out_root, name)
    shutil.rmtree(directory, ignore_errors=True)
    os.makedirs(directory)
    write(os.path.join(directory, "01-11-spec.md"), apply(source))
    shutil.copyfile(grammar, os.path.join(directory, "spec-anms.sgra"))
    print("planted " + name)
