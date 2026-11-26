# 🎵 SoundVault — Music Playlist Manager

A sleek, responsive, and modern Music Playlist Manager built with **React 19**, **Tailwind CSS v4**, **Axios**, and **LocalStorage**. Designed with a dark glassmorphic studio aesthetic inspired by Spotify and Apple Music, featuring real-time playback simulation, drag-and-drop reordering, comprehensive playlist CRUD operations, and responsive UX across mobile (375px), tablet (768px), and desktop (1440px).

---

## 🚀 Live Demo & Repository
- **Tech Stack:** React 19, Tailwind CSS v4, Axios, Lucide Icons, Vite
- **Storage:** HTML5 LocalStorage persistence

---

## 📋 Features Overview

### 1. Song Library
- **Comprehensive Song List:** Displays song title, artist, album, genre, and duration in `mm:ss` format with custom artwork gradient avatars.
- **Real-Time Search:** Instant filtering across song titles, artist names, albums, and genres.
- **Genre Filter Pills:** Category pills with dynamic count badges and an **"All Genres"** filter.
- **UI States:**
  - **Loading State:** Shimmering animated skeletons while fetching data with Axios.
  - **No Results State:** Illustrated empty state with a "Clear Filters" button when no songs match the query.
  - **Error State:** Resilient fallback with a "Try Again" retry action.

### 2. Playlists Management
- **Create Playlist:** Custom modal with name and optional description.
  - **Validation:** Name is strictly required and must be unique (case-insensitive check against existing playlists with instant error feedback).
- **Rename Playlist:** Pre-fills current playlist data and enforces unique naming validation.
- **Delete Playlist (with Confirmation):** Modal dialog warning the user before deletion to prevent accidental data loss.
- **LocalStorage Persistence:** Playlists survive browser refresh and browser restarts (key: `mupm_playlists_v2`), pre-seeded with sample playlists on first visit.

### 3. Add & Remove Songs
- **Add to Playlist:**
  - Dedicated "Add to Playlist" modal for any song in the library.
  - **Duplicate Prevention:** The same song cannot be added twice to a playlist. Already-added playlists show a green "Added" badge and disable the button.
  - Quick action to create a new playlist directly from the add modal.
- **Remove from Playlist:** One-click removal from any playlist with instant metadata recalculation and notification toast.

### 4. Reorder Songs
- **Up & Down Buttons:** Easily shift songs up or down in the playlist. The top song has "Move Up" disabled, and the bottom song has "Move Down" disabled.
- **HTML5 Drag & Drop:** Native drag-and-drop reordering with visual highlight on drop targets.

### 5. Playlist Details
- **Dynamic Header:** Displays playlist title, description, creation date, and total statistics.
- **Metadata Summary:** Exact formatted string as required (e.g. `"8 songs · 32 min"`).
- **Empty Playlist State:** Shows an inviting empty state illustration with a direct CTA button to "Browse Song Library".
- **Play All:** One-click button to load and begin playing all tracks in the playlist in sequence.

### 6. Now Playing Bar
- **Player Controls:** Previous, Play/Pause, Next, Shuffle, and Repeat.
- **Simulated Playback Engine:**
  - Real-time elapsed time counter (`00:00`) and total duration (`mm:ss`).
  - Interactive clickable seekbar / progress scrubber.
  - Animated soundwave equalizer bars on the active song row when playing.
  - Auto-advances to the next song in the active queue when a track completes.
- **Volume & Mute:** Interactive volume slider with mute/unmute toggle.
- **Docked & Responsive:** Compact on mobile devices with an edge-to-edge top micro-scrubber, expanding to a full 3-column control center on tablet and desktop.

---

## 🧩 Reusable Component Architecture

The codebase adheres strictly to clean code standards and modular architecture without copy-pasted UI:

```
src/
├── assets/                  # Icons and static images
├── components/
│   ├── common/
│   │   ├── Badge.jsx        # Color-coded genre pill badges
│   │   ├── Button.jsx       # Universal button with 7 variants & 6 sizes
│   │   ├── Input.jsx        # Text & search inputs with clear button and errors
│   │   ├── Modal.jsx        # Accessible dialog with blur backdrop & ESC key
│   │   └── Toast.jsx        # Floating action feedback notification
│   ├── AddToPlaylistModal.jsx # Multi-playlist selector with duplicate prevention
│   ├── ConfirmModal.jsx     # Delete confirmation dialog
│   ├── Header.jsx           # Top luxury navigation bar with active tab pills
│   ├── PlayerBar.jsx        # Bottom persistent audio player
│   ├── PlaylistCard.jsx     # Playlist grid card with cover mosaic & stats
│   ├── PlaylistModal.jsx    # Create / rename playlist form with validation
│   ├── PlaylistsOverview.jsx# Responsive grid of user playlists
│   ├── PlaylistView.jsx     # Selected playlist hero view & reorderable songs
│   └── SongRow.jsx          # Reusable song row for Library & Playlist views
├── utils/
│   ├── formatters.js        # mm:ss and "X songs · Y min" formatting logic
│   └── storage.js           # LocalStorage get/save helpers with starter defaults
├── App.jsx                  # State orchestration & event handling
├── index.css                # Tailwind CSS v4 directives & keyframe animations
└── main.jsx                 # React root mount
public/
└── songs.json               # Mock dataset (16 songs with diverse genres)
```

---

## 🛠️ How to Run Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd music-playlist-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173).

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 💡 Assumptions Made

1. **Mock Audio Playback:** As stated in the specifications (*"No real audio needed"*), audio playback is simulated with an active timer, seekable progress scrubber, animated audio equalizer waves, and auto-play track progression.
2. **Initial Starter Playlists:** To provide an immediate "out of the box" experience upon first launch, the app populates two default curated playlists (*"Synthwave Drive"* and *"Midnight Lo-Fi & Chill"*). Any changes made by the user are immediately preserved in `localStorage`.
3. **Responsive Breakpoints:** The layout is tailored to look flawless on:
   - **Mobile (375px):** Single-column layout, compact player bar with top micro-scrubber, touch-friendly tap targets, and drawer tabs.
   - **Tablet (768px):** 2-column playlist cards, expanded controls, genre pills.
   - **Desktop (1440px+):** Full multi-column studio layout with side-by-side playlist cards and studio player bar.
4. **Unique Playlist Names:** Playlist name validation is case-insensitive (e.g. "Chill" and "chill" are considered identical) to prevent user confusion.

---

## 🌟 What I Would Improve With More Time

1. **Real Audio Streaming:** Connect to the Web Audio API or Spotify Web Playback SDK / Jamendo API to stream 30-second song previews.
2. **Custom Cover Art Uploads:** Allow users to upload their own image or select from Unsplash presets for playlist cover art.
3. **Song Filtering & Sorting:** Add sort toggles by duration (shortest/longest), title (A-Z), and artist.
4. **Export / Import Playlists:** Add JSON export and import features to share playlists across devices.
5. **Keyboard Shortcuts:** Global hotkeys for Play/Pause (`Space`), Next (`Ctrl + Right`), Previous (`Ctrl + Left`), and Search (`/`).
6. **Collaborative Playlists:** Real-time synchronization using Firebase or Supabase for shared listening sessions.

---

## 📄 License
MIT License. Built for the Frontend Developer Assignment.
