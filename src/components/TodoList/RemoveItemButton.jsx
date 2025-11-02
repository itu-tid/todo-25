export default function RemoveItemButton({ onClick }) {
  return (
    <a
      href="#"
      onClick={onClick}
      style={{
        color: "#a2a2a2cf",
        fontSize: "xx-small",
        marginLeft: "2em",
        textDecoration: "none",
      }}
    >
      (remove)
    </a>
  );
}
