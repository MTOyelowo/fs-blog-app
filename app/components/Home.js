import { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { getFeaturedPosts, getLatestPosts, getSinglePost } from "../api/posts";
import Slider from "./Slider";
import Seperator from "./Seperator";
import PostListItem from "./PostListItem";

let pageNo = 0;
const limit = 5;

export default function Home({ navigation }) {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchFeaturedPosts = async () => {
    const { error, posts } = await getFeaturedPosts();
    if (error) return console.log(error);

    setFeaturedPosts(posts);
  };

  const fetchLatestPosts = async () => {
    const { error, posts } = await getLatestPosts(limit, pageNo);
    if (error) return console.log(error);

    setLatestPosts(posts);
  };

  const fetchMorePosts = async () => {
    if (reachedToEnd || busy) return;
    pageNo += 1;
    setBusy(true);
    const { error, posts, postCount } = await getLatestPosts(limit, pageNo);
    setBusy(false);
    if (error) return console.log(error);

    if (postCount === latestPosts.length) return setReachedToEnd(true);

    setLatestPosts([...latestPosts, ...posts]);
  };

  useEffect(() => {
    fetchFeaturedPosts();
    fetchLatestPosts();
  }, []);
  const ListHeaderComponent = () => {
    return (
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        {featuredPosts.length ? (
          <Slider data={featuredPosts} title="Featured Posts" />
        ) : null}
        <View>
          <Seperator />
          <Text
            style={{
              fontWeight: "700",
              color: "#383838",
              fontSize: 18,
            }}
          >
            Latest Posts
          </Text>
        </View>
      </View>
    );
  };

  const fetchSinglePost = async (slug) => {
    const { error, post } = await getSinglePost(slug);
    if (error) console.log(error);
    navigation.navigate("PostDetail", { post });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 15 }}>
        <PostListItem onPress={() => fetchSinglePost(item.slug)} post={item} />
      </View>
    );
  };

  const ItemSeparatorComponent = () => (
    <Seperator width="95%" style={{ marginTop: 15 }} />
  );

  return (
    <FlatList
      data={latestPosts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 30 }}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      renderItem={renderItem}
      onEndReached={async () => fetchMorePosts()}
      onEndReachedThreshold={0}
      ListFooterComponent={() => {
        return reachedToEnd ? (
          <Text
            style={{
              fontWeight: "bold",
              color: "#383838",
              textAlign: "center",
              paddingVertical: 10,
            }}
          >
            No More Posts to Show!
          </Text>
        ) : null;
      }}
    />
  );
}
