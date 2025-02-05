import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ListRenderItemInfo,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

interface Plant {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface RenderItemProps extends ListRenderItemInfo<Plant> {
  index: number;
}

const PlantSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const plants: Plant[] = [
    {
      id: "1",
      name: "Monstera Deliciosa",
      description:
        "Also known as the Swiss Cheese Plant, famous for its distinctive holes and cuts in its leaves.",
      image:
        "https://plus.unsplash.com/premium_photo-1672998159540-0a3f849fe3c6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "2",
      name: "Snake Plant",
      description:
        "A hardy plant known for its upright sword-like leaves and air purifying qualities.",
      image:
        "https://plus.unsplash.com/premium_photo-1668096747185-624626b732f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGdyZWVuJTIwcGxhbnQlMjBwb3R0ZWR8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: "3",
      name: "Fiddle Leaf Fig",
      description:
        "Popular indoor tree with large, violin-srhaped leaves that can grow quite tall.",
      image:
        "https://images.unsplash.com/photo-1515542647469-5f9a6b25ef5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {plants.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderPlantCard = ({ item, index }: RenderItemProps) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Animated.View>
    );
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={plants}
        renderItem={renderPlantCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      {renderPaginationDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    width: width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: width - 40,
    height: 400,
    borderRadius: 20,
    marginBottom: 20,
  },
  textContainer: {
    width: width - 40,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginHorizontal: 4,
  },
});

export default PlantSwiper;