# Localflow User Guide (Internal)

This guide explains how to import a project, browse and edit the Backlog, and use Boards for drag-and-drop workflow. It also includes common FAQs and troubleshooting tips.

Note: Screenshots are referenced by section (e.g., [Screenshot: Backlog Table]) and can be added later to `docs/screenshots/`.

## 1) Import a Project and `.planning`

Localflow works with a project folder that contains a `.planning` directory. Inside `.planning`, use the following subfolders:
- `epics/` for Epic markdown files
- `stories/` for Story markdown files
- `tasks/` for Task markdown files

Each item is a `.md` file with YAML frontmatter at the top, e.g.:
```yaml
---
type: story
title: Story A
status: todo
priority: Medium
points: 3
parentEpicPath: /path/to/project/.planning/epics/001-epic-a.md
---
```
Content below the frontmatter is optional and displayed in the detail view.

### Steps to import
1. Launch the app.
2. Open Settings → Select the project root folder.
3. Ensure the app created the `.planning` structure (epics/stories/tasks) and a README template.
4. Use Import JSON (Overview page shortcut) to add planning items from an exported index JSON.
   - Filename collisions are auto-resolved with a `-import-N` suffix.
   - Invalid types are skipped and reported.

## 2) Backlog: Browse, Filter, and Edit

Open Backlog from the sidebar or the Overview page.
- Table columns include Title, Status, Priority, Assignee, Filename.
- Use the search box and status filter to narrow results.
- Click a Title to open the Detail view.

### Detail view
- Shows frontmatter and content of the selected item.
- Breadcrumbs show the hierarchy (Epic → Story → Task) where applicable.
- Related section lists linked items (e.g., Story’s tasks, Epic’s stories).
- Quick actions: open the Story/Task editor.

### Editors
- Story Editor and Task Editor load frontmatter and allow changes to:
  - Title, Status, Priority, Points
  - Owner/Assignee (task), Tags
  - Linking: Parent Epic (story), Linked Story (task)
- Save commits changes back to the original markdown file via secure IPC.

## 3) Boards: Drag-and-Drop Workflow

The Boards page organizes Stories into columns by Status: Todo, In Progress, Done.
- Drag a Story from one column to another to update its status.
- Inline edit:
  - Status dropdown on the card (with confirm on Done)
  - Priority dropdown on the card
- Changes are persisted to the Story’s frontmatter and the UI refreshes automatically via the watcher.

## 4) Import/Export

- Export index JSON (planned) can be imported back using the Import JSON button.
- Import reports:
  - `created`: number of items created
  - `conflicts`: collisions resolved with new filenames
  - `errors`: skipped items or write failures
- All import actions are recorded in the Activity log.

## 5) Settings

- Theme: choose light/dark.
- Activity Log: enable/disable optional logging.
- Index Excludes: performance filters for the indexer.
- Database Path: shows the SQLite file location used by the app.

## 6) FAQ & Troubleshooting

- Watcher error: “Watcher lỗi …”
  - The app will retry with exponential backoff and automatically recover.
  - If it persists, check filesystem permissions and that `.planning` subfolders exist.

- Import shows conflicts
  - Files with the same name already exist; new ones receive a `-import-N` suffix.
  - Review activity log to see which files were affected.

- Detail view shows empty content
  - Ensure the file is inside `.planning` and has correct frontmatter `type`.
  - The app only reads files under `.planning` for safety.

- Editors do not list items
  - Verify the project root and `.planning` structure.
  - Re-open Settings and reselect the project folder.

- Performance concerns on large projects
  - Use Settings → Index Excludes to skip patterns (e.g., temporary files).

- Security reminders
  - NodeIntegration is disabled; Preload bridge exposes a whitelist of IPC calls.
  - File reads are restricted to `.planning`.

## 7) Keyboard Shortcuts (Dev only)

- Toggle DevTools: Ctrl/Cmd+Shift+I or F12 (development builds only).

---

Appendix: Frontmatter keys by type
- Epic: `type`, `title`, `status?`, `priority?`, `tags?`
- Story: `type`, `title`, `status?`, `priority?`, `points?`, `owner?`, `tags?`, `parentEpicPath?`
- Task: `type`, `title`, `status?`, `priority?`, `points?`, `owner?`, `assignee?`, `tags?`, `linkedStoryPath?`
