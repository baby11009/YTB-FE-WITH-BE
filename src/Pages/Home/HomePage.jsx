import { useState, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayOut from "../../Layout/MainLayOut";
import { Body, Header } from "../../Component";
import { scrollToTop } from "../../util/scrollCustom";
import MainPage from "./Main/MainPage";
import ShortPage from "./Short/ShortPage";
import ChannelPage from "./Channel/ChannelPage";
import PostPage from "./Comunity Post/PostPage";
import SubscribeContentPage from "./Subscribe Content/SubscribeContentPage";
import SubscribeChannel from "./Subscribe Content/SubscribeChannel";
import WatchedPage from "./Watched/WatchedPage";
import PlaylistsPage from "./Playlists/PlaylistsPage";
import PlaylistPage from "./Playlist/PlaylistPage";
import YtbChannelPage from "./Ytb Channel/YtbChannelPage";
import FeedPage from "./Feed/FeedPage";
import NewsPage from "./News/NewsPage";
import GamingPage from "./Gaming/GamingPage";
import MyChannelPage from "./MyChannel/MyChannelPage";
import SearchPage from "./Search/SearchPage";
import { useAuthContext } from "../../Auth Provider/authContext";

const HomePage = () => {
  const navigate = useNavigate();

  const params = useParams();

  const { openedMenu, setOpenedMenu } = useAuthContext();

  const [renderComponent, setRenderComponent] = useState(undefined);

  const componentMap = useRef({
    main: <MainPage />,
    short: <ShortPage />,
    channel: <ChannelPage />,
    post: <PostPage />,
    "sub-content": <SubscribeContentPage />,
    "sub-channels": <SubscribeChannel />,
    watched: <WatchedPage />,
    playlists: <PlaylistsPage />,
    playlist: <PlaylistPage />,
    "ytb-channel": <YtbChannelPage />,
    feed: <FeedPage />,
    news: <NewsPage />,
    gaming: <GamingPage />,
    "my-channel": <MyChannelPage />,
    search: <SearchPage />,
  });

  useLayoutEffect(() => {
    scrollToTop();
  }, [params]);

  useLayoutEffect(() => {
    const path = params.path || "main";

    const pageRender = componentMap.current[path];

    if (pageRender) {
      setRenderComponent(pageRender);
    } else {
      setRenderComponent(componentMap.current["main"]);
      navigate("/", { replace: true });
    }
  }, [params, openedMenu]);

  return (
    <MainLayOut>
      <Header setOpenedMenu={setOpenedMenu} />
      <Body
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
        RenderContent={renderComponent}
      />
    </MainLayOut>
  );
};
export default HomePage;
