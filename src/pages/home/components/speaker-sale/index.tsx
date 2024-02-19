import SpeakerIcon from "assets/svg/speaker.svg";
import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { HomeContentType, Notification } from "models/home-config";
import React from "react";
import { useNavigate } from "react-router-dom";

interface SpeakerSaleProps {
  notificationDTOs?: Notification[];
}

const SpeakerSale = (props: SpeakerSaleProps) => {
  const { notificationDTOs } = props;

  const navigate = useNavigate();

  const handleClick = (notification: Notification) => {
    switch (notification.type) {
      case HomeContentType.FLASH_SALE:
      case HomeContentType.SALE:
        notification.modelId &&
          navigate(`${PATH_NAME.FLASH_SALE}/${notification.modelId}`);
        break;
      case HomeContentType.PRODUCT:
        notification.modelId &&
          navigate(`${PATH_NAME.PRODUCT}/${notification.modelId}`);
        break;
      case HomeContentType.SUBSCRIPTION:
        notification.modelId &&
          navigate(`${PATH_NAME.SUBSCRIPTION}/${notification.modelId}`);
        break;

      default:
        break;
    }

    ga4.trackEvent(EVENT_ACTION.FLASH_SALE.CLICK, {
      search_term: { id: notification.modelId },
    });
  };

  return (
    <div className="bg-background-primary sticky top-0 z-50 py-1.5">
      <div className="flex flex-row bg-background-primary w-full px-2 py-2 relative overflow-hidden">
        <img src={SpeakerIcon} />
        <div className="ml-2 overflow-hidden w-full">
          <p className="sale-text ml-2 text-red-color font-semibold">
            {notificationDTOs?.map((notification, index) => (
              <span
                key={index}
                onClick={() =>
                  notification?.modelId && handleClick(notification)
                }
              >
                {notification.message}&emsp;&emsp;
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakerSale;
