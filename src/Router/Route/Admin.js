import { lazy } from "react";

const AdminPage = lazy(() => import("../../Pages/Admin/AdminPage"));
const UserDisplayPage = lazy(() =>
  import("../../Pages/Admin/User/Display/UserPage"),
);
const UserUpsertPage = lazy(() =>
  import("../../Pages/Admin/User/Upsert/UpsertUser"),
);
const TagPage = lazy(() => import("../../Pages/Admin/Tag/TagPage"));
const VideoDisplayPage = lazy(() =>
  import("../../Pages/Admin/Video/Display/VideoPage"),
);
const VideoUpsertPage = lazy(() =>
  import("../../Pages/Admin/Video/Upsert/UpsertVideo"),
);

const CommentDisplayPage = lazy(() =>
  import("../../Pages/Admin/Comment/Display/CommentPage"),
);
const CommentUpsertPage = lazy(() =>
  import("../../Pages/Admin/Comment/Upsert/UpsertComment"),
);

const PlaylistDisplayPage = lazy(() =>
  import("../../Pages/Admin/Playlist/Display/PlaylistPage"),
);
const PlaylistUpsertPage = lazy(() =>
  import("../../Pages/Admin/Playlist/Upsert/UpsertPlaylist"),
);

export {
  AdminPage,
  UserDisplayPage,
  UserUpsertPage,
  TagPage,
  VideoDisplayPage,
  VideoUpsertPage,
  CommentDisplayPage,
  CommentUpsertPage,
  PlaylistDisplayPage,
  PlaylistUpsertPage,
};
