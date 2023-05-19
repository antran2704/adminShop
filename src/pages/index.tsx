import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiCircleThreeQuarter } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart2",
    },
  },
};

export default function Home() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        data: [1, 2, 30.2],
        backgroundColor: "#418efd",
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <div className="w-full h-[10%] lg:mb-10 mb-5">
        <h1 className="lg:text-3xl text-2xl font-bold mb-1">
          Welcome Back Antrandev
        </h1>
        <p className="text-lg"> Manager your maketing's performence</p>
      </div>
      <div className="w-full lg:mb-10 mb-5">
        <h2 className="text-xl font-medium mb-4">Performance</h2>
        <div className="flex lg:flex-row flex-col items-start justify-between h-full gap-10">
          <div className="lg:w-7/12 w-full h-full bg-[#f4f7ff] rounded-xl p-5">
            <div>
              <h3 className="text-lg font-bold">$4.4139,54</h3>
              <span className="text-base text-[#b0b0b0]">Increase</span>
            </div>
            <Bar options={options} data={data} />
          </div>
          <div className="flex flex-col lg:w-5/12 w-full h-full gap-2">
            <div className="w-full lg:h-[60%] bg-[#ecf3fe] px-5 py-10 rounded-xl">
              <div className="flex items-center mb-3 gap-2">
                <BiCircleThreeQuarter className="text-4xl text-[#74aef8]" />
                <p className="text-3xl font-bold">543.3K</p>
              </div>
              <p className="text-lg font-medium">Total today</p>
            </div>
            <div className="flex item-start justify-between w-full lg:h-[40%] bg-[#eef8f3] px-5 py-10 rounded-xl gap-10">
              <div>
                <h3 className="text-xl font-bold mb-3">Orders today: 23</h3>
                <button className="w-fit font-medium text-white bg-[#71ce98] px-5 py-2 rounded-lg mx-auto">
                  Detail
                </button>
              </div>
              <AiOutlineShoppingCart className="text-3xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Recent Order</h2>
          <a
            href="/"
            className="text-base font-medium text-[#74aef8] hover:underline"
          >
            View All
          </a>
        </div>
        <div>
          <ul className="grid grid-cols-6 grid-rows-1 text-base text-[#b0b0b0] mb-2">
            <li className="text-center">Creator</li>
            <li className="text-center">Contact</li>
            <li className="text-center">Spent</li>
            <li className="text-center">Placement</li>
            <li className="text-center">Status</li>
            <li className="text-center"></li>
          </ul>
          <ul className="flex flex-col items-start gap-3">
            <li className="grid grid-cols-6 grid-rows-1 w-full items-center bg-[#f4f7ff] py-2 px-3 rounded-lg hover:shadow-md transition-all ease-linear duration-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <div>
                  <img
                    className="w-10 h-10 border rounded-full"
                    src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-1/339008852_924551378682494_5390565819522752388_n.jpg?stp=dst-jpg_p100x100&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=kBy7yusXoccAX9A1PZM&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfCpsY3N3Ra1Bqoni8C_6auUpH4qB2bnpDv4YEOF96Mq8Q&oe=64642926"
                    alt="avatar"
                  />
                </div>
                <h3 className="text-base font-medium">AntranDev</h3>
              </div>
              <p className="text-base text-center">0946003423</p>
              <p className="text-base text-center">$1000</p>
              <p className="text-base text-center">ADV</p>
              <p className="w-fit font-medium text-white bg-[#71ce98] px-5 py-2 rounded-lg mx-auto">
                Active
              </p>
              <div className="flex items-center justify-center cursor-pointer">
                <HiOutlineDotsHorizontal className="text-2xl" />
              </div>
            </li>
            <li className="grid grid-cols-6 grid-rows-1 w-full items-center bg-[#f4f7ff] py-2 px-3 rounded-lg hover:shadow-md transition-all ease-linear duration-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <div>
                  <img
                    className="w-10 h-10 border rounded-full"
                    src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-1/339008852_924551378682494_5390565819522752388_n.jpg?stp=dst-jpg_p100x100&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=kBy7yusXoccAX9A1PZM&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfCpsY3N3Ra1Bqoni8C_6auUpH4qB2bnpDv4YEOF96Mq8Q&oe=64642926"
                    alt="avatar"
                  />
                </div>
                <h3 className="text-base font-medium">AntranDev</h3>
              </div>
              <p className="text-base text-center">0946003423</p>
              <p className="text-base text-center">$1000</p>
              <p className="text-base text-center">ADV</p>
              <p className="w-fit font-medium text-white bg-[#71ce98] px-5 py-2 rounded-lg mx-auto">
                Active
              </p>
              <div className="flex items-center justify-center cursor-pointer">
                <HiOutlineDotsHorizontal className="text-2xl" />
              </div>
            </li>
            <li className="grid grid-cols-6 grid-rows-1 w-full items-center bg-[#f4f7ff] py-2 px-3 rounded-lg hover:shadow-md transition-all ease-linear duration-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <div>
                  <img
                    className="w-10 h-10 border rounded-full"
                    src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-1/339008852_924551378682494_5390565819522752388_n.jpg?stp=dst-jpg_p100x100&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=kBy7yusXoccAX9A1PZM&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfCpsY3N3Ra1Bqoni8C_6auUpH4qB2bnpDv4YEOF96Mq8Q&oe=64642926"
                    alt="avatar"
                  />
                </div>
                <h3 className="text-base font-medium">AntranDev</h3>
              </div>
              <p className="text-base text-center">0946003423</p>
              <p className="text-base text-center">$1000</p>
              <p className="text-base text-center">ADV</p>
              <p className="w-fit font-medium text-white bg-[#71ce98] px-5 py-2 rounded-lg mx-auto">
                Active
              </p>
              <div className="flex items-center justify-center cursor-pointer">
                <HiOutlineDotsHorizontal className="text-2xl" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
