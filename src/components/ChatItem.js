import React from "react";
import { ListItem } from "@material-ui/core";

const styles = {
  listItem: (userMsg) => ({
    flexDirection: "column",
    alignItems: userMsg ? "flex-end" : "flex-start",
  }),
  container: (userMsg) => ({
    maxWidth: "75%",
    borderRadius: 10,
    padding: 10,
    color: "white",
    fontSize: 12,
    backgroundColor: userMsg ? "#F36E65" : "#9ea1a8",
  }),
  author: { fontSize: 10, color: "gray" },
  timestamp: { fontSize: 8, color: "white", textAlign: "right", paddingTop: 5 },
};

function ChatItem(props) {
  const message = props.message;
  const email = props.email;
  const userMsg = message.author === email;
  return (
    <ListItem style={styles.listItem(userMsg)}>
      <div style={styles.author}>{message.author}</div>
      <div style={styles.container(userMsg)}>
        {message.body}
        <div>
          {new Date(message.dateCreated.toISOString()).toLocaleString()}
        </div>
      </div>
    </ListItem>
  );
}

export default ChatItem;
