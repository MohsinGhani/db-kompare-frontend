"use client";
import React, { useEffect, useState, useCallback } from "react";
import QuestionFilters from "./QuestionFilters";
import QuestionsTable from "./QuestionsTable";
import { fetchQuestions } from "@/utils/questionsUtil";

const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };

const RightPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: null,
    difficulty: null,
    status: null,
  });

  // Fetch questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetchQuestions();
        const sortedQuestions = response?.data?.sort(
          (a, b) =>
            (difficultyOrder[a.difficulty] || 4) -
            (difficultyOrder[b.difficulty] || 4)
        );
        setQuestions(sortedQuestions);
        setFilteredQuestions(sortedQuestions); // Default filtered data = all data
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Apply filters when the filters state changes
  useEffect(() => {
    let filtered = [...questions];

    if (filters.searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.shortTitle
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          q.companies.some((company) =>
            company.name
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase())
          )
      );
    }

    if (filters.category) {
      filtered = filtered.filter((q) =>
        q.categories.includes(filters.category)
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty);
    }

    if (filters.status) {
      filtered = filtered.filter((q) => q.status === filters.status);
    }

    setFilteredQuestions(filtered);
  }, [filters, questions]);

  // Update filters dynamically
  const updateFilter = useCallback((key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">
          SQL & Data Interview Questions
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Practice the most common SQL, Statistics, ML, and Python questions
          asked in FAANG Data Science & Data Analyst interviews.
        </p>
      </div>

      <QuestionFilters updateFilter={updateFilter} />

      <QuestionsTable questions={filteredQuestions} loading={loading} />
    </div>
  );
};

export default RightPanel;
