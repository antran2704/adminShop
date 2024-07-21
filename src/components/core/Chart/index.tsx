import { ChartData, ChartOptions, ChartTypeRegistry } from "chart.js";
import clsx from "clsx";
import { forwardRef, Fragment } from "react";
import { Bar } from "react-chartjs-2";

interface Props<T extends keyof ChartTypeRegistry> {
  type: T;
  options: ChartOptions<T>;
  data: ChartData<T>;
  className?: string;
}

const ChartCore = <T extends keyof ChartTypeRegistry>(
  props: Props<T>,
  chartWeekRef: any,
) => {
  const { type, className, data, options } = props;
  switch (type) {
    case "bar":
      return (
        <Bar
          ref={chartWeekRef}
          className={clsx(className)}
          data={data as ChartData<"bar">}
          options={options as ChartOptions<"bar">}
        />
      );

    default:
      return <Fragment />;
  }
};

export default forwardRef(ChartCore);
