import { StopCircleOutlined } from "@mui/icons-material";
import { PlayArrowOutlined } from "@mui/icons-material";

export default function PlayStopButton({
  element_id,
  done,
  active,
  handleStartTimer,
  handleStopTimer,
}) {
  return !done ? (
    active ? (
      <PlayArrowOutlined
        onClick={() => handleStartTimer(element_id)}
      ></PlayArrowOutlined>
    ) : (
      <StopCircleOutlined
        onClick={() => handleStopTimer(element_id)}
      ></StopCircleOutlined>
    )
  ) : (
    <PlayArrowOutlined
      style={{
        visibility: "hidden",
      }}
    ></PlayArrowOutlined>
  );
}
