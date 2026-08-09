# checks.jq - detections the StrictDoc grammar cannot express.
#
# The grammar enforces the shape of a node. It cannot say "every use case must be
# covered by a test" or "a prefix must match the node type", because those are
# properties of the graph, not of one node. This file holds those.
#
# Run:
#   strictdoc export docs/spec --formats=json --output-dir out/json --no-parallelization
#   jq -f tools/spec-query/checks.jq out/json/json/index.json
#
# Every list is expected to be empty. An empty result is NOT evidence that the
# query works: plant a known fault and confirm it is reported before trusting a
# clean run.
#
# The prefix table and the allowed-parent table are duplicated from the writing
# rules. Change them there and here together.

def nodes: [.DOCUMENTS[].NODES | .. | objects | select(.UID != null)];
def parents($n): [($n.RELATIONS // [])[] | select(.TYPE == "Parent") | .VALUE];

nodes as $N
| ($N | map({key: .UID, value: ._NODE_TYPE}) | from_entries) as $TYPE
| ({
    "GOAL":"GL","USE_CASE":"UC","FUNC_REQ":"FR","NON_FUNC_REQ":"NFR",
    "SW_SPEC":"SWS","USE_CASE_TEST":"TC","SW_SPEC_TEST":"TC",
    "NON_FUNC_TEST":"TC","TEST_RESULT":"TR"
  }) as $PREFIX
| ({
    "USE_CASE":["GOAL"],
    "FUNC_REQ":["USE_CASE"],
    "NON_FUNC_REQ":["GOAL"],
    "SW_SPEC":["FUNC_REQ","NON_FUNC_REQ"],
    "USE_CASE_TEST":["USE_CASE"],
    "SW_SPEC_TEST":["SW_SPEC"],
    "NON_FUNC_TEST":["NON_FUNC_REQ"],
    "TEST_RESULT":["USE_CASE_TEST","SW_SPEC_TEST","NON_FUNC_TEST"]
  }) as $ALLOWED
| ([$N[] | select(._NODE_TYPE == "USE_CASE_TEST") | parents(.)[]]) as $cov_uc
| ([$N[] | select(._NODE_TYPE == "SW_SPEC_TEST") | parents(.)[]]) as $cov_sws
| ([$N[] | select(._NODE_TYPE == "NON_FUNC_TEST") | parents(.)[]]) as $cov_nfr
| ([$N[] | select(._NODE_TYPE == "TEST_RESULT") | parents(.)[]]) as $has_result
| ([$N[] | select(._NODE_TYPE == "SW_SPEC") | {sws: .UID, req: parents(.)[]}]) as $sws_of_req
| {
  "D17 nodes off the chain":
    [$N[] | select(._NODE_TYPE != "GOAL") | select(parents(.) | length == 0)
      | "\(._NODE_TYPE) \(.UID)"],

  "D16a USE_CASE not covered by a test":
    [$N[] | select(._NODE_TYPE == "USE_CASE") | select(.UID as $u | ($cov_uc | index($u)) | not) | .UID],

  "D16b SW_SPEC not covered by a test":
    [$N[] | select(._NODE_TYPE == "SW_SPEC") | select(.UID as $u | ($cov_sws | index($u)) | not) | .UID],

  "D16c NON_FUNC_REQ not covered by a test":
    [$N[] | select(._NODE_TYPE == "NON_FUNC_REQ") | select(.UID as $u | ($cov_nfr | index($u)) | not) | .UID],

  "D16d FUNC_REQ not covered by rollup":
    [$N[] | select(._NODE_TYPE == "FUNC_REQ") | .UID as $fr
      | ([$sws_of_req[] | select(.req == $fr) | .sws]) as $mine
      | ([$mine[] | . as $s | select(($cov_sws | index($s)) | not)]) as $uncov
      | if ($mine | length) == 0 then "\($fr) (no SW_SPEC)"
        elif ($uncov | length) > 0 then "\($fr) (uncovered SW_SPEC below it: \($uncov | join(",")))"
        else empty end],

  "D19 tests never run":
    [$N[] | select(._NODE_TYPE | endswith("_TEST"))
      | select(.UID as $u | ($has_result | index($u)) | not) | .UID],

  "D20 tests reaching across a level":
    [$N[] | select(._NODE_TYPE | endswith("_TEST")) as $t
      | parents($t)[] as $p
      | select(($ALLOWED[$t._NODE_TYPE] | index($TYPE[$p])) | not)
      | "\($t.UID) (\($t._NODE_TYPE) -> \($p) which is \($TYPE[$p]))"],

  "D21 prefix violations":
    [$N[] | . as $n
      | select(($n.UID | startswith($PREFIX[$n._NODE_TYPE] + "-")) | not)
      | "\($n.UID) (\($n._NODE_TYPE) should start with \($PREFIX[$n._NODE_TYPE])-)"]
}
