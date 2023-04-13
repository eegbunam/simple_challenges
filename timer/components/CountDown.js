import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

function Countdown({ timerId }) {
  const async_storage_key = `@timer:${timerId}`;
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleHoursChange = (value) => {
    setHours(parseInt(value));
  };

  const handleMinutesChange = (value) => {
    setMinutes(parseInt(value));
  };

  const handleSecondsChange = (value) => {
    setSeconds(parseInt(value));
  };

  useEffect(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setRemainingTime(totalSeconds);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    AsyncStorage.getItem(async_storage_key).then((value) => {
      setRemainingTime(parseInt(value) || 0);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(async_storage_key, remainingTime.toString());
  }, [remainingTime]);

  useEffect(() => {
    if (isRunning) {
      setInitialTime(Date.now());
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      //  some more trciks can be applied here to make the timer as accurate as possible

      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newRemainingTime = Math.max(prevTime - 1, 0);
          AsyncStorage.setItem(async_storage_key, newRemainingTime.toString());
          if (prevTime === 0) {
            setIsRunning(false);
            return 0;
          }
          return newRemainingTime;
        });
      }, 900);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, initialTime]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    AsyncStorage.removeItem(async_storage_key);
    setRemainingTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
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

  return (
    <>
      <View
        style={{
          flex: 1,
          marginTop: 8,
        }}
      >
        <Text style={{ fontSize: 50 }}>{formatTime(remainingTime)}</Text>
        {isRunning ? (
          <Button title="Pause" onPress={handlePause} />
        ) : (
          <Button title="Start" onPress={handleStart} />
        )}
        <Button title="Reset" onPress={handleReset} />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Picker
          selectedValue={hours}
          onValueChange={handleHoursChange}
          style={{ height: 50, width: 100 }}
        >
          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
            <Picker.Item key={hour} label={hour.toString()} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={minutes}
          onValueChange={handleMinutesChange}
          style={{ height: 50, width: 100 }}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
            <Picker.Item
              key={minute}
              label={minute.toString().padStart(2, "0")}
              value={minute}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={seconds}
          onValueChange={handleSecondsChange}
          style={{ height: 50, width: 100 }}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((second) => (
            <Picker.Item
              key={second}
              label={second.toString().padStart(2, "0")}
              value={second}
            />
          ))}
        </Picker>
      </View>
    </>
  );
}

export default Countdown;
