import React, { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import FlashcardViewer from "./FlashcardViewer";
import FlashcardTable from "./FlashcardTable";
import Layout from './components/Layout';
import Dashboard from "./pages/Dashboard";
import SplashCards from "./pages/SplashCards";
import { Route, Router, Routes } from "react-router-dom";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [acceptedFlashcards, setAcceptedFlashcards] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);

  const classes = ["Class A", "Class B", "Class C"];

  useEffect(() => {
    const storedFlashcards =
      JSON.parse(localStorage.getItem("acceptedFlashcards")) || [];
    setAcceptedFlashcards(storedFlashcards);
    if (storedFlashcards.length > 0) {
      setShowTable(true);
    }
  }, []);

  const handleGenerateFlashcards = async (text, numFlashcards) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://ai-gamified-api-82go.onrender.com/generate-flashcards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: text,
            num_flashcards: numFlashcards,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFlashcards(data.flashcards);
        setReviewCompleted(false);
      }
    } catch (error) {
      alert("Error calling API.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlashcardAction = (flashcard, action) => {
    if (action === "accept") {
      setAcceptedFlashcards((prev) => {
        const updated = [...prev, flashcard];
        localStorage.setItem("acceptedFlashcards", JSON.stringify(updated));
        console.log("Accepted Flashcards:", updated);
        return updated;
      });
      alert("Flashcard accepted and saved!");
    }
    if (action === "reject") {
      alert("Flashcard rejected!");
    }
  };

  const handleReviewCompleted = () => {
    setReviewCompleted(true);
    setShowTable(true); // Show the table immediately after review is completed
  };

  const handleViewTable = () => {
    console.log("Viewing Saved Flashcards:", acceptedFlashcards);
    setShowTable(true);
  };

  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/splash-cards" element={<SplashCards />} />
        </Routes>
      </Layout>
  );
};

export default App;
