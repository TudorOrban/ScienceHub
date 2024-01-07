## Rust Microservice

A simple Rust microservice that listens for requests from main (TextEditor) and finds project data corresponding to a specified project version. It is intended to gradually evolve into a fully-fledged backend for the website, starting with delegating other resource-intesive tasks to it (accepting submissions, validating and sanitizing complex files etc).

### Workflow

ScienceHub's version control system's way of storing data is hybrid: it uses deltas for minimizing storage resources while also storing periodic snapshots for minimizing necessary computations for reconstruction.

As such, to reconstruct the project version data, the algorithm goes through the following process. Given a project id and a project version id:

#### I. Fetch project version, which stores all the corresponding existing works, along with their work versions.
#### II. For each work,taking advantage of Rust's multithreading:
##### 1. Fetch graph of that work's versions, including the information of which versions are stored as snapshots
##### 2. Find closest snapshot (BFS) and fetch it
##### 3. For each submission (i.e. commit) along the path, fetch corresponding deltas, which consist of (nested fields of) text diffs
##### 4. For each non-empty text diff in each delta, apply it to the corresponding work field. At the end, gather all the results and return.