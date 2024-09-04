import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  ChartTypeRegistry,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Legend,
  Filler,
  Tooltip,
} from "chart.js";
import clsx from "clsx";
import { forwardRef, Fragment } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

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

    case "line":
      return (
        <Line
          ref={chartWeekRef}
          className={clsx(className)}
          data={data as ChartData<"line">}
          options={options as ChartOptions<"line">}
        />
      );

    case "pie":
      return (
        <Pie
          ref={chartWeekRef}
          className={clsx(className)}
          data={data as ChartData<"pie">}
          options={options as ChartOptions<"pie">}
        />
      );

    default:
      return <Fragment />;
  }
};

export default forwardRef(ChartCore);
