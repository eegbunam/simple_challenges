import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimerItem from "../components/TimerItem";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);

  // Load timers from async storage
  useEffect(() => {
    const loadTimers = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@timers");
        if (jsonValue !== null) {
          setTimers(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log("Error loading timers:", e);
      }
    };
    loadTimers();
  }, []);

  // Save timers to async storage when screen is focused
  const isFocused = useIsFocused();
  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem("@timers", JSON.stringify(timers));
      } catch (e) {
        console.log("Error saving timers:", e);
      }
    };
    if (isFocused) {
      saveTimers();
    }
  }, [timers, isFocused]);

  const handleAddTimer = () => {
    const newTimer = {
      id: Date.now().toString(),
      name: `Timer ${timers.length + 1}`,
      duration: 0,
    };
    setTimers([...timers, newTimer]);
    navigation.navigate("Timer", { timerId: newTimer.id });
  };

  const handleDeleteTimer = (timerId) => {
    setTimers((prevTimers) => prevTimers.filter((t) => t.id !== timerId));
  };

  const handleTimerPress = (timerId) => {
    navigation.navigate("Timer", { timerId });
  };

  return (
    <View style={styles.container}>
      {timers.length > 0 ? (
        <FlatList
          data={timers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TimerItem
              id={item.id}
              name={item.name}
              duration={item.duration}
              onDelete={handleDeleteTimer}
              onPress={handleTimerPress}
            />
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>No timers yet</Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTimer}>
        <Text style={styles.addButtonText}>Add Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
