# Matcher

Matchers are placed in this directory. Matchers allow loading multiple traversals of the same route in the tool.

## Match Poses Fn

`matchPosesFn` should return an array of matched poses for given query poses and a log file

## Export Poses

`exportPoses` function should allow the user to download the matched poses. `downloadJson` helper function from `utils/downloadUtils` is used to let the user download the matched poses json.
