"use client";
import React, { useEffect, useState, useCallback } from "react";
import QuestionFilters from "./QuestionFilters";
import QuestionsTable from "./QuestionsTable";
import { fetchQuestions, fetchUserSubmissions } from "@/utils/questionsUtil";
import { useSelector } from "react-redux";

const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };

const RightPanel = ({
  filters,
  setFilters,
  filteredQuestions,
  setFilteredQuestions,
  user,
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSubmissions, setUserSubmissions] = useState([]);
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
  useEffect(() => {
    if (!user) return;
    const getUserSubmission = async () => {
      try {
        // Make sure to await the response from fetchUserSubmissions
        const res = await fetchUserSubmissions(user.id);
        setUserSubmissions(res?.data || []);
      } catch (error) {
        console.log(error?.message);
      }
    };
    getUserSubmission();
  }, [user]);

  const enrichedQuestions = questions.map((item, ind) => {
    const submission = userSubmissions.find(
      (sub) => sub?.questionId === item?.id
    );
    const storedQuery = localStorage.getItem(`query-${item.id}`);
    const inProgressFromStorage = storedQuery !== null && storedQuery !== "";

    let status = "-";
    if (submission) {
      status = submission.queryStatus ? "Solved" : "Error";
    } else if (inProgressFromStorage && user) {
      status = "In Progress";
    } else {
      status = "Not Started";
    }

    return { ...item, ind: ind + 1, status };
  });
  useEffect(() => {
    if (questions.length === 0 || userSubmissions.length === 0) return;

    // setQuestions(enrichedQuestions);
    // setFilteredQuestions(enrichedQuestions);
  }, [questions, userSubmissions, setQuestions]);

  // Apply filters when the filters state changes
  useEffect(() => {
    let filtered = [...enrichedQuestions];

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
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((q) => {
        return (
          q.tags &&
          q.tags.some((tag) => {
            // In case tag is an object with an id field, otherwise it is directly the id.
            const tagId = tag?.id || tag;
            return filters.tags.includes(tagId);
          })
        );
      });
    }

    setFilteredQuestions(filtered);
  }, [filters, questions, userSubmissions]);

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

      <QuestionFilters updateFilter={updateFilter} user={user} />

      <QuestionsTable
        questions={filteredQuestions}
        loading={loading}
        user={user}
        setQuestions={setQuestions}
      />
    </div>
  );
};

export default RightPanel;
