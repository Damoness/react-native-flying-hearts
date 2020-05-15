import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';

type ShapeProps = {
  style?: ViewStyle;
  onCompleteAnimation: () => void;
};

type ShapeState = {
  spring: Animated.Value;
  position: Animated.Value;
  width: number;
};

const randomNumber = (from: number, range: number) => {
  return Math.round(Math.random() * range + from);
};

export default class AnimatedShape extends Component<ShapeProps, ShapeState> {
  color = `rgb(${randomNumber(0, 255)},${randomNumber(0, 255)},${randomNumber(
    0,
    255
  )})`;

  rotate = `${randomNumber(-15, 30)}deg`;
  position = randomNumber(300, 100);
  positionX = Array.from({ length: 6 }).map(() => randomNumber(-20, 40));
  duration = 4000;

  constructor(props: ShapeProps) {
    super(props);

    this.state = {
      spring: new Animated.Value(0),
      position: new Animated.Value(0),
      width: 0,
    };
  }

  onLayoutHandler = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    this.setState({
      width: width,
    });
  };

  componentDidMount() {
    Animated.parallel([
      Animated.spring(this.state.spring, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),

      Animated.timing(this.state.position, {
        duration: this.duration,
        toValue: this.position,
        useNativeDriver: true,
      }),
    ]).start(this.props.onCompleteAnimation);
  }

  getAnimationStyle() {
    return {
      transform: [
        {
          translateY: this.state.position.interpolate({
            inputRange: [0, this.position],
            outputRange: [0, -this.position],
          }),
        },
        {
          translateX: this.state.position.interpolate({
            inputRange: Array.from({ length: 6 }).map(
              (_x, index) => (this.position / 5) * index
            ),
            outputRange: this.positionX,
          }),
        },
        {
          rotate: this.rotate,
        },
        { scale: this.state.spring },
      ],
      opacity: this.state.position.interpolate({
        inputRange: [0, this.position],
        outputRange: [1, 0],
      }),
    };
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.shapeWrapper,
          this.props.style,
          { left: -this.state.width / 2 },
          this.getAnimationStyle(),
        ]}
        onLayout={this.onLayoutHandler}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  shapeWrapper: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 0,
  },
});
