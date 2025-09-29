import { StopCircleOutlined } from "@mui/icons-material";
import { PlayArrowOutlined } from "@mui/icons-material";

export default function PlayStopButton({
  isHidden,
  isPlaying,
  onPlay,
  onStop,
}) {
  if (isHidden) {
    // render the button, but hidden - so it takes the same amount of place
    return (
      <PlayArrowOutlined
        style={{
          visibility: "hidden",
        }}
      ></PlayArrowOutlined>
    );
  }

  return isPlaying ? (
    <StopCircleOutlined onClick={onStop}></StopCircleOutlined>
  ) : (
    <PlayArrowOutlined onClick={onPlay}></PlayArrowOutlined>
  );
}
