import React, { ReactNode } from "react";
import { ScrollView as CustomScrollView } from "react-native";
import hmScrollViewStyles from "./styles";

const ScrollView = ({ children }: { children: ReactNode }) => {
  const styles = hmScrollViewStyles();
  return <CustomScrollView showsVerticalScrollIndicator={false} style={styles.container}>{children}</CustomScrollView>;
};

export default ScrollView;
