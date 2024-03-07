import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import PostListItem from "./PostListItem";
import { getSimilarPosts, getSinglePost } from "../api/posts";

const RelatedPosts = ({ postId, onPostPress }) => {
  const [posts, setPosts] = useState([]);

  const fetchSimilarPosts = async () => {
    const { error, posts } = await getSimilarPosts(postId);
    if (error) console.log(error);
    setPosts([...posts]);
  };

  useEffect(() => {
    fetchSimilarPosts();
  }, [postId]);

  return posts.map((post) => {
    return (
      <View style={{ marginBottom: 5 }} key={post.id}>
        <PostListItem onPress={() => onPostPress(post.slug)} post={post} />
      </View>
    );
  });
};

export default RelatedPosts;

const styles = StyleSheet.create({});
