import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Platform } from 'react-native';
import type { Direction } from '@/types/game';

type Props = {
  onDirectionChange: (direction: Direction) => void;
};

export function Joystick({ onDirectionChange }: Props) {
  const [pan] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const STICK_RADIUS = 40;
  const BASE_RADIUS = 80;
  const MOVE_THRESHOLD = 20;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.extractOffset();
    },
    onPanResponderMove: (_, gesture) => {
      const distance = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);
      const angle = Math.atan2(gesture.dy, gesture.dx);
      
      const limitedDistance = Math.min(distance, BASE_RADIUS - STICK_RADIUS);
      const newX = limitedDistance * Math.cos(angle);
      const newY = limitedDistance * Math.sin(angle);

      pan.setValue({ x: newX, y: newY });

      // Yön belirleme
      if (distance > MOVE_THRESHOLD) {
        const degrees = angle * 180 / Math.PI;
        
        if (degrees > -45 && degrees <= 45) {
          onDirectionChange('RIGHT');
        } else if (degrees > 45 && degrees <= 135) {
          onDirectionChange('DOWN');
        } else if (degrees > 135 || degrees <= -135) {
          onDirectionChange('LEFT');
        } else {
          onDirectionChange('UP');
        }
      }
    },
    onPanResponderRelease: () => {
      pan.flattenOffset();
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.base}>
        <Animated.View
          style={[
            styles.stick,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    alignSelf: 'center',
    padding: 10,
    marginBottom: Platform.OS === 'ios' ? 20 : 15,
  },
  base: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(150, 150, 150, 0.4)',
  },
  stick: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 