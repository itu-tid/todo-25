import { AccessTime } from "@mui/icons-material";
import moment from "moment";

export default function ItemDuration({ displayTime, showAnimation }) {
  if (!displayTime > 0) {
    return null;
  }

  return (
    <span
      style={{
        fontSize: "small",
        color: "green",
        marginLeft: "1em",
      }}
    >
      {showAnimation && (
        <AccessTime
          style={{
            fontSize: "14px",
            transform: `rotate(${(displayTime % 4) * 90}deg)`,
            transition: "transform 0.3s ease",
          }}
        />
      )}
      {moment.duration(displayTime, "seconds").humanize()} ({displayTime}s)
    </span>
  );
}
