import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { getSinglePost, searchPosts } from "../api/posts";
import PostListItem from "./PostListItem";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const navigation = useNavigation();

  const handleOnSubmit = async () => {
    if (!query.trim()) return;

    // submitting the form
    const { error, posts } = await searchPosts(query);
    if (error) return console.log(error);

    setResults([...posts]);
  };

  const handlePostPress = async (slug) => {
    const { error, post } = await getSinglePost(slug);

    if (error) return console.log(error);
    navigation.navigate("PostDetail", { post });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={(text) => setQuery(text)}
        placeholder="Search..."
        onSubmitEditing={handleOnSubmit}
        style={styles.searchInput}
      />
      <ScrollView>
        {results.map((post) => {
          return (
            <View key={post.id} style={styles.listItem}>
              <PostListItem
                post={post}
                onPress={() => handlePostPress(post.slug)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#383838",
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    marginTop: 10,
  },
});
