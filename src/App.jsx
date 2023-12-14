import { useState } from "react";
import Center from "./components/Center";
import Header from "./components/Header";

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(true);

  return (
    <>
      <Header
        boardModalOpen={boardModalOpen}
        setBoardModalOpen={setBoardModalOpen}
      />

      <Center />
    </>
  );
}

export default App;
