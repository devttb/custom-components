import { Slider, SliderProps } from '@mantine/core';
import classes from './progress-bar.module.css';

export const ProgressBar = (props: SliderProps) => {
  return (
    <Slider size={3} classNames={classes} {...props}>
      {props?.children}
    </Slider>
  );
};
