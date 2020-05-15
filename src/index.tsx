import React, { Component, FunctionComponent } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  ViewStyle,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import AnimatedShape from './AnimatedShape';

const WIDTH = 40; //默认宽度
const AUTO_TRIGGER_INTERVAL = 5000; //自动触发间隔时间()
const MIN_TRIGGER_INTERVAL = 100; //最小触发间隔时间(毫秒)

const randomNumber = (from: number, range: number) => {
  return Math.round(Math.random() * range + from);
};

type Props = {
  style?: ViewStyle;
  renderCustomShape?: FunctionComponent<{ id: number }> | null;
};

type State = {
  shapes: Array<{
    id: number;
    color: string;
  }>;
  width: number;
};

export default class GiveALike extends Component<Props, State> {
  animating = false;
  intervalId: any;

  constructor(props: any) {
    super(props);

    this.state = {
      shapes: [],
      width: WIDTH,
    };
  }

  componentDidMount() {
    this.startAutoCycle();
  }

  componentWillUnmount() {
    this.clearAutoCycle();
  }

  startAutoCycle = () => {
    this.intervalId = setInterval(() => {
      this.pushNewShape();
    }, AUTO_TRIGGER_INTERVAL);
  };

  clearAutoCycle = () => {
    this.intervalId && clearInterval(this.intervalId);
  };

  pushNewShape = () => {
    this.setState({
      shapes: this.state.shapes.concat([
        {
          id: new Date().getTime(),
          color: `rgb(${randomNumber(0, 255)},${randomNumber(
            0,
            255
          )},${randomNumber(0, 255)})`,
        },
      ]),
    });
  };

  removeShape(id: number) {
    this.setState((preState) => {
      return { shapes: preState.shapes.filter((item) => item.id != id) };
    });
  }

  onPress = () => {
    console.log('onPress');

    if (!this.animating) {
      this.animating = true;

      this.clearAutoCycle();

      this.pushNewShape();

      setTimeout(() => {
        this.animating = false;
        this.startAutoCycle();
      }, MIN_TRIGGER_INTERVAL);
    }
  };

  longPressId: any;

  onLayoutHandler = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    //Alert.alert(width+'');
    this.setState({
      width: width,
    });
  };

  render() {
    const { renderCustomShape, style } = this.props;
    const { width } = this.state;

    return (
      <TouchableOpacity
        onLayout={this.onLayoutHandler}
        hitSlop={styles.hitSlop}
        activeOpacity={0.7}
        style={[styles.container, style]}
        onLongPress={() => {
          console.log('onLongPress');
          this.longPressId = setInterval(() => {
            this.onPress();
          }, MIN_TRIGGER_INTERVAL);
        }}
        onPressIn={() => {
          console.log('onPressIn');
        }}
        onPressOut={() => {
          console.log('onPressOut');
          this.longPressId && clearInterval(this.longPressId);
        }}
        onPress={this.onPress}
      >
        <Image
          source={require('./assets/Red_hearts.png')}
          style={{ height: WIDTH, width: WIDTH }}
        />

        <View
          style={{
            position: 'absolute',
            height: 1,
            width: 1,
            top: width / 2,
            right: width / 2,
            //backgroundColor: `rgba(255,255,255,${0.1})`,
          }}
        >
          {this.state.shapes.map((item) => {
            const { id, color } = item;
            return (
              <AnimatedShape
                key={id}
                onCompleteAnimation={this.removeShape.bind(this, id)}
              >
                {renderCustomShape ? (
                  renderCustomShape({ id })
                ) : (
                  <Image
                    source={require('./assets/heart.png')}
                    style={{ tintColor: color }}
                  />
                )}
              </AnimatedShape>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    bottom: 20,
    right: 15,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitSlop: {
    bottom: 10,
    top: 20,
    right: 10,
    left: 20,
  },
});
