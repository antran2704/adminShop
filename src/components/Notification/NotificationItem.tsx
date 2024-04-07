import { INotificationItem } from "~/interface";
import ImageCus from "../Image/ImageCus";
import { iconNoti, styleTypeNoti } from "./data";
import { getDateTime } from "~/helper/datetime";

interface Props {
  data: INotificationItem;
  onClick: (data: INotificationItem) => void;
}

const NotificationItem = (props: Props) => {
  const { data, onClick } = props;

  return (
    <div onClick={() => onClick(data)} className="w-full flex items-center px-5 py-2 cursor-pointer gap-5">
      <ImageCus
        src={iconNoti[data.type]}
        className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full"
      />
      <div className="w-full flex items-center justify-between gap-5">
        <div className="w-full">
          <p
            className={`lg:max-w-[600px] md:max-w-[500px] sm:max-w-[400px] max-w-[200px] w-[500px] text-start text-sm ${
              !data.isReaded ? "font-medium" : "font-normal"
            } line-clamp-2`}
          >
            {data.content}
          </p>
          <div className="flex items-center pt-2 gap-2">
            <p
              className={`text-white text-start whitespace-nowrap text-xs capitalize px-2 py-1 rounded-full ${
                styleTypeNoti[data.type]
              }`}
            >
              {data.type}
            </p>
            <p className="text-start whitespace-nowrap text-xs">
              {getDateTime(data.createdAt)}
            </p>
          </div>
        </div>
        {!data.isReaded && (
          <span className="block w-2 h-2 rounded-full bg-primary"></span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
