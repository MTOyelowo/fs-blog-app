import { View, StyleSheet } from "react-native";
import React from "react";

const Seperator = ({
  width = "100%",
  height = 1,
  backgroundColor = "#D3D3D3",
  style,
}) => {
  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor,
          alignSelf: "center",
          marginVertical: 8,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Seperator;
