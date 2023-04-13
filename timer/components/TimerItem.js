import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const TimerItem = ({ id, name, duration, onDelete, onPress }) => {
  const [formattedTime, setFormattedTime] = React.useState("0:00:00");
  const handleDelete = () => {
    onDelete(id);
  };

  const handlePress = () => {
    onPress(id);
  };

  useFocusEffect(
    React.useCallback(() => {
      const getformattedTime = async () => {
        const storedTime = await AsyncStorage.getItem(`@timer:${id}`);
        if (storedTime !== null) {
          setFormattedTime(formatTime(parseInt(storedTime)));
        }
      };
      getformattedTime();

      return () => {};
    }, [])
  );

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.timerInfo}>
        <Text style={styles.timerName}>{name}</Text>
        <Text style={styles.timerDuration}>{formattedTime}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const formatTime = (time) => {
  const formattedHours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const formattedMinutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const formattedSeconds = (time % 60).toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timerInfo: {
    flex: 1,
    marginRight: 10,
  },
  timerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timerDuration: {
    fontSize: 16,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TimerItem;
