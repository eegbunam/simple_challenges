import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/core";

import Countdown from "../components/CountDown";

const TimerScreen = ({}) => {
  const route = useRoute();
  const [time, setTime] = useState(0);
  const [timerId, setTimerId] = useState(
    route.params.timerId || new Date().toString()
  ); // would not do this in prod

  // Load time from AsyncStorage when screen mounts
  useEffect(() => {
    const loadTime = async () => {
      try {
        if (route.params) {
          const storedTime = await AsyncStorage.getItem(route.params.timerId);
          if (storedTime !== null) {
            setTime(parseInt(storedTime));
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadTime();
  }, [route.params]);

  // Save time to AsyncStorage when time changes
  useEffect(() => {
    const saveTime = async () => {
      try {
        if (route.params) {
          await AsyncStorage.setItem(route.params.timerId, time.toString());
        }
      } catch (e) {
        console.log(e);
      }
    };

    saveTime();
  }, [time, route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Countdown timerId={timerId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 24,
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  startButton: {
    backgroundColor: "#004777",
    padding: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
  },
  toggleButton: {
    backgroundColor: "#004777",
    padding: 16,
    borderRadius: 50,
    marginHorizontal: 16,
  },
  playButton: {
    backgroundColor: "#004777",
  },
  pauseButton: {
    backgroundColor: "#dc3545",
  },
  resetButton: {
    backgroundColor: "#6c757d",
  },
});

export default TimerScreen;
