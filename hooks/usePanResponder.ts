import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

export const usePanResponder = (
  isExpanded: boolean,
  setIsExpanded: (expanded: boolean) => void
) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow vertical movement
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Always follow the finger movement
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Swipe down - collapse
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 500,
              duration: 300,
              useNativeDriver: true,
            })
          ]).start(() => setIsExpanded(false));
        } else if (gestureState.dy < -50 && !isExpanded) {
          // Swipe up - expand
          setIsExpanded(true);
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            })
          ]).start();
        } else {
          // Return to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return { translateY, slideAnim, panResponder };
};
