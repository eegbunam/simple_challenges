import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";

const timezones = [
  {
    label: "Pacific Time (US & Canada)",
    value: "America/Los_Angeles",
    name: "America, Pacific",
  },

  { label: "India Standard Time", value: "Asia/Kolkata", name: "Asia, India" },
];
const apikey = "6bc5d4349da04e10a211c9890bd4a7b0";

const WorldClock = () => {
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0].name);
  const [currentTime, setCurrentTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTime = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://timezone.abstractapi.com/v1/current_time/?api_key=${apikey}&location=${selectedTimezone}`
      );
      const data = await response.json();
      console.log(data);
      setCurrentTime(data.datetime);
      setIsLoading(false);
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 0.8,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>World Clock</Text>

        <Picker
          selectedValue={selectedTimezone}
          onValueChange={(value) => setSelectedTimezone(value)}
          style={styles.picker}
        >
          {timezones.map((timezone) => (
            <Picker.Item
              key={timezone.name}
              label={timezone.label}
              value={timezone.name}
            />
          ))}
        </Picker>
      </View>
      <View
        style={{
          flex: 0.2,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {currentTime && (
          <>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
          </>
        )}

        <Text style={styles.button} onPress={fetchTime}>
          Fetch Time
        </Text>
      </View>
    </View>
  );
};

const formatTime = (timeString) => {
  var time = new Date(timeString);
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 32,
    textAlign: "center",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    // width: "100%",
    // padding: 10,
    width: 300,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    fontSize: 18,
    color: "#007aff",
    textDecorationLine: "underline",
  },
});

export default WorldClock;
