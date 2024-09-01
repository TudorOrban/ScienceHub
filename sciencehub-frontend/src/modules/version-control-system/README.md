### Goals

We have developed a custom version control system (VCS) for the website, designed to:
- be easily usable by people without a programming background
- encourage intercommunity collaboration
- support incremental development of scientific research
- hit the right middle ground between storage and computational efficiency, given our current resources and the needs of the website.

We are currently in the process of moving most of the logic to the backend, see [to be added](https://github.com/TudorOrban/ScienceHub/tree/main/sciencehub-backend/sciencehub-backend/Features/Submissions/README.md).

# Overview

Projects and works have associated versions. We will start by explaining the versioning of works, from which that of projects will quickly follow. 

### Workflow

Work **Submissions**, akin to Git commits, are blocks storing changes between work versions. Anyone can create submissions for any (public) work and make their intended changes. This is as simple as turning on [Edit Mode](https://github.com/TudorOrban/ScienceHub/tree/main/main/version-control-system/components/WorkEditModeUI.tsx), selecting the submission, editing the text and saving. Once ready, they can *submit*, which makes the submission visible to the main authors of the work. At this point, they may consult, resolve potential conflicts and decide whether to move forwards with the submission. In the latter case, the main authors can *accept*, which effectively merges the submission's changes into the work, and adds the submission's authors as contributors to the work. This workflow design aims at fostering a highly collaborative environment, where anyone can bring scientific value to the table.

### Architecture

On the technical side, we have gone for a hybrid approach of storing versions: submissions hold deltas containing only changes between corresponding versions, but snapshots of the work are regularly taken and used for reconstruction. The use of deltas is memory-efficient for small changes, such as fixing typos, while the use of snapshots greatly reduces the computations required to reconstruct a version's data, thus striking a right balance in resource usage.

There are three types of possible changes to a work:
- for text fields, such as a work's title or description, changes are stored as arrays of [text diffs](https://github.com/TudorOrban/ScienceHub/blob/main/sciencehub-backend/sciencehub-backend/Features/Submissions/VersionControlSystem/Services/TextDiffManager.cs), indicating the positions in a text where characters should be insterted or deleted.
- for text array fields, such as a work's research grants or keywords, we have decided to simply store and use the latest modified value. This is because most such fields are relatively small, and diffing invidual array elements would have complicated the codebase unnecessarily.
- for uploaded files, such as a paper's PDF, there is a record specifying the location in the Supabase buckets of the file to be added/updated/removed.

For reconstructing a work version's data, there is an additional required object: a graph with versions as nodes and submissions as edges, along with isSnapshot markers. Thus, given a work ID and a version ID, the [reconstruction algorithm](https://github.com/TudorOrban/ScienceHub/blob/main/sciencehub-backend/sciencehub-backend/Features/Submissions/VersionControlSystem/Reconstruction/Services/WorkReconstructionService.cs) goes through the following steps:
- fetch version graph and find the closest snapshot to the specified version ID and a path to it (with BFS)
- fetch snapshot and all the submissions along the path
- sequentially apply the corresponding deltas to the snapshot; for text array fields and uploaded files, only latest changes are necessary.

The management of snapshots and version graphs is done during the [Accept Submission process](https://github.com/TudorOrban/ScienceHub/blob/main/sciencehub-backend/sciencehub-backend/Features/Submissions/VersionControlSystem/Services/WorkSubmissionChangesService.cs). The new delta's size is computed, stored and the size of the path to the closest snapshot is computed and compared to the snapshot's size, to determine whether a new snapshot should be taken (with more frequent snapshots as the sizes grow).

### Project Submissions

Just as projects are containers of works, so are **Project Submissions** containers of work submissions (along with deltas for project title, description etc). They follow all the functionality underlined above, with the only addition being that they coordinate their associated work submissions. For instance, accepting a project submission means accepting all its work submissions (and one of those can't be accepted independently).

# Moving forward

While the basis of the system is already in place, there is still work to be done to arrive at a fully functional system. The main problem to tackle centers around *merging* and *conflict resolution*.

Firstly, the current text diff library in use (DiffPlex) seems to generate diffs that are not granular enough (see the failed unit test [DetectConflicts_NonOverlappingEdits_NoConflict](https://github.com/TudorOrban/ScienceHub/blob/main/sciencehub-backend/sciencehub-backend.Tests/Features/Submissions/VersionControlSystem/TextDiffManagerTests.cs)). We will seek improvements that minimize the necessary user input, either through a different library or a custom solution. Secondly, the merging functionality is not currently implemented; this will involve both merging versions and merging project/work submissions, for maximum flexibility.

On the frontend side, one important issue to fix is ensuring the revalidation of the work's dynamic route page data on accepting submission. Currently it isn't working properly, which leads to discrepancies between the data in the database and the one served to the user. Additionally, the approach to generating text diffs on edits may have to be upgraded. It was a conscious decision to always compare the edited text against the initial work version's text, to avoid the complexities of sequential diffs, but a more fine-grained method could significantly enhance the collaboration aspect, especially given the planned [UnifiedEditor](https://github.com/TudorOrban/ScienceHub/blob/main/main/text-editor/UnifiedEditor.tsx) and the conflict resolution issue.